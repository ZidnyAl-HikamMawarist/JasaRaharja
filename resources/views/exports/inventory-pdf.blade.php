<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Rekapitulasi Inventaris</title>
    <style>
        @page { margin: 30px 20px 40px; }
        * { box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 8.5pt;
            color: #1e293b;
            margin: 0;
        }
        .kop {
            display: flex;
            align-items: center;
            gap: 16px;
            border-bottom: 3px solid #1d4ed8;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }
        .lambang {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            background: #1d4ed8;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 11pt;
            flex: 0 0 auto;
        }
        .kop-teks { line-height: 1.35; }
        .kop-teks .instansi { font-weight: bold; font-size: 11pt; letter-spacing: .3px; }
        .kop-teks .kantor { font-weight: bold; font-size: 10pt; color: #1d4ed8; }
        .kop-teks .alamat { font-size: 8pt; color: #475569; }

        h1 {
            font-size: 12pt;
            text-align: center;
            margin: 6px 0 2px;
            letter-spacing: .4px;
        }
        .periode { text-align: center; font-size: 8.5pt; color: #475569; margin-bottom: 12px; }

        .ringkas {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }
        .kotak {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 6px 8px;
            background: #f8fafc;
        }
        .kotak .label { font-size: 7pt; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }
        .kotak .nilai { font-size: 13pt; font-weight: bold; color: #1d4ed8; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 4px 5px;
            vertical-align: top;
        }
        th {
            background: #1d4ed8;
            color: #fff;
            font-size: 7.5pt;
            text-align: center;
            font-weight: bold;
        }
        td { font-size: 7.8pt; }
        td.num { text-align: center; }
        td.uang { text-align: right; }
        tbody tr:nth-child(even) td { background: #f1f5f9; }
        .baik { color: #047857; font-weight: bold; }
        .servis { color: #b45309; font-weight: bold; }
        .rusak { color: #b91c1c; font-weight: bold; }

        .ttd { text-align: right; margin-top: 24px; }
        .ttd-inner { display: inline-block; text-align: center; min-width: 200px; }
        .ttd-nama { font-weight: bold; text-decoration: underline; margin-top: 52px; }
    </style>
</head>
<body>
    <div class="kop">
        <div class="lambang">JR</div>
        <div class="kop-teks">
            <div class="instansi">{{ $meta['instansi'] }}</div>
            <div class="kantor">{{ $meta['kantor'] }}</div>
            <div class="alamat">{{ $meta['alamat'] }} {{ $meta['kota'] }}</div>
            <div class="alamat">Telp. {{ $meta['telepon'] }} &nbsp;|&nbsp; {{ $meta['email'] }}</div>
        </div>
    </div>

    <h1>REKAPITULASI INVENTARIS ASET TETAP</h1>
    <div class="periode">Periode: {{ $meta['periode'] }}</div>

    <div class="ringkas">
        <div class="kotak">
            <div class="label">Total Aset</div>
            <div class="nilai">{{ $assets->count() }}</div>
        </div>
        <div class="kotak">
            <div class="label">Kondisi Baik</div>
            <div class="nilai">{{ $counts['baik'] }}</div>
        </div>
        <div class="kotak">
            <div class="label">Perlu Servis</div>
            <div class="nilai">{{ $counts['servis'] }}</div>
        </div>
        <div class="kotak">
            <div class="label">Rusak Berat</div>
            <div class="nilai">{{ $counts['rusak'] }}</div>
        </div>
        <div class="kotak">
            <div class="label">Siap Lelang (&ge; 5 Th)</div>
            <div class="nilai" style="color: #b45309">{{ $assets->filter(fn($a) => $a->acquisition_date && $a->acquisition_date->diffInYears(now()) >= 5)->count() }}</div>
        </div>
        <div class="kotak">
            <div class="label">Nilai Perolehan</div>
            <div class="nilai">Rp {{ number_format($nilai, 0, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 24px">No</th>
                <th style="width: 90px">Kode Aset</th>
                <th>Nama Barang</th>
                <th style="width: 76px">Kategori</th>
                <th style="width: 90px">Merk / Spesifikasi</th>
                <th style="width: 72px">Lokasi</th>
                <th style="width: 58px">Kondisi</th>
                <th style="width: 60px">Tgl Perolehan</th>
                <th style="width: 68px">Umur / Usulan</th>
                <th style="width: 74px">Nilai (Rp)</th>
                <th style="width: 88px">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($assets as $i => $asset)
                <tr>
                    <td class="num">{{ $i + 1 }}</td>
                    <td>{{ $asset->asset_code }}</td>
                    <td>{{ $asset->name }}</td>
                    <td>{{ $asset->category?->name ?? '-' }}</td>
                    <td>{{ $asset->brand_spec ?: '-' }}</td>
                    <td>{{ $asset->location }}</td>
                    <td class="{{ $asset->condition_status }}">{{ $asset->status_label }}</td>
                    <td class="num">{{ $asset->acquisition_date?->format('d-m-Y') ?? '-' }}</td>
                    <td class="num">
                        @if ($asset->acquisition_date)
                            @php
                                $diffY = (int) $asset->acquisition_date->diffInYears(now());
                            @endphp
                            {{ $diffY }} Thn
                            @if ($diffY >= 5)
                                <br><span style="color:#b45309; font-weight:bold; font-size:7pt;">(Siap Lelang)</span>
                            @endif
                        @else
                            -
                        @endif
                    </td>
                    <td class="uang">{{ $asset->acquisition_value !== null ? number_format((float) $asset->acquisition_value, 0, ',', '.') : '-' }}</td>
                    <td>{{ $asset->notes ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="11" style="text-align:center; padding: 18px;">Tidak ada data aset sesuai filter.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="ttd">
        <div class="ttd-inner">
            {{ $meta['kota'] }}, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
            {{ $meta['jabatan'] }}<br>
            <div class="ttd-nama">{{ $meta['pejabat'] }}</div>
        </div>
    </div>
</body>
</html>
