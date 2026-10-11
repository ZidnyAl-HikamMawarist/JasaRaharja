import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import {
    LayoutDashboard,
    Package,
    Layers,
    Newspaper,
    Image as ImageIcon,
    Settings,
    ExternalLink,
    LogOut,
    Menu,
    X,
    Plus,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    FolderArchive,
    User,
    Shield,
    Users,
} from 'lucide-react';

export default function AdminLayout({ children, title, activeMenu, stats }) {
    const { auth, flash } = usePage().props;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const quickActionsRef = useRef(null);
    const profileMenuRef = useRef(null);

    // Auto-dismiss flash notifications
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Close dropdowns on escape or click outside
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setQuickActionsOpen(false);
                setProfileMenuOpen(false);
            }
        };

        const handleClickOutside = (e) => {
            if (quickActionsRef.current && !quickActionsRef.current.contains(e.target)) {
                setQuickActionsOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
                setProfileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const initials = auth?.user?.name
        ? auth.user.name
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
        : 'AK';

    const navGroups = [
        {
            title: 'UTAMA',
            items: [
                {
                    label: 'Ringkasan',
                    href: '/admin',
                    icon: LayoutDashboard,
                    key: 'dashboard',
                },
                {
                    label: 'Pengunjung Web',
                    href: '/admin/pengunjung',
                    icon: Users,
                    key: 'pengunjung',
                    count: stats?.pengunjung,
                },
            ],
        },
        {
            title: 'PENGELOLAAN ASET',
            items: [
                {
                    label: 'Inventaris Aset',
                    href: '/admin/inventaris',
                    icon: Package,
                    key: 'inventaris',
                    count: stats?.aset,
                },
                {
                    label: 'Kategori Aset',
                    href: '/admin/kategori-aset',
                    icon: Layers,
                    key: 'kategori-aset',
                },
            ],
        },
        {
            title: 'KONTEN & PUBLIKASI',
            items: [
                {
                    label: 'Berita & Artikel',
                    href: '/admin/berita',
                    icon: Newspaper,
                    key: 'berita',
                    count: stats?.artikel,
                },
                {
                    label: 'Galeri Dokumentasi',
                    href: '/admin/galeri',
                    icon: ImageIcon,
                    key: 'galeri',
                },
                {
                    label: 'Kategori Berita',
                    href: '/admin/kategori-berita',
                    icon: FolderArchive,
                    key: 'kategori-berita',
                },
                {
                    label: 'Kategori Galeri',
                    href: '/admin/kategori-galeri',
                    icon: FolderArchive,
                    key: 'kategori-galeri',
                },
            ],
        },
        {
            title: 'KONFIGURASI',
            items: [
                {
                    label: 'Pengaturan Kantor',
                    href: '/admin/pengaturan',
                    icon: Settings,
                    key: 'pengaturan',
                },
            ],
        },
    ];

    const sidebarContent = (
        <div className="flex h-full flex-col bg-slate-900 text-slate-300">
            {/* Brand Header */}
            <div className="flex h-18 items-center gap-3 border-b border-slate-800/80 px-5">
                <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 text-white font-black text-sm">
                    JR
                    <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-slate-900 bg-emerald-400 animate-pulse" />
                </div>
                <div className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-bold text-white tracking-tight">
                        Jasa Raharja
                    </span>
                    <span className="block truncate text-[11px] font-medium text-slate-400">
                        Perwakilan Tasikmalaya
                    </span>
                </div>
            </div>

            {/* Quick Status Pill */}
            <div className="px-4 pt-3.5 pb-1">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-1.5 border border-slate-800/60 text-[11px]">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        Sistem Terhubung
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">v2.6 Enterprise</span>
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
                {navGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {group.title}
                        </p>
                        {group.items.map((item) => {
                            const isActive = activeMenu === item.key;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <item.icon
                                            className={`size-4.5 shrink-0 transition duration-150 ${
                                                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                            }`}
                                        />
                                        <span className="truncate">{item.label}</span>
                                    </div>
                                    {item.count !== undefined && item.count !== null && (
                                        <span
                                            className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                                            }`}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-slate-800/80 p-3 space-y-1.5">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition"
                >
                    <span className="flex items-center gap-2.5">
                        <ExternalLink className="size-4" />
                        Buka Situs Publik
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Web</span>
                </Link>

                <button
                    type="button"
                    onClick={() => router.post('/logout')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition text-left cursor-pointer"
                >
                    <LogOut className="size-4" />
                    Keluar dari Sistem
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
            {/* Desktop Fixed Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-900 lg:block shadow-xl">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 lg:hidden shadow-2xl animate-in slide-in-from-left duration-200">
                        {sidebarContent}
                    </aside>
                </>
            )}

            {/* Main Content Area */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Clean Topbar: Left has Page Title, Right has Quick Action + Profile Dropdown */}
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
                        {/* Left: Mobile Toggle & Page Title (Clean, no email subtitle, no breadcrumbs) */}
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
                                aria-label="Buka navigasi"
                            >
                                <Menu className="size-4.5" />
                            </button>

                            <div className="min-w-0">
                                <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                                    {title}
                                </h1>
                            </div>
                        </div>

                        {/* Right: Quick Action + Administrator Profile in Top-Right Corner */}
                        <div className="flex items-center gap-3 shrink-0">
                            {/* Quick Add Dropdown */}
                            <div className="relative" ref={quickActionsRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setQuickActionsOpen((prev) => !prev);
                                        setProfileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition"
                                >
                                    <Plus className="size-3.5" />
                                    <span className="hidden sm:inline">Aksi Cepat</span>
                                    <ChevronDown className="size-3 opacity-80" />
                                </button>

                                {quickActionsOpen && (
                                    <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Tambah Data Baru
                                        </div>
                                        <Link
                                            href="/admin/inventaris/create"
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            onClick={() => setQuickActionsOpen(false)}
                                        >
                                            <Package className="size-3.5 text-slate-400" />
                                            Tambah Aset Baru
                                        </Link>
                                        <Link
                                            href="/admin/berita/create"
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            onClick={() => setQuickActionsOpen(false)}
                                        >
                                            <Newspaper className="size-3.5 text-slate-400" />
                                            Tulis Berita Baru
                                        </Link>
                                        <Link
                                            href="/admin/galeri/create"
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            onClick={() => setQuickActionsOpen(false)}
                                        >
                                            <ImageIcon className="size-3.5 text-slate-400" />
                                            Upload Foto Galeri
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Dropdown in Top-Right Corner */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setProfileMenuOpen((prev) => !prev);
                                        setQuickActionsOpen(false);
                                    }}
                                    className={`flex items-center gap-2.5 rounded-xl border p-1 sm:pr-3 transition-all duration-150 ${
                                        profileMenuOpen
                                            ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                    title="Menu Profil Administrator"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-xs text-white shadow-xs">
                                        {initials}
                                    </div>
                                    <div className="hidden sm:block text-left leading-tight">
                                        <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                                            {auth?.user?.name || 'Administrator'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium truncate">
                                            {auth?.user?.role_label || 'Admin Sistem'}
                                        </p>
                                    </div>
                                    <ChevronDown className="size-3.5 text-slate-400 hidden sm:block" />
                                </button>

                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                                        {/* Profile Card Header */}
                                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-sm text-white shadow-xs">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1 leading-tight">
                                                <p className="truncate text-xs font-bold text-slate-900">
                                                    {auth?.user?.name}
                                                </p>
                                                <p className="truncate text-[11px] text-slate-500 font-medium mt-0.5">
                                                    {auth?.user?.email}
                                                </p>
                                                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                                    {auth?.user?.role_label || 'Administrator Sistem'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            <Link
                                                href="/admin/pengaturan?tab=akun"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            >
                                                <User className="size-4 text-slate-400" />
                                                <span>Profil & Akun Admin</span>
                                            </Link>

                                            <Link
                                                href="/admin/pengaturan?tab=hero"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            >
                                                <Settings className="size-4 text-slate-400" />
                                                <span>Pengaturan Kantor</span>
                                            </Link>

                                            <a
                                                href="/"
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition"
                                            >
                                                <ExternalLink className="size-4 text-slate-400" />
                                                <span>Lihat Situs Publik</span>
                                            </a>
                                        </div>

                                        <div className="border-t border-slate-100 my-1.5" />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProfileMenuOpen(false);
                                                router.post('/logout');
                                            }}
                                            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                                        >
                                            <LogOut className="size-4 text-rose-500" />
                                            <span>Keluar dari Sistem</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Floating Flash Toasts */}
                {showFlash && (flash?.success || flash?.error) && (
                    <div className="fixed top-5 right-5 z-50 max-w-md animate-in slide-in-from-top-3 fade-in duration-200">
                        <div
                            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md ${
                                flash.error
                                    ? 'border-rose-200 bg-rose-50/95 text-rose-800'
                                    : 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
                            }`}
                        >
                            {flash.error ? (
                                <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
                            ) : (
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                                    {flash.error ? 'Pemberitahuan Sistem' : 'Berhasil'}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold leading-relaxed">
                                    {flash.error || flash.success}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFlash(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-700 transition"
                                aria-label="Tutup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Body */}
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>

                {/* Footer Note */}
                <footer className="border-t border-slate-200/80 bg-white py-3.5 px-4 sm:px-6 lg:px-8 text-center sm:text-left text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© 2026 PT Jasa Raharja (Persero) Perwakilan Tasikmalaya · Portal Internal</p>
                    <p className="text-[11px] font-medium text-slate-400">
                        Keamanan Terpantau · Akses Otorisasi Admin
                    </p>
                </footer>
            </div>
        </div>
    );
}
