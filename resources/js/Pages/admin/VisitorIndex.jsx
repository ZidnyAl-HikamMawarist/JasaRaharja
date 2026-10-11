import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users,
    Eye,
    TrendingUp,
    Smartphone,
    Laptop,
    Tablet,
    Bot,
    Search,
    RotateCcw,
    Trash2,
    Globe,
    ExternalLink,
    Clock,
    Activity,
    ShieldCheck,
    Radio,
    Filter,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';
import Pagination from '../../Components/Pagination';
import ConfirmDialog from '../../Components/ConfirmDialog';

export default function VisitorIndex({
    activeMenu,
    pageTitle,
    stats,
    visitors,
    filters = {},
    metrics = {},
    topPages = [],
}) {
    const [searchTerm, setSearchTerm] = useState(filters.q ?? '');
    const [deviceFilter, setDeviceFilter] = useState(filters.device ?? 'all');
    const [dateFilter, setDateFilter] = useState(filters.date ?? 'all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const applyFilters = (patch = {}) => {
        router.get(
            '/admin/pengunjung',
            {
                q: searchTerm || undefined,
                device: deviceFilter !== 'all' ? deviceFilter : undefined,
                date: dateFilter !== 'all' ? dateFilter : undefined,
                ...patch,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ q: searchTerm || undefined });
    };

    const handleReset = () => {
        setSearchTerm('');
        setDeviceFilter('all');
        setDateFilter('all');
        router.get('/admin/pengunjung', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        router.delete(`/admin/pengunjung/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handleClearAll = () => {
        router.post(
            '/admin/pengunjung/clear',
            {},
            {
                preserveScroll: true,
                onSuccess: () => setShowClearConfirm(false),
            }
        );
    };

    const totalDev =
        (metrics.device_stats?.mobile || 0) +
        (metrics.device_stats?.desktop || 0) +
        (metrics.device_stats?.tablet || 0);

    const mobilePct = totalDev > 0 ? Math.round(((metrics.device_stats?.mobile || 0) / totalDev) * 100) : 0;
    const desktopPct = totalDev > 0 ? Math.round(((metrics.device_stats?.desktop || 0) / totalDev) * 100) : 0;

    return (
        <AdminLayout activeMenu={activeMenu} title={pageTitle} stats={stats}>
            <Head title="Pengunjung Web & Log IP" />

            {/* Header Banner & Live Status */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
                <div className="flex items-center gap-3.5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
                        <Activity className="size-5.5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                Pelacakan Pengunjung Cloudflare
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Real-Time Aktif
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600">
                            Mencatat IP publik asli, perangkat HP/desktop, dan halaman yang dikunjungi dari seluruh dunia.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => router.reload()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        title="Perbarui Data Kunjungan"
                    >
                        <RotateCcw className="size-3.5" />
                        <span>Segarkan</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                    >
                        <Trash2 className="size-3.5" />
                        <span>Bersihkan Log</span>
                    </button>
                </div>
            </div>

            {/* 4 Metric KPI Cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {/* Total All-Time Visits */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                            Total Kunjungan
                        </span>
                        <div className="grid size-8 sm:size-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                            <Eye className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {Number(metrics.total_visits || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        {Number(metrics.unique_ips || 0).toLocaleString('id-ID')} IP unik terdata
                    </p>
                </div>

                {/* Unique IPs Today */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                            Pengunjung Unik Hari Ini
                        </span>
                        <div className="grid size-8 sm:size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Users className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                        {Number(metrics.today_unique || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        Perangkat berbeda hari ini
                    </p>
                </div>

                {/* Today Hits */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                            Kunjungan Hari Ini
                        </span>
                        <div className="grid size-8 sm:size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                            <TrendingUp className="size-4.5" />
                        </div>
                    </div>
                    <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                        {Number(metrics.today_visits || 0).toLocaleString('id-ID')}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">
                        Total halaman dibuka hari ini
                    </p>
                </div>

                {/* Device Breakdown */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                            Perangkat Pengakses
                        </span>
                        <div className="grid size-8 sm:size-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                            <Smartphone className="size-4.5" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between text-xs font-bold text-slate-700">
                        <span>HP: {mobilePct}%</span>
                        <span>PC: {desktopPct}%</span>
                    </div>
                    <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="bg-blue-600 transition-all" style={{ width: `${mobilePct}%` }} />
                        <div className="bg-slate-400 transition-all" style={{ width: `${desktopPct}%` }} />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">
                        {metrics.device_stats?.mobile || 0} Mobile · {metrics.device_stats?.desktop || 0} Desktop
                    </p>
                </div>
            </div>

            {/* Top Visited Pages Quick Insight */}
            {topPages.length > 0 && (
                <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Halaman Paling Banyak Dibuka Pengunjung:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        {topPages.map((p, idx) => (
                            <Link
                                key={idx}
                                href={p.url}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
                            >
                                <span className="font-mono text-blue-600">{p.url}</span>
                                <span className="rounded-full bg-white border border-slate-200 px-1.5 py-0.2 text-[10px] font-bold tabular-nums text-slate-600">
                                    {p.count}x
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <form onSubmit={handleSearchSubmit} className="grid gap-3 sm:grid-cols-12 items-center">
                    {/* Search Input */}
                    <div className="sm:col-span-5 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari IP, Halaman, Platform..."
                            className="input pl-10 text-xs sm:text-sm"
                        />
                    </div>

                    {/* Device Filter */}
                    <div className="sm:col-span-3">
                        <select
                            value={deviceFilter}
                            onChange={(e) => {
                                setDeviceFilter(e.target.value);
                                applyFilters({ device: e.target.value !== 'all' ? e.target.value : undefined });
                            }}
                            className="input text-xs sm:text-sm"
                        >
                            <option value="all">Semua Perangkat</option>
                            <option value="mobile">Hanya Mobile / HP</option>
                            <option value="desktop">Hanya Desktop / Laptop</option>
                            <option value="tablet">Hanya Tablet</option>
                            <option value="bot">Bot / Crawler</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="sm:col-span-3">
                        <select
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                applyFilters({ date: e.target.value !== 'all' ? e.target.value : undefined });
                            }}
                            className="input text-xs sm:text-sm"
                        >
                            <option value="all">Semua Waktu</option>
                            <option value="today">Hari Ini</option>
                            <option value="yesterday">Kemarin</option>
                            <option value="7days">7 Hari Terakhir</option>
                            <option value="30days">30 Hari Terakhir</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    <div className="sm:col-span-1 flex justify-end">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn-secondary w-full px-3 py-2.5 text-xs text-center justify-center"
                            title="Reset Filter"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {/* Visitors Log Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-4 py-3 sm:px-5">Waktu Kunjungan</th>
                                <th className="px-4 py-3 sm:px-5">IP Address & Negara</th>
                                <th className="px-4 py-3 sm:px-5">Halaman Dibuka</th>
                                <th className="px-4 py-3 sm:px-5">Perangkat & OS</th>
                                <th className="px-4 py-3 sm:px-5">Browser</th>
                                <th className="px-4 py-3 sm:px-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visitors.data && visitors.data.length > 0 ? (
                                visitors.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                                        {/* Waktu */}
                                        <td className="px-4 py-3.5 sm:px-5 whitespace-nowrap">
                                            <p className="font-semibold text-slate-800">{item.created_at}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {item.time_ago}
                                            </p>
                                        </td>

                                        {/* IP Address */}
                                        <td className="px-4 py-3.5 sm:px-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                    {item.ip_address}
                                                </span>
                                                {item.country && (
                                                    <span
                                                        className={`badge text-[10px] font-bold ${
                                                            item.country === 'Local'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                    >
                                                        {item.country}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Halaman Dibuka */}
                                        <td className="px-4 py-3.5 sm:px-5">
                                            <div className="flex items-center gap-2 max-w-xs">
                                                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                                                    {item.method || 'GET'}
                                                </span>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="truncate font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                                    title={item.url}
                                                >
                                                    {item.url}
                                                </a>
                                            </div>
                                            {item.referer && (
                                                <p className="mt-0.5 truncate text-[10px] text-slate-400 max-w-xs" title={`Dari: ${item.referer}`}>
                                                    Ref: {item.referer}
                                                </p>
                                            )}
                                        </td>

                                        {/* Perangkat & OS */}
                                        <td className="px-4 py-3.5 sm:px-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {item.device_type === 'mobile' && (
                                                    <Smartphone className="size-4 text-emerald-600 shrink-0" />
                                                )}
                                                {item.device_type === 'desktop' && (
                                                    <Laptop className="size-4 text-blue-600 shrink-0" />
                                                )}
                                                {item.device_type === 'tablet' && (
                                                    <Tablet className="size-4 text-indigo-600 shrink-0" />
                                                )}
                                                {item.device_type === 'bot' && (
                                                    <Bot className="size-4 text-amber-600 shrink-0" />
                                                )}
                                                <span className="font-medium text-slate-800">
                                                    {item.platform}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                                    ({item.device_type})
                                                </span>
                                            </div>
                                        </td>

                                        {/* Browser */}
                                        <td className="px-4 py-3.5 sm:px-5 whitespace-nowrap">
                                            <span className="font-medium text-slate-700">
                                                {item.browser}
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3.5 sm:px-5 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(item)}
                                                className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                                                title="Hapus Catatan Kunjungan Ini"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                                            <Users className="size-6" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Belum Ada Riwayat Kunjungan
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                            Setiap ada yang membuka website ini (baik lewat HP atau laptop), IP dan perangkat mereka akan langsung tercatat di sini.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {visitors.meta && (
                    <div className="border-t border-slate-200/80 p-4">
                        <Pagination meta={visitors.meta} params={filters} />
                    </div>
                )}
            </div>

            {/* Modal Konfirmasi Hapus Satuan */}
            {deleteTarget && (
                <ConfirmDialog
                    open={Boolean(deleteTarget)}
                    title="Hapus Catatan Kunjungan"
                    message={`Apakah Anda yakin ingin menghapus catatan kunjungan dari IP ${deleteTarget.ip_address}?`}
                    confirmLabel="Hapus Log"
                    danger
                    onConfirm={() => handleDelete(deleteTarget.id)}
                    onClose={() => setDeleteTarget(null)}
                />
            )}

            {/* Modal Konfirmasi Bersihkan Semua Log */}
            {showClearConfirm && (
                <ConfirmDialog
                    open={showClearConfirm}
                    title="Bersihkan Semua Log Pengunjung"
                    message="Apakah Anda yakin ingin mengosongkan seluruh catatan log pengunjung? Tindakan ini tidak dapat dibatalkan."
                    confirmLabel="Bersihkan Semua"
                    danger
                    onConfirm={handleClearAll}
                    onClose={() => setShowClearConfirm(false)}
                />
            )}
        </AdminLayout>
    );
}
