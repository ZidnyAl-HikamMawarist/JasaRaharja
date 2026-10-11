import { Head, Link } from '@inertiajs/react';
import {
    Package,
    CheckCircle2,
    Wrench,
    AlertTriangle,
    Newspaper,
    Image,
    ArrowRight,
    Eye,
    TrendingUp,
    Layers,
    FolderArchive,
    Car,
    Monitor,
    BarChart3,
    ExternalLink,
    Calendar,
    ArrowUpRight,
} from 'lucide-react';
import AdminLayout from '../../Layouts/AdminLayout';

const cardConfigs = {
    'Total Aset Tetap': {
        icon: Package,
        href: '/admin/inventaris',
        accentBar: 'bg-blue-600',
        iconBg: 'bg-blue-50 text-blue-600 border border-blue-200/60',
        badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
        subtextColor: 'text-slate-500',
        numColor: 'text-slate-900',
    },
    'Aset Kondisi Baik': {
        icon: CheckCircle2,
        href: '/admin/inventaris?condition=baik',
        accentBar: 'bg-emerald-500',
        iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
        badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        subtextColor: 'text-emerald-600',
        numColor: 'text-slate-900',
    },
    'Perlu Servis': {
        icon: Wrench,
        href: '/admin/inventaris?condition=servis',
        accentBar: 'bg-amber-500',
        iconBg: 'bg-amber-50 text-amber-600 border border-amber-200/60',
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        subtextColor: 'text-amber-600',
        numColor: 'text-slate-900',
    },
    'Rusak Berat': {
        icon: AlertTriangle,
        href: '/admin/inventaris?condition=rusak',
        accentBar: 'bg-rose-500',
        iconBg: 'bg-rose-50 text-rose-600 border border-rose-200/60',
        badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
        subtextColor: 'text-rose-600',
        numColor: 'text-slate-900',
    },
    'Artikel Terbit': {
        icon: Newspaper,
        href: '/admin/berita',
        accentBar: 'bg-sky-500',
        iconBg: 'bg-sky-50 text-sky-600 border border-sky-200/60',
        badgeBg: 'bg-sky-50 text-sky-700 border border-sky-200/60',
        subtextColor: 'text-slate-500',
        numColor: 'text-slate-900',
    },
    'Foto Galeri': {
        icon: Image,
        href: '/admin/galeri',
        accentBar: 'bg-indigo-500',
        iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200/60',
        badgeBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
        subtextColor: 'text-slate-500',
        numColor: 'text-slate-900',
    },
};

function getCategoryIcon(name) {
    const lower = (name || '').toLowerCase();
    if (lower.includes('it') || lower.includes('komputer') || lower.includes('perangkat')) return Monitor;
    if (lower.includes('kendaraan') || lower.includes('mobil') || lower.includes('motor')) return Car;
    if (lower.includes('mebel') || lower.includes('fasilitas') || lower.includes('meja')) return Layers;
    if (lower.includes('arsip') || lower.includes('dokumen') || lower.includes('peralatan')) return FolderArchive;
    return Package;
}

export default function Dashboard({
    activeMenu,
    title,
    stats,
    cards,
    conditionBreakdown,
    byCategory,
    recentArticles,
    chart,
}) {
    const total = conditionBreakdown.reduce((sum, c) => sum + c.value, 0);
    const maxCategory = Math.max(1, ...byCategory.map((c) => c.count));
    const totalArticles = chart.values.reduce((sum, v) => sum + v, 0);

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title="Ringkasan Dashboard" />

            {/* 6 Top Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => {
                    const cfg = cardConfigs[card.label] || {
                        icon: Package,
                        href: '/admin',
                        accentBar: 'bg-brand-600',
                        iconBg: 'bg-brand-50 text-brand-600 border border-brand-200/60',
                        badgeBg: 'bg-brand-50 text-brand-700 border border-brand-200/60',
                        subtextColor: 'text-slate-500',
                        numColor: 'text-slate-900',
                    };
                    const IconComponent = cfg.icon;

                    return (
                        <Link
                            key={card.label}
                            href={cfg.href}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                        >
                            {/* Top Accent Strip */}
                            <div className={`absolute inset-x-0 top-0 h-1 ${cfg.accentBar} transition-all duration-300 group-hover:h-1.5`} />

                            <div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        {card.label}
                                    </span>
                                    <div
                                        className={`grid size-10 place-items-center rounded-xl ${cfg.iconBg} shadow-xs transition-transform duration-200 group-hover:scale-110`}
                                    >
                                        <IconComponent className="size-5" />
                                    </div>
                                </div>

                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className={`text-3xl font-black tracking-tight ${cfg.numColor}`}>
                                        {Number(card.value ?? 0).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.subtextColor}`}>
                                    <span className={`size-1.5 rounded-full ${cfg.accentBar}`} />
                                    {card.hint}
                                </span>
                                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-400 transition-colors group-hover:text-brand-600">
                                    <span>Lihat</span>
                                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Middle Section: Kondisi Aset & Aset per Kategori */}
            <div className="mt-6 grid gap-6 lg:grid-cols-5">
                {/* Kondisi Aset Tetap */}
                <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Kondisi Aset Tetap</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Status kelayakan fisik inventaris kantor</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                Total {total} Unit
                            </span>
                        </div>

                        {/* Unified Segmented Distribution Bar */}
                        {total > 0 && (
                            <div className="mt-5">
                                <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner">
                                    {conditionBreakdown.map((row) => {
                                        const pct = (row.value / total) * 100;
                                        if (pct === 0) return null;
                                        return (
                                            <div
                                                key={row.label}
                                                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                                                style={{ width: `${pct}%`, backgroundColor: row.color }}
                                                title={`${row.label}: ${row.value} unit (${Math.round(pct)}%)`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Breakdown Cards */}
                        <div className="mt-5 space-y-3">
                            {conditionBreakdown.map((row) => {
                                const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
                                const isBaik = row.label === 'Baik';
                                const isServis = row.label === 'Perlu Servis';
                                const RowIcon = isBaik ? CheckCircle2 : isServis ? Wrench : AlertTriangle;
                                const rowBadge = isBaik
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                    : isServis
                                      ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                                      : 'bg-rose-50 text-rose-700 border-rose-200/60';

                                return (
                                    <div
                                        key={row.label}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:bg-slate-50 hover:border-slate-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="grid size-8 place-items-center rounded-lg border shadow-2xs"
                                                style={{
                                                    backgroundColor: `${row.color}15`,
                                                    borderColor: `${row.color}35`,
                                                    color: row.color,
                                                }}
                                            >
                                                <RowIcon className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                                                <p className="text-[11px] text-slate-400">
                                                    {isBaik
                                                        ? 'Dapat beroperasi normal'
                                                        : isServis
                                                          ? 'Perbaikan minor / berkala'
                                                          : 'Tidak dapat difungsikan'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${rowBadge}`}>
                                                {row.value} unit ({pct}%)
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {total === 0 && (
                            <p className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                                Belum ada data inventaris aset tercatat.
                            </p>
                        )}
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <Link
                            href="/admin/inventaris"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                            <span>Buka Buku Inventaris Lengkap</span>
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Aset per Kategori */}
                <div className="card p-6 lg:col-span-3 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Aset per Kategori</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Sebaran kuantitas unit berdasarkan kelompok inventaris</p>
                            </div>
                            <Link
                                href="/admin/kategori-aset"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition hover:text-brand-700"
                            >
                                <span>Kelola Kategori</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="mt-5 space-y-3.5">
                            {byCategory.map((cat) => {
                                const CatIcon = getCategoryIcon(cat.name);
                                const pct = maxCategory > 0 ? Math.round((cat.count / maxCategory) * 100) : 0;

                                return (
                                    <div
                                        key={cat.id}
                                        className="group rounded-xl border border-slate-100 bg-white p-3 shadow-2xs transition-all hover:border-slate-200 hover:shadow-xs"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                                                    <CatIcon className="size-4" />
                                                </div>
                                                <span className="truncate text-sm font-semibold text-slate-800">
                                                    {cat.name}
                                                </span>
                                            </div>

                                            <span className="inline-flex shrink-0 items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-900 group-hover:bg-brand-100 group-hover:text-brand-800">
                                                {cat.count} Unit
                                            </span>
                                        </div>

                                        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-sky-400 transition-all duration-500"
                                                style={{ width: `${Math.max(6, pct)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {byCategory.length === 0 && (
                                <p className="py-8 text-center text-sm text-slate-500">
                                    Belum ada kategori aset yang ditambahkan.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>Total {byCategory.length} kategori inventaris aktif</span>
                        <Link href="/admin/inventaris" className="font-semibold text-brand-600 hover:underline">
                            Filter per kategori &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Berita Terbaru & Grafik Publikasi */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Berita Terbaru */}
                <div className="card p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Berita & Kegiatan Terbaru</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Artikel dan publikasi sosialisasi yang baru diperbarui</p>
                            </div>
                            <Link
                                href="/admin/berita"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition hover:text-brand-700"
                            >
                                <span>Semua Berita</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100">
                            {recentArticles.map((article) => {
                                const isPublished = article.status === 'published';
                                return (
                                    <div
                                        key={article.id}
                                        className="group flex items-center justify-between gap-4 py-3.5 transition-colors"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/admin/berita/${article.id}/edit`}
                                                className="truncate block text-sm font-semibold text-slate-900 transition-colors group-hover:text-brand-600"
                                            >
                                                {article.title}
                                            </Link>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3" />
                                                    {article.published_at ?? 'Belum terbit'}
                                                </span>
                                                <span>&bull;</span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="size-3" />
                                                    {article.views} dibaca
                                                </span>
                                                {article.is_featured && (
                                                    <>
                                                        <span>&bull;</span>
                                                        <span className="font-semibold text-brand-600">Sorotan</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                                isPublished
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                                            }`}
                                        >
                                            <span
                                                className={`size-1.5 rounded-full ${
                                                    isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}
                                            />
                                            {isPublished ? 'Tayang' : 'Draft'}
                                        </span>
                                    </div>
                                );
                            })}

                            {recentArticles.length === 0 && (
                                <p className="py-8 text-center text-sm text-slate-500">
                                    Belum ada artikel berita yang dibuat.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                        <Link
                            href="/admin/berita/create"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 py-2.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100 hover:border-brand-400"
                        >
                            <span>+ Buat Berita Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Grafik Publikasi 12 Bulan */}
                <div className="card p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">Publikasi 12 Bulan Terakhir</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Tren kuantitas rilis berita resmi per bulan</p>
                            </div>
                            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 border border-brand-200/60">
                                {totalArticles} Artikel Rilis
                            </span>
                        </div>

                        <div className="mt-6 h-56">
                            {chart.labels.length === 0 ? (
                                <div className="grid h-full place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
                                    Belum ada data publikasi bulanan.
                                </div>
                            ) : (
                                <div className="flex h-full items-end gap-2 border-b border-slate-200 pb-2">
                                    {chart.labels.map((label, i) => {
                                        const max = Math.max(1, ...chart.values);
                                        const count = chart.values[i] || 0;
                                        const pct = Math.round((count / max) * 100);

                                        return (
                                            <div
                                                key={label + i}
                                                className="group relative flex h-full flex-1 flex-col justify-end items-center gap-1.5"
                                            >
                                                {/* Floating Count Tooltip */}
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md pointer-events-none">
                                                    {count}
                                                </span>

                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {count > 0 ? count : ''}
                                                </span>

                                                {/* Bar Column */}
                                                <div
                                                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-brand-600 to-sky-400 shadow-2xs transition-all duration-300 group-hover:from-brand-500 group-hover:to-sky-300 group-hover:scale-y-105 origin-bottom"
                                                    style={{ height: `${Math.max(6, pct)}%` }}
                                                />

                                                {/* Month Label */}
                                                <span className="text-center text-[10px] font-semibold text-slate-400 group-hover:text-slate-700">
                                                    {label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-brand-600" />
                            Jumlah artikel terbit per bulan
                        </span>
                        <Link href="/admin/berita" className="font-semibold text-brand-600 hover:underline">
                            Lihat arsip &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
