<?php

namespace App\Exports;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AssetsExport implements FromQuery, WithHeadings, WithMapping, WithTitle
{
    private const HEADING_ROW = 2;

    private const FIRST_DATA_ROW = 3;

    public function __construct(private readonly array $filters = []) {}

    public function query(): Builder
    {
        return Asset::query()->with('category')->filter($this->filters)->orderBy('asset_code');
    }

    public function title(): string
    {
        return 'REKAPITULASI INVENTARIS ASET TETAP';
    }

    public function headings(): array
    {
        return [
            'No',
            'Kode Aset',
            'Nama Barang',
            'Kategori',
            'Merk / Spesifikasi',
            'Lokasi Penempatan',
            'Kondisi',
            'Tanggal Perolehan',
            'Umur Aset',
            'Status Usulan',
            'Nilai Perolehan (Rp)',
            'Catatan',
        ];
    }

    private int $rowNumber = 0;

    public function map(mixed $row): array
    {
        /** @var Asset $row */
        $this->rowNumber++;

        $ageStr = '-';
        $statusUsulan = 'Aktif';
        if ($row->acquisition_date) {
            $diffY = (int) $row->acquisition_date->diffInYears(now());
            $ageStr = $diffY.' Tahun';
            if ($diffY >= 5) {
                $statusUsulan = 'Siap Lelang / Jual (≥ 5 Th)';
            }
        }

        return [
            $this->rowNumber,
            $row->asset_code,
            $row->name,
            $row->category?->name ?? '-',
            $row->brand_spec ?: '-',
            $row->location,
            $row->status_label,
            $row->acquisition_date?->format('d-m-Y') ?? '-',
            $ageStr,
            $statusUsulan,
            $row->acquisition_value !== null ? (float) $row->acquisition_value : null,
            $row->notes ?: '-',
        ];
    }

    /**
     * @return array<int|string, array<string, mixed>>
     */
    public function styles(Worksheet $sheet): array
    {
        $border = [
            'allBorders' => [
                'top' => ['borderStyle' => Border::BORDER_THIN, 'argb' => 'FFCBD5E1'],
                'bottom' => ['borderStyle' => Border::BORDER_THIN, 'argb' => 'FFCBD5E1'],
                'left' => ['borderStyle' => Border::BORDER_THIN, 'argb' => 'FFCBD5E1'],
                'right' => ['borderStyle' => Border::BORDER_THIN, 'argb' => 'FFCBD5E1'],
            ],
        ];

        return [
            1 => [
                'font' => ['bold' => true, 'size' => 14],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
            ],
            self::HEADING_ROW => [
                'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => Color::COLOR_WHITE]],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF1D4ED8'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                    'wrapText' => true,
                ],
                'borders' => $border['allBorders'],
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5, 'B' => 22, 'C' => 30, 'D' => 20, 'E' => 24,
            'F' => 22, 'G' => 16, 'H' => 16, 'I' => 20, 'J' => 28,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $widths = $this->columnWidths();

                foreach ($sheet->getColumnIterator() as $column) {
                    $letter = $column->getColumnIndex();
                    $sheet->getColumn($letter)->setAutoSize(false);
                    $sheet->getColumn($letter)->setWidth($widths[$letter] ?? 16);
                }

                $lastColumn = 'J';
                $sheet->getStyle("A1:{$lastColumn}1")
                    ->getAlignment()
                    ->setHorizontal('center')
                    ->setVertical('center');
                $sheet->getRowDimension(1)->setRowHeight(26);
                $sheet->getRowDimension(self::HEADING_ROW)->setRowHeight(30);

                $conditionColors = [
                    'baik' => 'FF047857',
                    'servis' => 'FFB45309',
                    'rusak' => 'FFB91C1C',
                ];

                $assets = $this->query()->get();

                foreach ($assets as $i => $asset) {
                    $row = self::FIRST_DATA_ROW + $i;

                    $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal('center');
                    $sheet->getStyle("H{$row}")->getAlignment()->setHorizontal('center');
                    $sheet->getStyle("I{$row}")
                        ->getNumberFormat()
                        ->setFormatCode('#,##0');
                    $sheet->getStyle("G{$row}")
                        ->getFont()
                        ->setBold(true)
                        ->getColor()->setARGB($conditionColors[$asset->condition_status] ?? 'FF334155');
                }

                if ($assets->isNotEmpty()) {
                    $lastRow = self::FIRST_DATA_ROW + $assets->count() - 1;
                    $sheet->getStyle("A3:J{$lastRow}")->getBorders()->getOutline()->setBorderStyle(Border::BORDER_THIN);
                }

                $sheet->setFreezePane('A'.self::FIRST_DATA_ROW);
            },
        ];
    }
}
