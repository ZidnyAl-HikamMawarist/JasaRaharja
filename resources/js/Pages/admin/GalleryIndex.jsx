import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    FolderArchive,
    Search,
    Plus,
    X,
    MoreVertical,
    Pencil,
    Trash2,
    ExternalLink,
    RotateCcw,
    Eye,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import StatusBadge from '../../Components/StatusBadge';
import ConfirmDialog from '../../Components/ConfirmDialog';

export default function GalleryIndex({
    activeMenu,
    title,
    stats,
    photos,
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
            '/admin/galeri',
            {
                q: filters.q || undefined,
                kategori: filters.kategori || undefined,
                ...patch,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setTerm('');
        router.get('/admin/galeri', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = Boolean(filters.q || filters.kategori);

    const statCards = [
        {
            label: 'Total Dokumentasi',
            value: summary.total ?? photos.total ?? 0,
            accentBar: 'bg-blue-600',
            iconClass: 'bg-blue-50 text-blue-600 border-blue-200/60',
            icon: ImageIcon,
            subtext: 'Seluruh foto tersimpan',
            onClick: () => apply({ kategori: undefined }),
            active: !filters.kategori,
        },
        {
            label: 'Foto Publik',
            value: summary.published ?? 0,
            accentBar: 'bg-emerald-500',
            iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
            icon: CheckCircle2,
            subtext: 'Tampil di galeri portal',
            onClick: null,
            active: false,
        },
        {
            label: 'Draft / Internal',
            value: summary.draft ?? 0,
            accentBar: 'bg-amber-500',
            iconClass: 'bg-amber-50 text-amber-600 border-amber-200/60',
            icon: Clock,
            subtext: 'Hanya akses internal',
            onClick: null,
            active: false,
        },
        {
            label: 'Kategori Album',
            value: summary.categories ?? categories.length,
            accentBar: 'bg-indigo-600',
            iconClass: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
            icon: FolderArchive,
            subtext: 'Kelompok dokumentasi',
            onClick: null,
            active: false,
        },
    ];

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title="Kelola Galeri Dokumentasi" />

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
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_auto]">
                    <div>
                        <label className="label" htmlFor="q">
                            Pencarian Foto
                        </label>
                        <input
                            id="q"
                            type="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && apply({ q: term || undefined })}
                            placeholder="Cari berdasarkan judul atau keterangan foto..."
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="kategori">
                            Kategori Galeri
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
                            href="/admin/galeri/create"
                            className="btn-primary w-full h-[42px] flex items-center justify-center gap-1.5 font-semibold"
                        >
                            <Plus className="size-4" />
                            Upload Foto
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
                    <span>Menampilkan total {photos.total ?? photos.data.length} foto</span>
                    <Link
                        href="/admin/kategori-galeri"
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                    >
                        <FolderArchive className="size-3.5" />
                        Kelola Kategori Galeri
                    </Link>
                </div>
            </div>

            {/* Modern Media Grid */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {photos.data.map((photo) => (
                    <div
                        key={photo.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:shadow-lg transition-all duration-200"
                    >
                        {/* Image Preview with Hover Zoom */}
                        <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                            {photo.thumb || photo.image ? (
                                <img
                                    src={photo.thumb ?? photo.image}
                                    alt={photo.title}
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-slate-300">
                                    <ImageIcon className="size-10" />
                                </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs border border-white/60">
                                    {photo.category ?? 'Umum'}
                                </span>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                                        photo.is_published
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-700 text-white'
                                    }`}
                                >
                                    {photo.is_published ? 'Publik' : 'Draft'}
                                </span>
                            </div>
                        </div>

                        {/* Card Info & Actions */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                                    {photo.title}
                                </h3>
                                <p className="mt-1 text-xs text-slate-400">
                                    Tanggal: {photo.taken_at ?? '-'}
                                </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={`/admin/galeri/${photo.id}/edit`}
                                    className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 font-semibold"
                                >
                                    <Pencil className="size-3 text-slate-400" />
                                    Ubah
                                </Link>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveActionId(
                                                activeActionId === photo.id ? null : photo.id,
                                            );
                                        }}
                                        className={`size-8 rounded-lg flex items-center justify-center transition ${
                                            activeActionId === photo.id
                                                ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/30'
                                                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                        title="Pilihan Aksi"
                                    >
                                        <MoreVertical className="size-4" />
                                    </button>

                                    {activeActionId === photo.id && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute right-0 bottom-full mb-1.5 w-44 rounded-xl bg-white shadow-xl border border-slate-200 z-50 py-1.5 text-left animate-in fade-in zoom-in-95 duration-100"
                                        >
                                            {photo.image && (
                                                <a
                                                    href={photo.image}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                    onClick={() => setActiveActionId(null)}
                                                >
                                                    <ExternalLink className="size-3.5 text-slate-400" />
                                                    <span>Buka Gambar Asli</span>
                                                </a>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setActiveActionId(null);
                                                    setDeleteTarget(photo);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                                            >
                                                <Trash2 className="size-3.5 text-rose-500" />
                                                <span>Hapus Foto</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {photos.data.length === 0 && (
                <div className="card mt-6 px-4 py-16 text-center text-slate-500">
                    <ImageIcon className="size-12 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">Belum ada foto yang sesuai kriteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Silakan sesuaikan kata kunci pencarian atau unggah foto dokumentasi baru.</p>
                    <Link href="/admin/galeri/create" className="btn-primary mt-4 inline-flex items-center gap-1.5">
                        <Plus className="size-4" />
                        Upload Foto Pertama
                    </Link>
                </div>
            )}

            <Pagination
                meta={photos.meta}
                params={{
                    q: filters.q || undefined,
                    kategori: filters.kategori || undefined,
                }}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Hapus foto dokumentasi?"
                message={`Foto "${deleteTarget?.title ?? ''}" akan dihapus permanen dari galeri dan server.`}
                confirmLabel="Hapus Foto"
                danger
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    router.delete(`/admin/galeri/${deleteTarget.id}`, { preserveScroll: true });
                    setDeleteTarget(null);
                }}
            />
        </AdminLayout>
    );
}
