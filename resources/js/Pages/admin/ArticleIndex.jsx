import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Newspaper,
    CheckCircle2,
    Clock,
    TrendingUp,
    Search,
    Filter,
    X,
    Plus,
    MoreVertical,
    Pencil,
    Trash2,
    Eye,
    ExternalLink,
    Star,
    Sparkles,
    RotateCcw,
    FolderArchive,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import StatusBadge, { statusTone } from '../../Components/StatusBadge';
import ConfirmDialog from '../../Components/ConfirmDialog';

export default function ArticleIndex({
    activeMenu,
    title,
    stats,
    articles,
    filters,
    categories,
    summary = {},
}) {
    const [term, setTerm] = useState(filters.q ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [activeActionId, setActiveActionId] = useState(null);

    useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setActiveActionId(null);
        };
        window.addEventListener('click', handleClickOutside);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const apply = (patch = {}) => {
        router.get(
            '/admin/berita',
            {
                q: filters.q || undefined,
                status: filters.status || undefined,
                kategori: filters.kategori || undefined,
                ...patch,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setTerm('');
        router.get('/admin/berita', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = Boolean(filters.q || filters.status || filters.kategori);

    const statCards = [
        {
            label: 'Total Berita',
            value: summary.total ?? 0,
            accentBar: 'bg-blue-600',
            iconClass: 'bg-blue-50 text-blue-600 border-blue-200/60',
            icon: Newspaper,
            subtext: 'Seluruh arsip artikel',
            onClick: () => apply({ status: undefined, kategori: undefined }),
            active: !filters.status && !filters.kategori,
        },
        {
            label: 'Berita Tayang',
            value: summary.published ?? 0,
            accentBar: 'bg-emerald-500',
            iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
            icon: CheckCircle2,
            subtext: 'Dapat diakses publik',
            onClick: () => apply({ status: filters.status === 'published' ? undefined : 'published' }),
            active: filters.status === 'published',
        },
        {
            label: 'Draft / Tertunda',
            value: summary.draft ?? 0,
            accentBar: 'bg-amber-500',
            iconClass: 'bg-amber-50 text-amber-600 border-amber-200/60',
            icon: Clock,
            subtext: 'Belum dipublikasikan',
            onClick: () => apply({ status: filters.status === 'draft' ? undefined : 'draft' }),
            active: filters.status === 'draft',
        },
        {
            label: 'Total Pembaca',
            value: Number(summary.views ?? 0).toLocaleString('id-ID'),
            accentBar: 'bg-indigo-600',
            iconClass: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
            icon: TrendingUp,
            subtext: 'Akumulasi views portal',
            onClick: null,
            active: false,
        },
    ];

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title="Kelola Berita & Publikasi" />

            {/* Top Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        onClick={card.onClick ?? undefined}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-4.5 shadow-xs transition-all duration-200 ${
                            card.onClick
                                ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
                                : ''
                        } ${
                            card.active
                                ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                                : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                        title={card.onClick ? `Klik untuk filter ${card.label}` : undefined}
                    >
                        <div className={`absolute inset-x-0 top-0 h-1.5 ${card.accentBar}`} />

                        <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
                                {card.label}
                            </span>
                            <div
                                className={`flex size-9 shrink-0 items-center justify-center rounded-xl border transition group-hover:scale-105 ${card.iconClass}`}
                            >
                                <card.icon className="size-4.5" />
                            </div>
                        </div>

                        <div className="mt-3">
                            <p className="text-xl font-black tracking-tight text-slate-900 xl:text-2xl">
                                {card.value}
                            </p>
                            <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-1">
                                {card.subtext}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Action Card */}
            <div className="card mt-6 p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_auto]">
                    <div>
                        <label className="label" htmlFor="q">
                            Pencarian Berita
                        </label>
                        <input
                            id="q"
                            type="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && apply({ q: term || undefined })}
                            placeholder="Ketik judul artikel, topik, atau kata kunci..."
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="status">
                            Status Publikasi
                        </label>
                        <select
                            id="status"
                            value={filters.status ?? ''}
                            onChange={(e) => apply({ status: e.target.value || undefined })}
                            className="input"
                        >
                            <option value="">Semua status</option>
                            <option value="published">Tayang (Publik)</option>
                            <option value="draft">Draft (Arsip Internal)</option>
                        </select>
                    </div>

                    <div>
                        <label className="label" htmlFor="kategori">
                            Kategori Berita
                        </label>
                        <select
                            id="kategori"
                            value={filters.kategori ?? ''}
                            onChange={(e) => apply({ kategori: e.target.value || undefined })}
                            className="input"
                        >
                            <option value="">Semua kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Link
                            href="/admin/berita/create"
                            className="btn-primary w-full h-[42px] flex items-center justify-center gap-1.5 font-semibold"
                        >
                            <Plus className="size-4" />
                            Tulis Berita
                        </Link>
                    </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-400">Filter Aktif:</span>
                        {filters.q && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Cari: "{filters.q}"
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTerm('');
                                        apply({ q: undefined });
                                    }}
                                    className="hover:text-blue-900"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {filters.status && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Status: {filters.status === 'published' ? 'Tayang' : 'Draft'}
                                <button
                                    type="button"
                                    onClick={() => apply({ status: undefined })}
                                    className="hover:text-blue-900"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {filters.kategori && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Kategori: {categories.find((c) => c.id == filters.kategori)?.name}
                                <button
                                    type="button"
                                    onClick={() => apply({ kategori: undefined })}
                                    className="hover:text-blue-900"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline flex items-center gap-1 ml-auto"
                        >
                            <RotateCcw className="size-3" />
                            Reset Semua Filter
                        </button>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>Menampilkan total {articles.total ?? articles.data.length} artikel</span>
                    <Link
                        href="/admin/kategori-berita"
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                    >
                        <FolderArchive className="size-3.5" />
                        Kelola Kategori Berita
                    </Link>
                </div>
            </div>

            {/* Table Container */}
            <div className="card mt-6">
                <div className="overflow-x-auto min-h-[340px] pb-10">
                    <table className="w-full min-w-[58rem] text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50/90 text-left">
                            <tr className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-4 py-3.5">Artikel & Sampul</th>
                                <th className="px-4 py-3.5">Kategori</th>
                                <th className="px-4 py-3.5">Tanggal Rilis</th>
                                <th className="px-4 py-3.5">Status</th>
                                <th className="px-4 py-3.5 text-right">Views</th>
                                <th className="px-4 py-3.5 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles.data.map((article) => (
                                <tr key={article.id} className="transition hover:bg-slate-50/80">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center">
                                                {article.image ? (
                                                    <img
                                                        src={article.image}
                                                        alt=""
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Newspaper className="size-5 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-md">
                                                <p className="truncate font-bold text-slate-900 text-sm">
                                                    {article.title}
                                                </p>
                                                <p className="truncate text-xs font-mono text-slate-400 mt-0.5">
                                                    /{article.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                            {article.category ?? 'Umum'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-600 font-medium">
                                        {article.published_at ?? '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <StatusBadge tone={statusTone(article.status)}>
                                                {article.status === 'published' ? 'Tayang' : 'Draft'}
                                            </StatusBadge>
                                            {article.is_featured && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                                    <Star className="size-2.5 fill-amber-500 text-amber-500" />
                                                    Sorotan
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-slate-700 font-semibold">
                                        <span className="inline-flex items-center gap-1">
                                            <Eye className="size-3.5 text-slate-400" />
                                            {article.views}
                                        </span>
                                    </td>
                                    {/* 3-dots Action Menu */}
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <div className="relative inline-block text-left">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionId(
                                                        activeActionId === article.id ? null : article.id,
                                                    );
                                                }}
                                                className={`size-8 rounded-lg flex items-center justify-center transition ${
                                                    activeActionId === article.id
                                                        ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/30'
                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                                }`}
                                                title="Menu Aksi"
                                                aria-label="Menu Aksi"
                                            >
                                                <MoreVertical className="size-4" />
                                            </button>

                                            {activeActionId === article.id && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-slate-200 z-50 py-1.5 text-left animate-in fade-in zoom-in-95 duration-100"
                                                >
                                                    <a
                                                        href={`/berita/${article.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                        onClick={() => setActiveActionId(null)}
                                                    >
                                                        <ExternalLink className="size-3.5 text-slate-400" />
                                                        <span>Lihat di Publik</span>
                                                    </a>

                                                    <Link
                                                        href={`/admin/berita/${article.id}/edit`}
                                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                        onClick={() => setActiveActionId(null)}
                                                    >
                                                        <Pencil className="size-3.5 text-slate-400" />
                                                        <span>Ubah Konten</span>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveActionId(null);
                                                            router.patch(
                                                                `/admin/berita/${article.id}/toggle`,
                                                                {},
                                                                { preserveScroll: true },
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                    >
                                                        <Clock className="size-3.5 text-slate-400" />
                                                        <span>
                                                            {article.status === 'published'
                                                                ? 'Jadikan Draft'
                                                                : 'Terbitkan Sekarang'}
                                                        </span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveActionId(null);
                                                            router.patch(
                                                                `/admin/berita/${article.id}/feature`,
                                                                {},
                                                                { preserveScroll: true },
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                    >
                                                        <Star className="size-3.5 text-slate-400" />
                                                        <span>
                                                            {article.is_featured
                                                                ? 'Lepas Sorotan'
                                                                : 'Jadikan Sorotan'}
                                                        </span>
                                                    </button>

                                                    <div className="border-t border-slate-100 my-1" />

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveActionId(null);
                                                            setDeleteTarget(article);
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                                                    >
                                                        <Trash2 className="size-3.5 text-rose-500" />
                                                        <span>Hapus Berita</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {articles.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center text-slate-500">
                                        <Newspaper className="size-10 mx-auto text-slate-300 mb-2" />
                                        <p className="font-semibold text-slate-700">Belum ada berita yang sesuai.</p>
                                        <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau status artikel.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                meta={articles.meta}
                params={{
                    q: filters.q || undefined,
                    status: filters.status || undefined,
                    kategori: filters.kategori || undefined,
                }}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Hapus berita?"
                message={`Artikel "${deleteTarget?.title ?? ''}" akan dihapus permanen beserta seluruh aset gambarnya.`}
                confirmLabel="Hapus Artikel"
                danger
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    router.delete(`/admin/berita/${deleteTarget.id}`, { preserveScroll: true });
                    setDeleteTarget(null);
                }}
            />
        </AdminLayout>
    );
}
