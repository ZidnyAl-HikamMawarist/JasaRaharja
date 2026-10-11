<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [];
        $add = function (string $key, string $value, string $group) use (&$rows) {
            $rows[] = ['key' => $key, 'value' => $value, 'group' => $group];
        };

        $add('nama_instansi', 'PT Jasa Raharja (Persero)', 'profil');
        $add('nama_kantor', 'Perwakilan Tasikmalaya', 'profil');
        $add('footer_teks', 'Pelayanan santunan kecelakaan lalu lintas.', 'profil');
        $add('profil_tentang', 'Silakan ganti teks profil ini melalui menu Pengaturan pada dashboard admin.', 'profil');
        $add('profil_visor', 'Menjadi mitra perlindungan yang dipercaya masyarakat.', 'profil');
        $add('profil_misi', 'Memberikan pelayanan santunan yang cepat dan akuntabel.', 'profil');
        $add('profil_foto', '', 'profil');

        $add('hero_badge', 'Pelayanan Resmi', 'hero');
        $add('hero_judul', 'Jasa Raharja', 'hero');
        $add('hero_subjudul', 'Perlindungan untuk korban kecelakaan lalu lintas di wilayah Tasikmalaya dan sekitarnya.', 'hero');
        $add('hero_cta_utama_label', 'Lihat Alur Santunan', 'hero');
        $add('hero_cta_utama_url', '#alur-santunan', 'hero');
        $add('hero_cta_kedua_label', 'Hubungi Petugas', 'hero');
        $add('hero_cta_kedua_url', '', 'hero');
        $add('hero_gambar', '', 'hero');

        $add('maklumat_judul', 'Maklumat Layanan', 'hero');
        $add('maklumat_isi', 'Korban kecelakaan lalu lintas yang mengalami cedera berat atau meninggal dunia dapat mengajukan santunan sesuai ketentuan yang berlaku. Silakan hubungi petugas melalui WhatsApp atau datang ke kantor pada jam kerja.', 'hero');
        $add('maklumat_waktu', 'Senin - Jumat, 08.00-16.00 WIB', 'hero');
        $add('maklumat_kanal', 'WhatsApp Dinas', 'hero');
        $add('maklumat_wilayah', '5 Kabupaten/Kota', 'hero');
        $add('maklumat_penyaluran', 'Transfer Bank', 'hero');

        $add('kontak_alamat', 'Jalan Truman No. 10, Kota Tasikmalaya, Jawa Barat 46121', 'kontak');
        $add('kontak_kota', 'Tasikmalaya, Jawa Barat', 'kontak');
        $add('kontak_telepon', '(0265) 123456', 'kontak');
        $add('kontak_email', 'tasikmalaya@jasaraharja.co.id', 'kontak');
        $add('kontak_whatsapp', '6281200000000', 'kontak');
        $add('kontak_maps_embed', '', 'kontak');
        $add('kontak_maps_link', '', 'kontak');
        $add('sosial_instagram', '', 'kontak');
        $add('sosial_facebook', '', 'kontak');
        $add('sosial_youtube', '', 'kontak');
        $add('sosial_twitter', '', 'kontak');

        $add('jam_kerja_1', 'Senin - Kamis|08.00 - 16.00 WIB', 'kontak');
        $add('jam_kerja_2', 'Jumat|08.00 - 15.00 WIB', 'kontak');
        $add('jam_kerja_3', 'Sabtu - Minggu|Libur', 'kontak');

        $add('santunan_judul_langkah_1', 'Terjadinya Kecelakaan', 'santunan');
        $add('santunan_langkah_1', 'Segera laporkan kejadian kepada pihak polisi terdekat.', 'santunan');
        $add('santunan_judul_langkah_2', 'Laporan Polisi', 'santunan');
        $add('santunan_langkah_2', 'Laporan resmi dibuat oleh aparat kewanilikan.', 'santunan');
        $add('santunan_judul_langkah_3', 'Jemput Bola Petugas', 'santunan');
        $add('santunan_langkah_3', 'Petugas datang ke lokasi untuk mendokumentasikan kejadian.', 'santunan');
        $add('santunan_judul_langkah_4', 'Penyerahan Berkas', 'santunan');
        $add('santunan_langkah_4', 'Berkas pendukung diserahkan kepada petugas kantor.', 'santunan');
        $add('santunan_judul_langkah_5', 'Penyaluran Santunan', 'santunan');
        $add('santunan_langkah_5', 'Santunan dicairkan melalui transfer bank.', 'santunan');
        $add('santunan_catatan', 'Persyaratan berkas: KTP, KK, Laporan Polisi, serta kuitansi rawat inap atau surat keterangan kematian.', 'santunan');

        $add('wilayah_nama_1', 'Kota Tasikmalaya', 'wilayah');
        $add('wilayah_deskripsi_1', 'Ibu kota wilayah dan pusat layanan.', 'wilayah');
        $add('wilayah_nama_2', 'Kabupaten Tasikmalaya', 'wilayah');
        $add('wilayah_deskripsi_2', 'Dilayani melalui kantor Representatives Tasikmalaya.', 'wilayah');
        $add('wilayah_nama_3', 'Kabupaten Ciamis', 'wilayah');
        $add('wilayah_deskripsi_3', 'Wilayah layanan di sisi timur.', 'wilayah');
        $add('wilayah_nama_4', 'Kabupaten Banjar', 'wilayah');
        $add('wilayah_deskripsi_4', 'Dilayani dengan titik layanan di wilayah kabupaten.', 'wilayah');
        $add('wilayah_nama_5', 'Kabupaten Pangandaran', 'wilayah');
        $add('wilayah_deskripsi_5', 'Wilayah layanan di kawasan pesisir.', 'wilayah');

        $add('statistik_santunan', '1240', 'statistik');
        $add('statistik_wilayah', '5', 'statistik');
        $add('statistik_petugas', '18', 'statistik');
        $add('tampilkan_statistik', '1', 'statistik');
        $add('tampilkan_ringkasan_aset', '1', 'statistik');

        $add('faq_1_tanya', 'Berapa lama proses santunan diselesaikan?', 'faq');
        $add('faq_1_jawab', 'Dengan berkas lengkap, proses umumnya diselesaikan dalam 7 sampai 14 hari kerja setelah verifikasi.', 'faq');
        $add('faq_2_tanya', 'Apa saja berkas yang harus disiapkan?', 'faq');
        $add('faq_2_jawab', 'KTP, KK, Laporan Polisi, serta kuitansi rawat inap atau surat keterangan kematian.', 'faq');
        $add('faq_3_tanya', 'Apakah semua biaya ditanggung?', 'faq');
        $add('faq_3_jawab', 'Tidak. Santunan diberikan sesuai ketentuan perundang-undangan yang berlaku.', 'faq');
        $add('faq_4_tanya', 'Bagaimana cara menghubungi petugas?', 'faq');
        $add('faq_4_jawab', 'Gunakan tombol WhatsApp pada situs ini atau datang langsung ke kantor pada jam kerja.', 'faq');

        $add('pdf_pejabat', '.................................', 'profil');
        $add('pdf_jabatan', 'Kepala Perwakilan', 'profil');
        $add('pdf_periode', now()->translatedFormat('F Y'), 'profil');

        SiteSetting::seed($rows);
    }
}
