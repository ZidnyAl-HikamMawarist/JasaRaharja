<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetCondition;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Perangkat IT', 'code' => 'IT', 'description' => 'Komputer, printer, jaringan', 'icon' => 'Monitor', 'sort_order' => 1],
            ['name' => 'Kendaraan Dinas', 'code' => 'KEND', 'description' => 'Mobil dan motor operasional', 'icon' => 'Car', 'sort_order' => 2],
            ['name' => 'Mebel & Fasilitas', 'code' => 'MBL', 'description' => 'Meja, kursi, lemari, AC', 'icon' => 'Armchair', 'sort_order' => 3],
            ['name' => 'Peralatan Arsip', 'code' => 'ARS', 'description' => 'Lemari arsip dan alat simpan', 'icon' => 'Archive', 'sort_order' => 4],
        ];

        foreach ($categories as $data) {
            AssetCategory::updateOrCreate(['code' => $data['code']], $data);
        }

        $conditions = [
            ['name' => 'Baik', 'slug' => 'baik', 'badge_color' => 'emerald', 'description' => 'Siap digunakan tanpa cacat', 'sort_order' => 1],
            ['name' => 'Perlu Servis', 'slug' => 'servis', 'badge_color' => 'amber', 'description' => 'Masih dapat digunakan namun perlu perbaikan', 'sort_order' => 2],
            ['name' => 'Rusak Berat', 'slug' => 'rusak', 'badge_color' => 'rose', 'description' => 'Tidak dapat digunakan atau perlu penggantian', 'sort_order' => 3],
        ];

        foreach ($conditions as $data) {
            AssetCondition::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $cat = AssetCategory::pluck('id', 'code');
        $cond = AssetCondition::pluck('id', 'slug');

        $assets = [
            ['IT', 'JR-TSK-IT-2020-0001', 'Komputer Desktop PC Kasir', 'Acer Veriton M2680 Core i3', 'Ruang Pelayanan', 'servis', '2020-04-10', 8200000, 'Masa pakai melebihi 5 tahun, masuk daftar usulan lelang'],
            ['IT', 'JR-TSK-IT-2021-0005', 'Printer Laser Monokrom', 'HP Laser M111w', 'Ruang Arsip', 'rusak', '2021-03-15', 2100000, 'Head printer aus, unit usia 5 thn siap lelang'],
            ['IT', 'JR-TSK-IT-2024-0001', 'Komputer Desktop PC', 'Acer Veriton M2680', 'Ruang Pelayanan', 'baik', '2024-02-15', 9500000, 'PC admin dan CS'],
            ['IT', 'JR-TSK-IT-2024-0002', 'Laptop-Service Inspiron 14 inci', 'Dell Inspiron 14 3520', 'Ruang Kasubag', 'baik', '2024-03-01', 12500000, null],
            ['IT', 'JR-TSK-IT-2024-0003', 'Printer Canon Ink Tank', 'Canon G2010', 'Ruang Pelayanan', 'servis', '2023-11-20', 2350000, 'Roller penarik kertas lambat'],
            ['IT', 'JR-TSK-IT-2024-0004', 'Switch Jaringan 24 Port', 'TP-Link TL-SG1024D', 'Ruang Server', 'baik', '2023-08-05', 1750000, null],
            ['IT', 'JR-TSK-IT-2025-0006', 'Scanner Dokumen', 'Epson DS-530', 'Ruang Pelayanan', 'baik', '2025-01-12', 3200000, null],
            ['KEND', 'JR-TSK-KEND-2019-0001', 'Mobil Operasional Lapangan', 'Toyota Kijang Innova 2.0 G', 'Halaman Parkir', 'servis', '2019-06-12', 210000000, 'Usia kendaraan 7 tahun, masuk daftar usulan lelang'],
            ['KEND', 'JR-TSK-KEND-2021-0002', 'Sepeda Motor Operasional', 'Honda Supra X 125 FI', 'Halaman Parkir', 'rusak', '2021-08-20', 16500000, 'Masa operasional 5 tahun, unit aus siap lelang'],
            ['KEND', 'JR-TSK-KEND-2023-0001', 'Mobil Operasional', 'Toyota Avanza 1.3 G M/T', 'Halaman Parkir', 'baik', '2023-04-18', 275000000, 'Bahan bakar subsidi'],
            ['KEND', 'JR-TSK-KEND-2023-0002', 'Motor Petugas', 'Honda Vario 160 CBS-ISS', 'Halaman Parkir', 'servis', '2023-04-18', 27500000, 'Remban belakang perlu diganti'],
            ['KEND', 'JR-TSK-KEND-2024-0003', 'Mobil Operasional', 'Mitsubishi Xpander Cross', 'Halaman Parkir', 'baik', '2024-09-02', 325000000, null],
            ['MBL', 'JR-TSK-MBL-2020-0001', 'Sofa Tamu Eksekutif', 'Custom Leather 3-Seater', 'Ruang Kasubag', 'servis', '2020-01-15', 6800000, 'Usia pakai 6 tahun, kulit sintetis retak siap lelang'],
            ['MBL', 'JR-TSK-MBL-2023-0001', 'Meja Kerja Petugas', 'Custom Kayu 120x60 cm', 'Ruang Pelayanan', 'baik', '2023-01-09', 1850000, null],
            ['MBL', 'JR-TSK-MBL-2023-0002', 'Kursi Petugas', 'Chairmate Caesar CA-103', 'Ruang Pelayanan', 'baik', '2023-01-09', 750000, null],
            ['MBL', 'JR-TSK-MBL-2024-0003', 'Lemari Arsip Pintu Kaca', 'Olympic A028', 'Ruang Arsip', 'baik', '2024-06-21', 2400000, null],
            ['MBL', 'JR-TSK-MBL-2024-0004', 'Air Conditioner 1 PK', 'Daikin FT-QS 9 Series', 'Ruang Kasubag', 'servis', '2024-07-15', 5500000, 'Perlu servis rutin tahunan'],
            ['ARS', 'JR-TSK-ARS-2024-0001', 'Rak Arsip Mobile', 'Custom Steel 4 Slot', 'Ruang Arsip', 'baik', '2024-02-02', 3200000, null],
            ['ARS', 'JR-TSK-ARS-2025-0002', 'Brankas Kantor', 'Ichiko SDB-661', 'Ruang Kasubag', 'baik', '2025-03-11', 4200000, 'Kunci cadangan disimpan di ruang security'],
        ];

        $i = 1;
        foreach ($assets as [$catCode, $code, $name, $brand, $loc, $status, $date, $value, $notes]) {
            Asset::updateOrCreate(['asset_code' => $code], [
                'asset_category_id' => $cat[$catCode],
                'asset_condition_id' => $cond[$status],
                'name' => $name,
                'brand_spec' => $brand,
                'location' => $loc,
                'acquisition_date' => $date,
                'acquisition_value' => $value,
                'condition_status' => $status,
                'notes' => $notes,
            ]);
            $i++;
        }
    }
}
