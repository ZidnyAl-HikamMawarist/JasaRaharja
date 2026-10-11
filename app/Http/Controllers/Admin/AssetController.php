<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetCondition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'kategori' => ['nullable', 'integer', 'exists:asset_categories,id'],
            'status' => ['nullable', 'in:baik,servis,rusak'],
            'lelang' => ['nullable', 'in:semua,siap,aktif'],
            'lokasi' => ['nullable', 'string', 'max:100'],
            'sort' => ['nullable', 'in:terlama,terbaru,nama,kode,umur'],
        ]);

        $query = Asset::query()
            ->with('category')
            ->filter([
                'q' => $filters['q'] ?? null,
                'category' => $filters['kategori'] ?? null,
                'status' => $filters['status'] ?? null,
                'lelang' => $filters['lelang'] ?? null,
                'location' => $filters['lokasi'] ?? null,
            ]);

        match ($filters['sort'] ?? 'terlama') {
            'terbaru' => $query->latest(),
            'nama' => $query->orderBy('name'),
            'kode' => $query->orderBy('asset_code'),
            'umur' => $query->orderBy('acquisition_date', 'asc'),
            default => $query->oldest('asset_code'),
        };

        $assets = $query->paginate(15)
            ->withQueryString()
            ->through(fn (Asset $a) => $this->row($a));

        return Inertia::render('admin/AssetIndex', array_merge($this->adminShell('inventaris', 'Inventaris Aset Tetap'), [
            'assets' => $assets,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'kategori' => $filters['kategori'] ?? null,
                'status' => $filters['status'] ?? null,
                'lelang' => $filters['lelang'] ?? null,
                'lokasi' => $filters['lokasi'] ?? '',
                'sort' => $filters['sort'] ?? 'terlama',
            ],
            'categories' => $this->categoryOptions(),
            'summary' => $this->summary($filters),
            'locations' => Asset::query()->distinct()->orderBy('location')->pluck('location'),
        ]));
    }

    public function create(): Response
    {
        return Inertia::render('admin/AssetForm', array_merge($this->adminShell('inventaris', 'Tambah Aset Baru'), [
            'asset' => null,
            'categories' => $this->categoryOptions(),
            'statuses' => $this->statusOptions(),
            'suggestedCode' => Asset::generateCode(),
            'locations' => Asset::query()->distinct()->orderBy('location')->pluck('location'),
        ]));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $asset = Asset::create([
            ...$data,
            'asset_code' => $data['asset_code'] ?: Asset::generateCode($data['asset_category_id']),
        ]);


        return redirect()->route('admin.inventaris.index')
            ->with('success', 'Aset '.$asset->asset_code.' berhasil ditambahkan.');
    }

    public function edit(Asset $asset): Response
    {
        return Inertia::render('admin/AssetForm', array_merge($this->adminShell('inventaris', 'Ubah Aset'), [
            'asset' => [
                'id' => $asset->id,
                'asset_code' => $asset->asset_code,
                'asset_category_id' => $asset->asset_category_id,
                'name' => $asset->name,
                'brand_spec' => $asset->brand_spec,
                'location' => $asset->location,
                'acquisition_date' => $asset->acquisition_date?->toDateString(),
                'acquisition_value' => $asset->acquisition_value !== null ? (float) $asset->acquisition_value : null,
                'condition_status' => $asset->condition_status,
                'notes' => $asset->notes,
            ],
            'categories' => $this->categoryOptions(),
            'statuses' => $this->statusOptions(),
            'suggestedCode' => Asset::generateCode(),
            'locations' => Asset::query()->distinct()->orderBy('location')->pluck('location'),
        ]));
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        $data = $this->validated($request);

        if (blank($data['asset_code'] ?? null)) {
            unset($data['asset_code']);
        }

        $asset->update($data);

        return redirect()->route('admin.inventaris.index')->with('success', 'Aset '.$asset->asset_code.' berhasil diperbarui.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $code = $asset->asset_code;
        $asset->delete();

        return back()->with('success', 'Aset '.$code.' telah dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'asset_code' => ['nullable', 'string', 'max:50', 'regex:/^[A-Za-z0-9\/\-]+$/'],
            'asset_category_id' => ['required', 'integer', 'exists:asset_categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'brand_spec' => ['nullable', 'string', 'max:200'],
            'location' => ['required', 'string', 'max:100'],
            'acquisition_date' => ['nullable', 'date'],
            'acquisition_value' => ['nullable', 'numeric', 'min:0', 'max:99999999999'],
            'condition_status' => ['required', 'in:baik,servis,rusak'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ], [], [
            'asset_category_id' => 'kategori aset',
            'name' => 'nama barang',
            'location' => 'lokasi penempatan',
            'condition_status' => 'kondisi aset',
        ]);

        return [
            'asset_code' => ! empty($data['asset_code']) ? strtoupper($data['asset_code']) : null,
            'asset_category_id' => (int) $data['asset_category_id'],
            'name' => $data['name'],
            'brand_spec' => $data['brand_spec'] ?? null,
            'location' => $data['location'],
            'acquisition_date' => $data['acquisition_date'] ?? null,
            'acquisition_value' => ($data['acquisition_value'] ?? '') === ''
                ? null
                : (float) $data['acquisition_value'],
            'condition_status' => $data['condition_status'],
            'notes' => $data['notes'] ?? null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function row(Asset $a): array
    {
        $now = now();
        $ageYears = null;
        $ageFormatted = '-';
        $ageDetail = '-';
        $isAuctionEligible = false;

        if ($a->acquisition_date) {
            $diffYears = (int) $a->acquisition_date->diffInYears($now);
            $diffMonthsTotal = (int) $a->acquisition_date->diffInMonths($now);
            $diffMonths = $diffMonthsTotal % 12;
            $ageYears = $diffYears;
            $isAuctionEligible = $diffYears >= 5;

            if ($diffYears >= 1) {
                $ageFormatted = $diffYears.' Tahun';
                $ageDetail = $diffMonths > 0 ? "{$diffYears} thn {$diffMonths} bln" : "{$diffYears} tahun";
            } elseif ($diffMonthsTotal >= 1) {
                $ageFormatted = $diffMonthsTotal.' Bulan';
                $ageDetail = "{$diffMonthsTotal} bulan";
            } else {
                $ageFormatted = '< 1 Bulan';
                $ageDetail = 'Baru';
            }
        }

        return [
            'id' => $a->id,
            'asset_code' => $a->asset_code,
            'name' => $a->name,
            'brand_spec' => $a->brand_spec,
            'location' => $a->location,
            'category' => $a->category?->name,
            'category_code' => $a->category?->code,
            'condition_status' => $a->condition_status,
            'condition_label' => $a->status_label,
            'acquisition_date' => $a->acquisition_date?->format('d M Y'),
            'acquisition_date_raw' => $a->acquisition_date?->toDateString(),
            'age_years' => $ageYears,
            'age_formatted' => $ageFormatted,
            'age_detail' => $ageDetail,
            'is_auction_eligible' => $isAuctionEligible,
            'acquisition_value' => $a->acquisition_value !== null ? (float) $a->acquisition_value : null,
            'notes' => $a->notes,
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    private function summary(array $filters): array
    {
        $base = fn () => Asset::query()->filter([
            'q' => $filters['q'] ?? null,
            'category' => $filters['kategori'] ?? null,
            'status' => $filters['status'] ?? null,
            'lelang' => $filters['lelang'] ?? null,
            'location' => $filters['lokasi'] ?? null,
        ]);

        $counts = $base()->selectRaw('condition_status, COUNT(*) as total')
            ->groupBy('condition_status')
            ->pluck('total', 'condition_status');

        $value = $base()->whereNotNull('acquisition_value')->sum('acquisition_value');

        $siapLelang = Asset::query()->filter([
            'q' => $filters['q'] ?? null,
            'category' => $filters['kategori'] ?? null,
            'status' => $filters['status'] ?? null,
            'location' => $filters['lokasi'] ?? null,
        ])->whereNotNull('acquisition_date')
            ->where('acquisition_date', '<=', now()->subYears(5))
            ->count();

        return [
            'total' => $base()->count(),
            'baik' => (int) ($counts['baik'] ?? 0),
            'servis' => (int) ($counts['servis'] ?? 0),
            'rusak' => (int) ($counts['rusak'] ?? 0),
            'siap_lelang' => (int) $siapLelang,
            'nilai' => (float) $value,
        ];
    }

    /**
     * @return array<int, array{id: int, name: string, code: string}>
     */
    private function categoryOptions(): array
    {
        return AssetCategory::orderBy('sort_order')->get()
            ->map(fn (AssetCategory $c) => ['id' => $c->id, 'name' => $c->name, 'code' => $c->code])
            ->all();
    }

    /**
     * @return array<int, array{value: string, label: string, tone: string}>
     */
    private function statusOptions(): array
    {
        return collect(Asset::STATUSES)->map(fn (string $s) => [
            'value' => $s,
            'label' => Asset::STATUS_LABELS[$s],
            'tone' => match ($s) {
                'baik' => 'emerald',
                'servis' => 'amber',
                default => 'rose',
            },
        ])->all();
    }
}
