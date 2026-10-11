import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function GalleryForm({ activeMenu, title, stats, photo, categories }) {
    const isEdit = !!photo;

    const { data, setData, post, put, processing, errors } = useForm({
        title: photo?.title ?? '',
        caption: photo?.caption ?? '',
        taken_at: photo?.taken_at ?? '',
        gallery_category_id: photo?.gallery_category_id ?? categories[0]?.id ?? '',
        is_published: photo?.is_published ?? true,
        image: null,
    });

    const [preview, setPreview] = useState(photo?.image ?? null);

    useEffect(() => {
        if (data.image) {
            setPreview(URL.createObjectURL(data.image));
        }
    }, [data.image]);

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/galeri/${photo.id}`);
        } else {
            post('/admin/galeri');
        }
    };

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title={title} />

            <form onSubmit={submit} encType="multipart/form-data" className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <div className="aspect-16/10">
                                {preview ? (
                                    <img src={preview} alt="" className="size-full object-contain" />
                                ) : (
                                    <div className="grid size-full place-items-center text-sm text-slate-400">
                                        Belum ada foto dipilih
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="label" htmlFor="image">
                                Foto {isEdit ? '(opsional, biarkan kosong bila tidak diubah)' : '*'}
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                className="input file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700"
                                required={!isEdit}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                JPG, PNG, atau WebP. Maksimal 4 MB. Otomatis dikompresi ke WebP.
                            </p>
                            {errors.image && <p className="mt-1.5 text-sm text-rose-600">{errors.image}</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Informasi Foto</h2>

                        <div className="mt-5 space-y-5">
                            <div>
                                <label className="label" htmlFor="title">Judul</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title ?? ''}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="input"
                                    placeholder="Contoh: Sosialisasi Keselamatan Jalan"
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="caption">Keterangan</label>
                                <textarea
                                    id="caption"
                                    rows={3}
                                    value={data.caption ?? ''}
                                    onChange={(e) => setData('caption', e.target.value)}
                                    className="input"
                                    placeholder="Deskripsi singkat kegiatan"
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="gallery_category_id">Kategori</label>
                                <select
                                    id="gallery_category_id"
                                    value={data.gallery_category_id}
                                    onChange={(e) => setData('gallery_category_id', e.target.value)}
                                    className="input"
                                >
                                    <option value="">Tanpa kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label" htmlFor="taken_at">Tanggal Dokumentasi</label>
                                <input
                                    id="taken_at"
                                    type="date"
                                    value={data.taken_at ?? ''}
                                    onChange={(e) => setData('taken_at', e.target.value)}
                                    className="input"
                                />
                            </div>

                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_published)}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-slate-900">
                                        Tampilkan di galeri publik
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="space-y-2.5">
                            <button type="submit" disabled={processing} className="btn-primary w-full py-3">
                                {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Upload Foto'}
                            </button>
                            <Link href="/admin/galeri" className="btn-secondary w-full">
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
