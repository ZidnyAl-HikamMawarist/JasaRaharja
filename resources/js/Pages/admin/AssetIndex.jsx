import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Package,
    CheckCircle2,
    Wrench,
    AlertTriangle,
    Gavel,
    Coins,
    Clock,
    MoreVertical,
    Pencil,
    Trash2,
    Filter,
    X,
    Plus,
    RotateCcw,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import StatusBadge, { assetTone } from '../../Components/StatusBadge';
import ConfirmDialog from '../../Components/ConfirmDialog';

export default function AssetIndex({
    activeMenu,
    title,
    stats,
    assets,
    filters,
    categories,
    summary,
    locations,
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
            '/admin/inventaris',
            {
                q: filters.q || undefined,
                kategori: filters.kategori || undefined,
                status: filters.status || undefined,
                lelang: filters.lelang || undefined,
                lokasi: filters.lokasi || undefined,
                sort: filters.sort || undefined,
                ...patch,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setTerm('');
        router.get('/admin/inventaris', {}, { preserveState: true, replace: true });
    };

    const hasActiveFilters = Boolean(
        filters.q || filters.kategori || filters.status || filters.lelang || filters.lokasi,
    );

    const exportUrl = (ext) => {
        const params = new URLSearchParams();
        if (filters.q) params.set('q', filters.q);
        if (filters.kategori) params.set('kategori', filters.kategori);
        if (filters.status) params.set('status', filters.status);
        if (filters.lelang) params.set('lelang', filters.lelang);
        if (filters.lokasi) params.set('lokasi', filters.lokasi);
        const qs = params.toString();
        return `/admin/inventaris/ekspor/${ext}${qs ? `?${qs}` : ''}`;
    };

    const statCards = [
        {
            label: 'Total Aset',
            value: summary.total ?? 0,
            accentBar: 'bg-blue-600',
            iconClass: 'bg-blue-50 text-blue-600 border-blue-200/60',
            icon: Package,
            subtext: 'Seluruh aset terdata',
            onClick: () => apply({ lelang: undefined, status: undefined }),
            active: !filters.lelang && !filters.status,
        },
        {
            label: 'Kondisi Baik',
            value: summary.baik ?? 0,
            accentBar: 'bg-emerald-500',
            iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
            icon: CheckCircle2,
            subtext: `${Math.round(((summary.baik || 0) / (summary.total || 1)) * 100)}% siap operasional`,
            onClick: () => apply({ status: filters.status === 'baik' ? undefined : 'baik' }),
            active: filters.status === 'baik',
        },
        {
            label: 'Perlu Servis',
            value: summary.servis ?? 0,
            accentBar: 'bg-amber-500',
            iconClass: 'bg-amber-50 text-amber-600 border-amber-200/60',
            icon: Wrench,
            subtext: 'Perlu perawatan rutin',
            onClick: () => apply({ status: filters.status === 'servis' ? undefined : 'servis' }),
            active: filters.status === 'servis',
        },
        {
            label: 'Rusak Berat',
            value: summary.rusak ?? 0,
            accentBar: 'bg-rose-500',
            iconClass: 'bg-rose-50 text-rose-600 border-rose-200/60',
            icon: AlertTriangle,
            subtext: 'Perlu perbaikan/ganti',
            onClick: () => apply({ status: filters.status === 'rusak' ? undefined : 'rusak' }),
            active: filters.status === 'rusak',
        },
        {
            label: 'Siap Lelang (≥ 5 Th)',
            value: summary.siap_lelang ?? 0,
            accentBar: 'bg-violet-600',
            iconClass: 'bg-violet-50 text-violet-700 border-violet-200/70',
            icon: Gavel,
            subtext: 'Usia ≥ 5 thn (siap lelang/jual)',
            onClick: () => apply({ lelang: filters.lelang === 'siap' ? undefined : 'siap' }),
            active: filters.lelang === 'siap',
        },
        {
            label: 'Nilai Perolehan',
            value: `Rp ${Number(summary.nilai ?? 0).toLocaleString('id-ID')}`,
            accentBar: 'bg-indigo-600',
            iconClass: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
            icon: Coins,
            subtext: 'Total kapitalisasi nilai',
            onClick: null,
            active: false,
        },
    ];

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title="Inventaris Aset Tetap" />

            {/* Top Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                        {/* Top colored accent bar */}
                        <div className={`absolute inset-x-0 top-0 h-1.5 ${card.accentBar}`} />

                        <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
                                {card.label}
                            </span>
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition group-hover:scale-105 ${card.iconClass}`}
                            >
                                <card.icon className="h-4.5 w-4.5" />
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
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
                    <div>
                        <label className="label" htmlFor="q">
                            Pencarian
                        </label>
                        <input
                            id="q"
                            type="search"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && apply({ q: term || undefined })}
                            placeholder="Kode aset, nama, merk, lokasi..."
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="label" htmlFor="kategori">
                            Kategori
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

                    <div>
                        <label className="label" htmlFor="status">
                            Kondisi
                        </label>
                        <select
                            id="status"
                            value={filters.status ?? ''}
                            onChange={(e) => apply({ status: e.target.value || undefined })}
                            className="input"
                        >
                            <option value="">Semua kondisi</option>
                            <option value="baik">Baik</option>
                            <option value="servis">Perlu Servis</option>
                            <option value="rusak">Rusak Berat</option>
                        </select>
                    </div>

                    <div>
                        <label className="label" htmlFor="lelang">
                            Status Umur / Lelang
                        </label>
                        <select
                            id="lelang"
                            value={filters.lelang ?? ''}
                            onChange={(e) => apply({ lelang: e.target.value || undefined })}
                            className="input"
                        >
                            <option value="">Semua umur</option>
                            <option value="siap">≥ 5 Tahun (Siap Lelang / Jual)</option>
                            <option value="aktif">&lt; 5 Tahun (Masa Pakai Aktif)</option>
                        </select>
                    </div>

                    <div>
                        <label className="label" htmlFor="lokasi">
                            Lokasi
                        </label>
                        <select
                            id="lokasi"
                            value={filters.lokasi ?? ''}
                            onChange={(e) => apply({ lokasi: e.target.value || undefined })}
                            className="input"
                        >
                            <option value="">Semua lokasi</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={() => apply({ q: term || undefined })}
                            className="btn-primary w-full h-[42px] flex items-center justify-center gap-1.5 font-semibold"
                        >
                            <Filter className="w-4 h-4" />
                            Terapkan
                        </button>
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
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.kategori && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Kategori: {categories.find((c) => c.id == filters.kategori)?.name}
                                <button type="button" onClick={() => apply({ kategori: undefined })} className="hover:text-blue-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.status && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Kondisi: {filters.status === 'baik' ? 'Baik' : filters.status === 'servis' ? 'Perlu Servis' : 'Rusak Berat'}
                                <button type="button" onClick={() => apply({ status: undefined })} className="hover:text-blue-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.lelang && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 font-bold">
                                {filters.lelang === 'siap' ? '≥ 5 Thn (Siap Lelang)' : '< 5 Thn (Masa Aktif)'}
                                <button type="button" onClick={() => apply({ lelang: undefined })} className="hover:text-violet-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.lokasi && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                Lokasi: {filters.lokasi}
                                <button type="button" onClick={() => apply({ lokasi: undefined })} className="hover:text-blue-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline flex items-center gap-1 ml-auto"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset Semua
                        </button>
                    </div>
                )}

                {/* Sub-actions: Export and Sort */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ekspor
                    </span>
                    <a href={exportUrl('excel')} className="btn-secondary py-2 text-xs">
                        Excel (.xlsx)
                    </a>
                    <a href={exportUrl('pdf')} className="btn-secondary py-2 text-xs">
                        PDF (kop surat)
                    </a>
                    <a href={exportUrl('csv')} className="btn-secondary py-2 text-xs">
                        CSV
                    </a>

                    <div className="ml-auto flex items-center gap-2">
                        <select
                            value={filters.sort ?? 'terlama'}
                            onChange={(e) => apply({ sort: e.target.value })}
                            className="input w-auto py-2 text-xs font-medium"
                        >
                            <option value="terlama">Urut: Kode</option>
                            <option value="terbaru">Urut: Terbaru</option>
                            <option value="umur">Urut: Umur Tertua</option>
                            <option value="nama">Urut: Nama</option>
                        </select>
                        <Link href="/admin/inventaris/create" className="btn-primary py-2 text-xs flex items-center gap-1.5 font-semibold">
                            <Plus className="w-4 h-4" />
                            Tambah Aset
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="card mt-6">
                <div className="overflow-x-auto min-h-[340px] pb-10">
                    <table className="w-full min-w-[70rem] text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50/90 text-left">
                            <tr className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="px-4 py-3.5">Kode Aset</th>
                                <th className="px-4 py-3.5">Nama Barang</th>
                                <th className="px-4 py-3.5">Kategori</th>
                                <th className="px-4 py-3.5">Lokasi</th>
                                <th className="px-4 py-3.5">Kondisi</th>
                                <th className="px-4 py-3.5">Umur Aset & Status Usulan</th>
                                <th className="px-4 py-3.5 text-right">Nilai Perolehan</th>
                                <th className="px-4 py-3.5 text-center w-16">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assets.data.map((asset) => (
                                <tr key={asset.id} className="transition hover:bg-slate-50/80">
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100/90 px-2 py-1 rounded-md border border-slate-200">
                                            {asset.asset_code}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-slate-900">{asset.name}</p>
                                        {asset.brand_spec && (
                                            <p className="text-xs text-slate-500 mt-0.5">{asset.brand_spec}</p>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 font-medium text-xs">
                                        {asset.category}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 font-medium text-xs">
                                        {asset.location}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        <StatusBadge tone={assetTone(asset.condition_status)}>
                                            {asset.condition_label}
                                        </StatusBadge>
                                    </td>
                                    {/* Umur Aset Column */}
                                    <td className="whitespace-nowrap px-4 py-3.5">
                                        {asset.is_auction_eligible ? (
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                                                    <Gavel className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                    <span>{asset.age_formatted}</span>
                                                    <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        Siap Lelang
                                                    </span>
                                                </span>
                                                <span className="text-[11px] text-slate-400 pl-1 font-medium">
                                                    Perolehan: {asset.acquisition_date ?? '-'}
                                                </span>
                                            </div>
                                        ) : asset.age_formatted && asset.age_formatted !== '-' ? (
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span>{asset.age_formatted}</span>
                                                </span>
                                                <span className="text-[11px] text-slate-400 pl-0.5 font-medium">
                                                    Perolehan: {asset.acquisition_date ?? '-'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Belum tercatat</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums text-slate-800 font-semibold">
                                        {asset.acquisition_value !== null
                                            ? 'Rp ' + Number(asset.acquisition_value).toLocaleString('id-ID')
                                            : '-'}
                                    </td>
                                    {/* 3-dots Action Menu */}
                                    <td className="whitespace-nowrap px-4 py-3.5 text-center">
                                        <div className="relative inline-block text-left">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionId(activeActionId === asset.id ? null : asset.id);
                                                }}
                                                className={`h-8 w-8 rounded-lg flex items-center justify-center transition ${
                                                    activeActionId === asset.id
                                                        ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-500/30'
                                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                                }`}
                                                title="Pilihan Aksi"
                                                aria-label="Pilihan Aksi"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeActionId === asset.id && (
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white shadow-xl border border-slate-200 z-50 py-1.5 text-left animate-in fade-in zoom-in-95 duration-100"
                                                >
                                                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kode Aset</p>
                                                        <p className="font-mono text-xs font-bold text-slate-800 truncate">{asset.asset_code}</p>
                                                    </div>

                                                    <Link
                                                        href={`/admin/inventaris/${asset.id}/edit`}
                                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition"
                                                        onClick={() => setActiveActionId(null)}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Ubah Data</span>
                                                    </Link>

                                                    {asset.is_auction_eligible && (
                                                        <div className="px-3 py-1.5 my-1 bg-amber-50 border-y border-amber-100 text-[11px] text-amber-800 flex items-center gap-1.5">
                                                            <Gavel className="w-3 h-3 text-amber-600 shrink-0" />
                                                            <span className="font-bold">Usulan Lelang / Jual</span>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveActionId(null);
                                                            setDeleteTarget(asset);
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Hapus Aset</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {assets.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                                        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                                        <p className="font-semibold text-slate-700">Tidak ada aset yang sesuai kriteria.</p>
                                        <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                meta={assets.meta}
                params={{
                    q: filters.q || undefined,
                    kategori: filters.kategori || undefined,
                    status: filters.status || undefined,
                    lelang: filters.lelang || undefined,
                    lokasi: filters.lokasi || undefined,
                    sort: filters.sort || undefined,
                }}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Hapus aset?"
                message={`Aset ${deleteTarget?.asset_code ?? ''} (${deleteTarget?.name ?? ''}) beserta seluruh riwayat datanya akan dihapus permanen.`}
                confirmLabel="Hapus Aset"
                danger
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    router.delete(`/admin/inventaris/${deleteTarget.id}`, { preserveScroll: true });
                    setDeleteTarget(null);
                }}
            />
        </AdminLayout>
    );
}
