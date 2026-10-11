import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function ArticleForm({ activeMenu, title, stats, article, categories }) {
    const isEdit = !!article;

    const { data, setData, post, put, processing, errors, clearErrors } = useForm({
        title: article?.title ?? '',
        slug: article?.slug ?? '',
        excerpt: article?.excerpt ?? '',
        content: article?.content ?? '',
        status: article?.status ?? 'published',
        is_featured: article?.is_featured ?? false,
        published_at: article?.published_at ?? new Date().toISOString().slice(0, 10),
        article_category_id: article?.article_category_id ?? categories[0]?.id ?? '',
        image: null,
    });

    const [preview, setPreview] = useState(article?.image ?? null);
    const fileRef = useRef(null);

    useEffect(() => {
        if (data.image) {
            setPreview(URL.createObjectURL(data.image));
        }
    }, [data.image]);

    const submit = (e) => {
        e.preventDefault();
        const payload = { ...data };
        if (isEdit) {
            put(`/admin/berita/${article.id}`, payload);
        } else {
            post('/admin/berita', payload);
        }
    };

    const autoSlug = (value) => {
        setData({
            title: value,
            slug: value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .slice(0, 120),
        });
    };

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title={title} />

            <form onSubmit={submit} encType="multipart/form-data" className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="card p-6">
                        <label className="label" htmlFor="title">Judul Berita *</label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => (isEdit ? setData('title', e.target.value) : autoSlug(e.target.value))}
                            className="input text-base"
                            maxLength={255}
                            placeholder="Judul berita yang ringkas dan jelas"
                            required
                            onFocus={() => clearErrors('title')}
                        />
                        <div className="mt-1.5 flex justify-between text-xs">
                            <p className={errors.title ? 'text-rose-600' : 'text-slate-500'}>
                                {errors.title}
                            </p>
                            <p className="text-slate-400">{data.title.length}/255</p>
                        </div>

                        <div className="mt-5">
                            <label className="label" htmlFor="slug">Slug URL</label>
                            <div className="flex items-center gap-2">
                                <span className="hidden shrink-0 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 sm:block">
                                    /berita/
                                </span>
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className="input font-mono"
                                    placeholder="otomatis-dari-judul"
                                />
                            </div>
                            {errors.slug && <p className="mt-1.5 text-sm text-rose-600">{errors.slug}</p>}
                        </div>

                        <div className="mt-5">
                            <label className="label" htmlFor="excerpt">Ringkasan Singkat</label>
                            <textarea
                                id="excerpt"
                                rows={2}
                                value={data.excerpt ?? ''}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                maxLength={500}
                                placeholder="Tampil di kartu berita dan meta deskripsi."
                                className="input"
                            />
                            <p className="mt-1.5 text-xs text-slate-400">{data.excerpt?.length ?? 0}/500</p>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center justify-between gap-4">
                            <label className="label mb-0" htmlFor="content">Isi Berita *</label>
                            <span className="text-xs text-slate-400">Mendukung HTML dasar</span>
                        </div>
                        <textarea
                            id="content"
                            rows={16}
                            value={data.content ?? ''}
                            onChange={(e) => setData('content', e.target.value)}
                            className="input mt-4 font-mono text-sm leading-relaxed"
                            placeholder="<p>Tulis isi berita di sini...</p>"
                            required
                        />
                        {errors.content && (
                            <p className="mt-1.5 text-sm text-rose-600">{errors.content}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Publikasi</h2>

                        <div className="mt-5 space-y-5">
                            <div>
                                <label className="label" htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="input"
                                >
                                    <option value="published">Tayang langsung</option>
                                    <option value="draft">Simpan sebagai draft</option>
                                </select>
                            </div>

                            <div>
                                <label className="label" htmlFor="published_at">Tanggal Rilis</label>
                                <input
                                    id="published_at"
                                    type="date"
                                    value={data.published_at ?? ''}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="label" htmlFor="article_category_id">Kategori</label>
                                <select
                                    id="article_category_id"
                                    value={data.article_category_id}
                                    onChange={(e) => setData('article_category_id', e.target.value)}
                                    className="input"
                                >
                                    <option value="">Tanpa kategori</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_featured)}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                                />
                                <span>
                                    <span className="block text-sm font-semibold text-slate-900">
                                        Jadikan sorotan utama
                                    </span>
                                    <span className="block text-xs text-slate-500">
                                        Tampil di panel besar landing page.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-base font-bold text-slate-900">Gambar Sampul</h2>

                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <div className="aspect-16/10">
                                {preview ? (
                                    <img src={preview} alt="" className="size-full object-cover" />
                                ) : (
                                    <div className="grid size-full place-items-center text-sm text-slate-400">
                                        Belum ada gambar
                                    </div>
                                )}
                            </div>
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                            className="input mt-4 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            JPG, PNG, atau WebP. Maksimal 4 MB. Otomatis dikompresi ke WebP.
                        </p>
                        {errors.image && <p className="mt-1.5 text-sm text-rose-600">{errors.image}</p>}

                        {preview && (
                            <button
                                type="button"
                                onClick={() => {
                                    setData('image', null);
                                    setPreview(null);
                                    if (fileRef.current) fileRef.current.value = '';
                                }}
                                className="mt-3 text-xs font-semibold text-rose-600 hover:underline"
                            >
                                Hapus pilihan gambar
                            </button>
                        )}

                        {isEdit && (
                            <label className="mt-4 flex items-start gap-2.5 border-t border-slate-100 pt-4">
                                <input
                                    type="checkbox"
                                    onChange={(e) => setData('hapus_gambar', e.target.checked)}
                                    className="mt-0.5 size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-300"
                                />
                                <span className="text-xs text-slate-600">
                                    Hapus gambar yang sedang dipakai
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="card p-6">
                        <div className="space-y-2.5">
                            <button type="submit" disabled={processing} className="btn-primary w-full py-3">
                                {processing
                                    ? 'Menyimpan...'
                                    : data.status === 'published'
                                      ? 'Simpan & Publikasikan'
                                      : 'Simpan Draft'}
                            </button>
                            <Link href="/admin/berita" className="btn-secondary w-full">
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
