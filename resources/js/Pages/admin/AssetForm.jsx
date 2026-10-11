import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function AssetForm({ activeMenu, title, stats, asset, categories, statuses, suggestedCode, locations }) {
    const isEdit = !!asset;

    const { data, setData, post, put, processing, errors } = useForm({
        asset_code: asset?.asset_code ?? '',
        asset_category_id: asset?.asset_category_id ?? '',
        name: asset?.name ?? '',
        brand_spec: asset?.brand_spec ?? '',
        location: asset?.location ?? '',
        acquisition_date: asset?.acquisition_date ?? '',
        acquisition_value: asset?.acquisition_value ?? '',
        condition_status: asset?.condition_status ?? 'baik',
        notes: asset?.notes ?? '',
        image: null,
    });

    const [locationMode, setLocationMode] = useState(
        asset?.location ? 'existing' : 'new',
    );

    useEffect(() => {
        if (!isEdit && categories.length > 0 && !data.asset_category_id) {
            setData('asset_category_id', categories[0].id);
        }
    }, [categories]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/inventaris/${asset.id}`);
        } else {
            post('/admin/inventaris');
        }
    };

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title={title} />

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Identitas Aset</h2>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="asset_code">Kode Aset</label>
                                <input
                                    id="asset_code"
                                    type="text"
                                    value={data.asset_code}
                                    onChange={(e) => setData('asset_code', e.target.value)}
                                    placeholder={suggestedCode}
                                    className="input font-mono"
                                />
                                <p className="mt-1.5 text-xs text-slate-500">
                                    Kosongkan untuk membuat kode otomatis ({suggestedCode}).
                                </p>
                                {errors.asset_code && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.asset_code}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="name">Nama Barang *</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="input"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="label" htmlFor="brand_spec">Merk / Spesifikasi</label>
                                <input
                                    id="brand_spec"
                                    type="text"
                                    value={data.brand_spec ?? ''}
                                    onChange={(e) => setData('brand_spec', e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Penempatan & Perolehan</h2>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="label" htmlFor="asset_category_id">Kategori Aset *</label>
                                <select
                                    id="asset_category_id"
                                    value={data.asset_category_id}
                                    onChange={(e) => setData('asset_category_id', e.target.value)}
                                    className="input"
                                    required
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.asset_category_id && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.asset_category_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="location">Lokasi Penempatan *</label>
                                {locationMode === 'existing' && locations.length > 0 ? (
                                    <>
                                        <select
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="input"
                                            required
                                        >
                                            <option value="">Pilih lokasi</option>
                                            {locations.map((loc) => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setLocationMode('new')}
                                            className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
                                        >
                                            + Tambah lokasi baru
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            id="location"
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Contoh: Ruang Pelayanan"
                                            className="input"
                                            required
                                        />
                                        {locationMode === 'existing' && (
                                            <button
                                                type="button"
                                                onClick={() => setLocationMode('existing')}
                                                className="mt-2 text-xs font-semibold text-slate-500 hover:underline"
                                            >
                                                Pilih dari daftar
                                            </button>
                                        )}
                                    </>
                                )}
                                {errors.location && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.location}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="acquisition_date">Tanggal Perolehan</label>
                                <input
                                    id="acquisition_date"
                                    type="date"
                                    value={data.acquisition_date ?? ''}
                                    onChange={(e) => setData('acquisition_date', e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="acquisition_value">Nilai Perolehan (Rp)</label>
                                <input
                                    id="acquisition_value"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={data.acquisition_value ?? ''}
                                    onChange={(e) => setData('acquisition_value', e.target.value)}
                                    className="input tabular-nums"
                                />
                                {errors.acquisition_value && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.acquisition_value}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Catatan</h2>
                        <textarea
                            rows={4}
                            value={data.notes ?? ''}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Keterangan tambahan kondisi atau riwayat perbaikan..."
                            className="input mt-4"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Kondisi Aset</h2>

                        <div className="mt-5 space-y-3">
                            {statuses.map((s) => (
                                <label
                                    key={s.value}
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                                        data.condition_status === s.value
                                            ? 'border-brand-400 bg-brand-50/60 ring-2 ring-brand-100'
                                            : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="condition_status"
                                        value={s.value}
                                        checked={data.condition_status === s.value}
                                        onChange={(e) => setData('condition_status', e.target.value)}
                                        className="mt-0.5 size-4 border-slate-300 text-brand-600 focus:ring-brand-400"
                                    />
                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">
                                            {s.label}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>

                        {errors.condition_status && (
                            <p className="mt-3 text-sm text-rose-600">{errors.condition_status}</p>
                        )}
                    </div>

                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Aksi</h2>
                        <div className="mt-5 space-y-2.5">
                            <button type="submit" disabled={processing} className="btn-primary w-full py-3">
                                {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Aset'}
                            </button>
                            <Link href="/admin/inventaris" className="btn-secondary w-full">
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
