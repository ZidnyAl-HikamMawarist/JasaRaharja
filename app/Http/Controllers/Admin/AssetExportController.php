<?php

namespace App\Http\Controllers\Admin;

use App\Exports\AssetsExport;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssetExportController extends Controller
{
    public function __construct() {}

    /**
     * Filter yang dipakai bersama oleh excel/csv/pdf.
     *
     * @return array<string, mixed>
     */
    private function filters(Request $request): array
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'kategori' => ['nullable', 'integer', 'exists:asset_categories,id'],
            'status' => ['nullable', 'in:baik,servis,rusak'],
            'lelang' => ['nullable', 'in:semua,siap,aktif'],
            'lokasi' => ['nullable', 'string', 'max:100'],
        ]);

        return [
            'q' => $validated['q'] ?? null,
            'category' => $validated['kategori'] ?? null,
            'status' => $validated['status'] ?? null,
            'lelang' => $validated['lelang'] ?? null,
            'location' => $validated['lokasi'] ?? null,
        ];
    }

    private function filename(string $ext): string
    {
        return sprintf(
            'Inventaris-Aset-JasaRaharja-Tasikmalaya-%s.%s',
            now()->format('Y-m-d'),
            $ext
        );
    }

    public function excel(Request $request)
    {
        return Excel::download(new AssetsExport($this->filters($request)), $this->filename('xlsx'));
    }

    public function csv(Request $request): StreamedResponse
    {
        return response()->streamDownload(function () use ($request) {
            $handle = fopen('php://output', 'wb');
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'No', 'Kode Aset', 'Nama Barang', 'Kategori', 'Merk / Spesifikasi',
                'Lokasi Penempatan', 'Kondisi', 'Tanggal Perolehan', 'Umur Aset', 'Status Usulan', 'Nilai Perolehan (Rp)', 'Catatan',
            ], ';');

            Asset::query()->with('category')->filter($this->filters($request))->orderBy('asset_code')
                ->cursor()
                ->each(function (Asset $a, int $i) use ($handle) {
                    $ageStr = '-';
                    $statusUsulan = 'Aktif';
                    if ($a->acquisition_date) {
                        $diffY = (int) $a->acquisition_date->diffInYears(now());
                        $ageStr = $diffY.' Tahun';
                        if ($diffY >= 5) {
                            $statusUsulan = 'Siap Lelang / Jual (≥ 5 Th)';
                        }
                    }

                    fputcsv($handle, [
                        $i + 1,
                        $a->asset_code,
                        $a->name,
                        $a->category?->name ?? '-',
                        $a->brand_spec ?: '-',
                        $a->location,
                        $a->status_label,
                        $a->acquisition_date?->format('d-m-Y') ?? '-',
                        $ageStr,
                        $statusUsulan,
                        $a->acquisition_value !== null ? (float) $a->acquisition_value : '',
                        $a->notes ?: '-',
                    ], ';');
                });

            fclose($handle);
        }, $this->filename('csv'), [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-store, no-cache',
        ]);
    }

    public function pdf(Request $request): Response
    {
        $assets = Asset::query()
            ->with('category')
            ->filter($this->filters($request))
            ->orderBy('asset_code')
            ->get();

        $counts = $assets->groupBy('condition_status')->map->count();

        $pdf = Pdf::loadView('exports.inventory-pdf', [
            'assets' => $assets,
            'counts' => [
                'baik' => $counts['baik'] ?? 0,
                'servis' => $counts['servis'] ?? 0,
                'rusak' => $counts['rusak'] ?? 0,
            ],
            'nilai' => $assets->whereNotNull('acquisition_value')->sum('acquisition_value'),
            'meta' => [
                'instansi' => Setting::text('nama_instansi', 'PT Jasa Raharja (Persero)'),
                'kantor' => Setting::text('nama_kantor', 'Perwakilan Tasikmalaya'),
                'alamat' => Setting::text('kontak_alamat', ''),
                'telepon' => Setting::text('kontak_telepon', ''),
                'email' => Setting::text('kontak_email', ''),
                'kota' => Setting::text('kontak_kota', 'Tasikmalaya'),
                'pejabat' => Setting::text('pdf_pejabat', '.................................'),
                'jabatan' => Setting::text('pdf_jabatan', 'Kepala Perwakilan'),
                'periode' => Setting::text('pdf_periode', now()->translatedFormat('F Y')),
            ],
        ])
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'isRemoteEnabled' => false,
                'isHtml5ParserEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
            ]);

        return $pdf->download($this->filename('pdf'));
    }
}
