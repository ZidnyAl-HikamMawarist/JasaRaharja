import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Home,
    Phone,
    Shield,
    MapPin,
    HelpCircle,
    Building2,
    User,
    Check,
    Save,
    ExternalLink,
    ShieldCheck,
    KeyRound,
    UserCheck,
    Calendar,
    Mail,
    Lock,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';

const TABS = [
    { key: 'hero', label: 'Beranda & Hero', icon: Home },
    { key: 'kontak', label: 'Kontak', icon: Phone },
    { key: 'santunan', label: 'Alur Santunan', icon: Shield },
    { key: 'wilayah', label: 'Wilayah Layanan', icon: MapPin },
    { key: 'faq', label: 'FAQ & Jam Kerja', icon: HelpCircle },
    { key: 'profil', label: 'Profil & Footer', icon: Building2 },
    { key: 'akun', label: 'Akun Administrator', icon: User },
];

export default function SettingsEdit({ activeMenu, title, stats, flat, user }) {
    const getInitialTab = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const queryTab = params.get('tab');
            if (queryTab && TABS.some((t) => t.key === queryTab)) {
                return queryTab;
            }
        }
        return 'hero';
    };

    const [tab, setTab] = useState(getInitialTab);
    const { data, setData, put, processing, errors } = useForm(flat);

    const profileForm = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role_label: user?.role_label || 'Administrator',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (user) {
            profileForm.setData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                role_label: user.role_label || 'Administrator',
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        }
    }, [user]);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const queryTab = params.get('tab');
            if (queryTab && TABS.some((t) => t.key === queryTab)) {
                setTab(queryTab);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const changeTab = (newTab) => {
        setTab(newTab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', newTab);
            window.history.pushState({}, '', url.toString());
        }
    };

    useEffect(() => {
        const handler = (e) => {
            const target = e.target;
            if (!target.name) return;
            setData(target.name, target.type === 'checkbox' ? target.checked : target.value);
        };
        document.addEventListener('input', handler);
        return () => document.removeEventListener('input', handler);
    }, [setData]);

    const submit = (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => form.append(key, value));
        const fileInput = document.getElementById('hero_gambar');
        if (fileInput?.files?.length) {
            form.append('hero_gambar', fileInput.files[0]);
        }
        const photoInput = document.getElementById('profil_foto');
        if (photoInput?.files?.length) {
            form.append('profil_foto', photoInput.files[0]);
        }
        put('/admin/pengaturan', form);
    };

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.put('/admin/pengaturan/profil', {
            preserveScroll: true,
            onSuccess: () => {
                profileForm.reset('current_password', 'password', 'password_confirmation');
            },
        });
    };

    const set = (key) => (e) => setData(key, e.target.value);
    const setFile = (key) => (e) => setData(key, e.target.files?.[0] ?? null);
    const val = (key) => flat[key] ?? '';

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title="Pengaturan Kantor & Portal" />

            <form onSubmit={submit} encType="multipart/form-data">
                <div className="card p-2.5 bg-white/90 backdrop-blur-md">
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => changeTab(t.key)}
                                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                                    tab === t.key
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                            >
                                <t.icon className="size-3.5" />
                                <span>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    {tab === 'hero' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Panel title="Identitas" icon="badge">
                                <Field label="Nama Instansi" name="nama_instansi" value={val('nama_instansi')} onChange={set('nama_instansi')} />
                                <Field label="Nama Kantor" name="nama_kantor" value={val('nama_kantor')} onChange={set('nama_kantor')} />
                            </Panel>

                            <Panel title="Hero Banner" icon="image">
                                <Field label="Badge" name="hero_badge" value={val('hero_badge')} onChange={set('hero_badge')} />
                                <Field label="Judul Hero" name="hero_judul" value={val('hero_judul')} onChange={set('hero_judul')} />
                                <TextArea label="Subjudul" name="hero_subjudul" value={val('hero_subjudul')} onChange={set('hero_subjudul')} rows={3} />
                                <FileField label="Gambar Hero" name="hero_gambar" current={val('hero_gambar')} onChange={setFile('hero_gambar')} />
                            </Panel>

                            <Panel title="Tombol Aksi" icon="link">
                                <Field label="Label Tombol Utama" name="hero_cta_utama_label" value={val('hero_cta_utama_label')} onChange={set('hero_cta_utama_label')} />
                                <Field label="URL Tombol Utama" name="hero_cta_utama_url" value={val('hero_cta_utama_url')} onChange={set('hero_cta_utama_url')} />
                                <Field label="Label Tombol Kedua" name="hero_cta_kedua_label" value={val('hero_cta_kedua_label')} onChange={set('hero_cta_kedua_label')} />
                                <Field label="URL Tombol Kedua (kosong = WhatsApp)" name="hero_cta_kedua_url" value={val('hero_cta_kedua_url')} onChange={set('hero_cta_kedua_url')} />
                            </Panel>

                            <Panel title="Maklumat Layanan" icon="info">
                                <Field label="Judul Maklumat" name="maklumat_judul" value={val('maklumat_judul')} onChange={set('maklumat_judul')} />
                                <TextArea label="Isi Maklumat" name="maklumat_isi" value={val('maklumat_isi')} onChange={set('maklumat_isi')} rows={5} />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Waktu Layanan" name="maklumat_waktu" value={val('maklumat_waktu')} onChange={set('maklumat_waktu')} />
                                    <Field label="Kanal Konsultasi" name="maklumat_kanal" value={val('maklumat_kanal')} onChange={set('maklumat_kanal')} />
                                    <Field label="Lingkup Wilayah" name="maklumat_wilayah" value={val('maklumat_wilayah')} onChange={set('maklumat_wilayah')} />
                                    <Field label="Penyaluran" name="maklumat_penyaluran" value={val('maklumat_penyaluran')} onChange={set('maklumat_penyaluran')} />
                                </div>
                            </Panel>
                        </div>
                    )}

                    {tab === 'kontak' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Panel title="Informasi Kontak" icon="phone">
                                <TextArea label="Alamat" name="kontak_alamat" value={val('kontak_alamat')} onChange={set('kontak_alamat')} rows={2} />
                                <Field label="Kota / Kabupaten" name="kontak_kota" value={val('kontak_kota')} onChange={set('kontak_kota')} />
                                <Field label="Telepon" name="kontak_telepon" value={val('kontak_telepon')} onChange={set('kontak_telepon')} />
                                <Field label="Email" type="email" name="kontak_email" value={val('kontak_email')} onChange={set('kontak_email')} error={errors.kontak_email} />
                                <Field label="Nomor WhatsApp (62xxx)" name="kontak_whatsapp" value={val('kontak_whatsapp')} onChange={set('kontak_whatsapp')} />
                            </Panel>

                            <Panel title="Peta Lokasi" icon="map">
                                <TextArea label="URL Embed Google Maps (iframe src)" name="kontak_maps_embed" value={val('kontak_maps_embed')} onChange={set('kontak_maps_embed')} rows={4} />
                                <p className="-mt-2 text-xs text-slate-500">
                                    Salin nilai <code className="rounded bg-slate-100 px-1">src</code> dari
                                    iframe Google Maps.
                                </p>
                                <Field label="Tautan Google Maps" name="kontak_maps_link" value={val('kontak_maps_link')} onChange={set('kontak_maps_link')} error={errors.kontak_maps_link} />
                            </Panel>

                            <Panel title="Media Sosial" icon="share">
                                <Field label="Instagram" name="sosial_instagram" value={val('sosial_instagram')} onChange={set('sosial_instagram')} />
                                <Field label="Facebook" name="sosial_facebook" value={val('sosial_facebook')} onChange={set('sosial_facebook')} />
                                <Field label="YouTube" name="sosial_youtube" value={val('sosial_youtube')} onChange={set('sosial_youtube')} />
                                <Field label="X / Twitter" name="sosial_twitter" value={val('sosial_twitter')} onChange={set('sosial_twitter')} />
                            </Panel>
                        </div>
                    )}

                    {tab === 'santunan' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Panel key={i} title={`Langkah ${i}`} icon="steps">
                                    <Field
                                        label="Judul Langkah"
                                        name={`santunan_judul_langkah_${i}`}
                                        value={val(`santunan_judul_langkah_${i}`)}
                                        onChange={set(`santunan_judul_langkah_${i}`)}
                                    />
                                    <TextArea
                                        label="Keterangan"
                                        name={`santunan_langkah_${i}`}
                                        value={val(`santunan_langkah_${i}`)}
                                        onChange={set(`santunan_langkah_${i}`)}
                                        rows={3}
                                    />
                                </Panel>
                            ))}
                            <div className="lg:col-span-2">
                                <Panel title="Catatan Alur" icon="info">
                                    <TextArea
                                        label="Catatan"
                                        name="santunan_catatan"
                                        value={val('santunan_catatan')}
                                        onChange={set('santunan_catatan')}
                                        rows={3}
                                    />
                                </Panel>
                            </div>
                        </div>
                    )}

                    {tab === 'wilayah' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                                const name = val(`wilayah_nama_${i}`);
                                if (!name && i > 6) return null;
                                return (
                                    <Panel key={i} title={`Wilayah ${i}`} icon="map">
                                        <Field label="Nama" name={`wilayah_nama_${i}`} value={name} onChange={set(`wilayah_nama_${i}`)} />
                                        <TextArea label="Deskripsi" name={`wilayah_deskripsi_${i}`} value={val(`wilayah_deskripsi_${i}`)} onChange={set(`wilayah_deskripsi_${i}`)} rows={2} />
                                    </Panel>
                                );
                            })}
                        </div>
                    )}

                    {tab === 'faq' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Panel key={i} title={`FAQ ${i}`} icon="help">
                                    <Field label="Pertanyaan" name={`faq_${i}_tanya`} value={val(`faq_${i}_tanya`)} onChange={set(`faq_${i}_tanya`)} />
                                    <TextArea label="Jawaban" name={`faq_${i}_jawab`} value={val(`faq_${i}_jawab`)} onChange={set(`faq_${i}_jawab`)} rows={3} />
                                </Panel>
                            ))}

                            <div className="lg:col-span-2">
                                <Panel title="Jam Kerja" icon="clock">
                                    <p className="-mt-2 text-xs text-slate-500">
                                        Format: <code className="rounded bg-slate-100 px-1">Hari|Jam</code>
                                    </p>
                                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                        <Field
                                            key={i}
                                            label={`Baris ${i}`}
                                            name={`jam_kerja_${i}`}
                                            value={val(`jam_kerja_${i}`)}
                                            onChange={set(`jam_kerja_${i}`)}
                                        />
                                    ))}
                                </Panel>
                            </div>
                        </div>
                    )}

                    {tab === 'profil' && (
                        <div className="grid gap-6 lg:grid-cols-2">
                            <Panel title="Profil Kantor" icon="office">
                                <TextArea label="Tentang" name="profil_tentang" value={val('profil_tentang')} onChange={set('profil_tentang')} rows={5} />
                                <TextArea label="Visi" name="profil_visor" value={val('profil_visor')} onChange={set('profil_visor')} rows={3} />
                                <TextArea label="Misi" name="profil_misi" value={val('profil_misi')} onChange={set('profil_misi')} rows={3} />
                                <FileField label="Foto Kantor" name="profil_foto" current={val('profil_foto')} onChange={setFile('profil_foto')} />
                            </Panel>

                            <div className="space-y-6">
                                <Panel title="Footer" icon="footer">
                                    <Field label="Teks Footer" name="footer_teks" value={val('footer_teks')} onChange={set('footer_teks')} />
                                </Panel>

                                <Panel title="Kop Surat PDF" icon="file">
                                    <Field label="Nama Pejabat" name="pdf_pejabat" value={val('pdf_pejabat')} onChange={set('pdf_pejabat')} />
                                    <Field label="Jabatan" name="pdf_jabatan" value={val('pdf_jabatan')} onChange={set('pdf_jabatan')} />
                                    <Field label="Periode" name="pdf_periode" value={val('pdf_periode')} onChange={set('pdf_periode')} />
                                </Panel>

                                <Panel title="Tampilan Landing Page" icon="eye">
                                    <Toggle
                                        label="Tampilkan statistik"
                                        name="tampilkan_statistik"
                                        checked={Boolean(flat.tampilkan_statistik)}
                                        onChange={set('tampilkan_statistik')}
                                    />
                                    <Toggle
                                        label="Tampilkan ringkasan aset"
                                        name="tampilkan_ringkasan_aset"
                                        checked={Boolean(flat.tampilkan_ringkasan_aset)}
                                        onChange={set('tampilkan_ringkasan_aset')}
                                    />
                                </Panel>
                            </div>
                        </div>
                    )}
                </div>

                {tab !== 'akun' && (
                    <div className="sticky bottom-4 mt-6">
                        <div className="card flex flex-wrap items-center justify-between gap-4 p-4 shadow-xl shadow-slate-900/10">
                            <p className="text-sm text-slate-600">
                                Perubahan berlaku langsung setelah disimpan.
                            </p>
                            <div className="flex gap-2">
                                <a href="/" target="_blank" rel="noreferrer" className="btn-secondary">
                                    Lihat Situs
                                </a>
                                <button type="submit" disabled={processing} className="btn-primary px-6">
                                    {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {tab === 'akun' && (
                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <form onSubmit={submitProfile} className="card p-6 lg:col-span-7 space-y-6">
                        <div>
                            <h2 className="text-base font-extrabold text-slate-900">Pengaturan Akun Administrator</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Perbarui data identitas pribadi dan kredensial akses dashboard.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Field
                                label="Nama Lengkap"
                                name="name"
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                error={profileForm.errors.name}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Username"
                                    name="username"
                                    value={profileForm.data.username}
                                    onChange={(e) => profileForm.setData('username', e.target.value)}
                                    error={profileForm.errors.username}
                                />
                                <Field
                                    label="Jabatan / Peran"
                                    name="role_label"
                                    value={profileForm.data.role_label}
                                    onChange={(e) => profileForm.setData('role_label', e.target.value)}
                                    error={profileForm.errors.role_label}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    error={profileForm.errors.email}
                                />
                                <Field
                                    label="Nomor Telepon / WhatsApp"
                                    name="phone"
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    error={profileForm.errors.phone}
                                />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-2 mb-1">
                                <KeyRound className="size-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900">
                                    Ganti Kata Sandi (Opsional)
                                </h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">
                                Kosongkan jika Anda tidak ingin mengubah kata sandi login saat ini.
                            </p>
                            <div className="space-y-4">
                                <Field
                                    label="Kata Sandi Saat Ini"
                                    type="password"
                                    name="current_password"
                                    value={profileForm.data.current_password}
                                    onChange={(e) => profileForm.setData('current_password', e.target.value)}
                                    error={profileForm.errors.current_password}
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Kata Sandi Baru"
                                        type="password"
                                        name="password"
                                        value={profileForm.data.password}
                                        onChange={(e) => profileForm.setData('password', e.target.value)}
                                        error={profileForm.errors.password}
                                    />
                                    <Field
                                        label="Ulangi Kata Sandi Baru"
                                        type="password"
                                        name="password_confirmation"
                                        value={profileForm.data.password_confirmation}
                                        onChange={(e) => profileForm.setData('password_confirmation', e.target.value)}
                                        error={profileForm.errors.password_confirmation}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
                            >
                                <Save className="size-4" />
                                <span>{profileForm.processing ? 'Menyimpan Perubahan...' : 'Simpan Profil & Kredensial'}</span>
                            </button>
                        </div>
                    </form>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="card p-6 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 border border-slate-200/80 shadow-xs">
                            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
                                    {userInitials}
                                </div>
                                <div className="min-w-0">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Akun Aktif
                                    </span>
                                    <h3 className="text-base font-extrabold text-slate-900 truncate mt-1">
                                        {profileForm.data.name || 'Administrator'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium truncate">
                                        @{profileForm.data.username || 'admin'} · {profileForm.data.role_label || 'Administrator'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3.5 text-xs">
                                <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100/60">
                                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                                        <Mail className="size-3.5 text-slate-400" />
                                        Email
                                    </span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                                        {profileForm.data.email || '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100/60">
                                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                                        <Phone className="size-3.5 text-slate-400" />
                                        Telepon
                                    </span>
                                    <span className="font-semibold text-slate-900">
                                        {profileForm.data.phone || '-'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600 py-1">
                                    <span className="flex items-center gap-2 text-slate-500 font-medium">
                                        <ShieldCheck className="size-3.5 text-emerald-500" />
                                        Hak Akses
                                    </span>
                                    <span className="font-bold text-blue-600">
                                        Full Access (Superadmin)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="card p-5 bg-amber-50/50 border border-amber-200/60 text-amber-900">
                            <div className="flex items-start gap-3">
                                <Lock className="size-4 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs space-y-1">
                                    <p className="font-bold text-amber-900">Keamanan Akses Dashboard</p>
                                    <p className="text-amber-800/90 leading-relaxed">
                                        Pastikan menggunakan kombinasi kata sandi yang kuat (minimal 8 karakter dengan angka atau simbol). Jangan bagikan kredensial akses kantor kepada pihak luar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

function Panel({ title, icon, children }) {
    return (
        <section className="card p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name={icon} />
                </span>
                {title}
            </h2>
            <div className="mt-5 space-y-4">{children}</div>
        </section>
    );
}

function Field({ label, name, value, onChange, type = 'text', error }) {
    return (
        <div>
            <label className="label" htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value ?? ''}
                onChange={onChange}
                className="input"
            />
            {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
        </div>
    );
}

function TextArea({ label, name, value, onChange, rows = 3, error }) {
    return (
        <div>
            <label className="label" htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value ?? ''}
                onChange={onChange}
                className="input"
            />
            {error && <p className="mt-1.5 text-sm text-rose-600">{error}</p>}
        </div>
    );
}

function FileField({ label, name, current, onChange }) {
    return (
        <div>
            <label className="label" htmlFor={name}>{label}</label>
            {current && (
                <img
                    src={`/storage/${current}`}
                    alt=""
                    className="mb-2 h-32 w-full rounded-lg object-cover"
                />
            )}
            <input
                id={name}
                name={name}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onChange}
                className="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700"
            />
        </div>
    );
}

function Toggle({ label, name, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            />
        </label>
    );
}

const paths = {
    badge: 'M12 3l2.5 5.5L20 10l-4.5 3.5L16.5 19 12 16.5 7.5 19l1-5.5L4 10l5.5-1.5z',
    image: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
    link: 'M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1',
    info: 'M12 16v-5M12 8h.01M12 22a10 10 0 100-20 10 10 0 000 20z',
    phone: 'M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z',
    map: 'M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    share: 'M18 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 15a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18 22a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.2 11.3l7.6-4.6M8.2 13.7l7.6 4.6',
    steps: 'M4 6h6v6H4zM14 12h6v6h-6zM10 9h4v3',
    help: 'M12 22a10 10 0 100-20 10 10 0 000 20zM9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 4M12 17h.01',
    clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 7v5l3 2',
    office: 'M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 10h4a1 1 0 011 1v10M3 21h18M8 8h3M8 12h3M8 16h3',
    footer: 'M3 5h18v10H3zM3 19h18M7 22h10',
    file: 'M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V7zM14 3v4h4',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
};

function Icon({ name }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
            <path d={paths[name] ?? paths.info} />
        </svg>
    );
}
