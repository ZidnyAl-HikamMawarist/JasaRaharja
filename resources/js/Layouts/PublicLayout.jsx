import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Menu,
    X,
    Home,
    Shield,
    Newspaper,
    Image as ImageIcon,
    Phone,
    MessageCircle,
    Lock,
    LayoutDashboard,
    ArrowRight,
    MapPin,
    Clock,
    Mail,
} from 'lucide-react';

export default function PublicLayout({ children, activeMenu, site, waNumber }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu on page change / route navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activeMenu]);

    // Prevent body scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const nav = [
        { label: 'Beranda', href: '/', key: 'beranda', icon: Home },
        { label: 'Alur Santunan', href: '/#alur-santunan', key: 'alur', icon: Shield },
        { label: 'Berita', href: '/berita', key: 'berita', icon: Newspaper },
        { label: 'Galeri', href: '/galeri', key: 'galeri', icon: ImageIcon },
        { label: 'Kontak', href: '/kontak', key: 'kontak', icon: Phone },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-white">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
                <div className="container-page flex h-16 sm:h-18 items-center justify-between gap-3 py-2 sm:py-3.5">
                    {/* Brand Logo with Official IFG Endorsement */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 min-w-0"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <img
                            src="/images/jasa-raharja-logo.png"
                            alt="Logo Resmi PT Jasa Raharja"
                            className="h-9 sm:h-10 w-auto object-contain shrink-0"
                        />
                        <div className="hidden sm:block border-l border-slate-300 pl-3 leading-tight min-w-0">
                            <span className="block truncate text-xs font-extrabold uppercase tracking-tight text-brand-900">
                                {site?.office ?? 'Perwakilan Tasikmalaya'}
                            </span>
                            <span className="block truncate text-[11px] font-medium text-slate-500">
                                Jawa Barat
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {nav.map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                                    activeMenu === item.key
                                        ? 'bg-brand-50 text-brand-800 font-bold'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Action Buttons: Single Clear Emergency Action in Consistent Emerald */}
                    <div className="hidden lg:flex items-center gap-3">
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-98"
                        >
                            <MessageCircle className="size-4" />
                            <span>Hubungi Petugas (WA)</span>
                        </a>

                        {auth?.user && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-600/30 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                                title="Buka Dashboard Administrator"
                            >
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Dashboard</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Header Controls: Quick WhatsApp + Hamburger Toggle */}
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                            title="Chat WhatsApp Petugas"
                        >
                            <MessageCircle className="size-4 text-emerald-600" />
                            <span className="hidden xs:inline">Bantuan</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="flex size-10 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95"
                            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? (
                                <X className="size-5 text-slate-900" />
                            ) : (
                                <Menu className="size-5 text-slate-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DRAWER / MODAL */}
                {mobileMenuOpen && (
                    <div className="fixed inset-x-0 top-16 sm:top-18 bottom-0 z-50 flex flex-col bg-white lg:hidden overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
                        {/* Top Accent Strip */}
                        <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Menu Navigasi</span>
                            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                Layanan Aktif
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 px-4 py-4 space-y-1">
                            {nav.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = activeMenu === item.key;
                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                                            isActive
                                                ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/60 shadow-xs'
                                                : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`grid size-9 place-items-center rounded-lg ${
                                                    isActive
                                                        ? 'bg-brand-600 text-white'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                <IconComponent className="size-4.5" />
                                            </div>
                                            <span>{item.label}</span>
                                        </div>
                                        <ArrowRight
                                            className={`size-4 transition ${
                                                isActive ? 'text-brand-600 translate-x-0.5' : 'text-slate-300'
                                            }`}
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Quick Action Buttons in Mobile Drawer */}
                        <div className="border-t border-slate-100 bg-slate-50/80 p-4 space-y-2.5">
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 active:bg-emerald-700 transition"
                            >
                                <MessageCircle className="size-4.5" />
                                <span>Hubungi Petugas (WhatsApp)</span>
                            </a>

                            {auth?.user ? (
                                <Link
                                    href="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600/30 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 active:bg-blue-100 transition"
                                >
                                    <LayoutDashboard className="size-4 text-blue-600" />
                                    <span>Buka Dashboard Admin</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 active:bg-slate-100 transition"
                                >
                                    <Lock className="size-4 text-slate-400" />
                                    <span>Portal Login Petugas</span>
                                </Link>
                            )}

                            {/* Office Info Footer in Mobile Menu */}
                            <div className="pt-2 text-center text-[11px] text-slate-400">
                                <p>{site?.name} · {site?.office}</p>
                                <p className="mt-0.5">{site?.address || 'Tasikmalaya'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1">{children}</main>

            {/* FOOTER */}
            <footer className="mt-14 sm:mt-20 border-t border-slate-200 bg-slate-50 pb-16 sm:pb-0">
                <div className="container-page py-10 sm:py-14">
                    <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Office Brand */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <div className="flex flex-col items-start gap-2.5">
                                <img
                                    src="/images/jasa-raharja-logo.png"
                                    alt="PT Jasa Raharja"
                                    className="h-10 w-auto object-contain"
                                />
                                <div className="leading-tight">
                                    <span className="block text-sm font-bold text-slate-900">{site?.office ?? 'Perwakilan Tasikmalaya'}</span>
                                    <span className="block text-xs text-slate-500">Member of Indonesia Financial Group (IFG)</span>
                                </div>
                            </div>
                            <p className="mt-3.5 text-sm leading-relaxed text-slate-600">
                                Memberikan jaminan kepastian perlindungan dasar bagi korban kecelakaan penumpang umum dan lalu lintas jalan di wilayah Priangan Timur.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                Navigasi
                            </h4>
                            <ul className="mt-3.5 space-y-2.5 text-sm text-slate-700">
                                {nav.map((item) => (
                                    <li key={item.key}>
                                        <Link href={item.href} className="transition hover:text-brand-800">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                Kontak Kantor
                            </h4>
                            <ul className="mt-3.5 space-y-2.5 text-sm text-slate-700">
                                <li className="flex items-start gap-2">
                                    <MapPin className="size-4 shrink-0 text-brand-800 mt-1" />
                                    <span>{site?.address}, {site?.city}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="size-4 shrink-0 text-brand-800" />
                                    <a href={`tel:${site?.phone ? site.phone.replace(/[^0-9]/g, '') : '0265340156'}`} className="font-semibold text-slate-900 hover:underline">
                                        Telp: {site?.phone || '(0265) 340156'}
                                    </a>
                                </li>
                                {site?.email && (
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-4 shrink-0 text-brand-800" />
                                        <a href={`mailto:${site.email}`} className="text-slate-700 hover:underline break-all">
                                            {site.email}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Office Hours & 24h Emergency Hotline */}
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                Jam Pelayanan
                            </h4>
                            <ul className="mt-3.5 space-y-2 text-sm text-slate-700">
                                <li className="flex items-center gap-2">
                                    <Clock className="size-4 shrink-0 text-brand-800" />
                                    <span>{site?.hours || 'Senin - Jumat 08.00 - 16.00 WIB'}</span>
                                </li>
                                <li className="text-xs text-slate-500 pl-6">
                                    Sabtu - Minggu & Libur Nasional: Kantor Tutup
                                </li>
                                <li className="mt-2.5 rounded-xl bg-brand-50 border border-brand-200 p-3.5 text-sm text-brand-950">
                                    <span className="font-bold block text-brand-900">Layanan RS Siaga 24 Jam:</span>
                                    <span>Call Center Nasional: <a href="tel:1500020" className="font-bold text-brand-900 hover:underline">1500020</a> (Bebas Pulsa)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Legal / Copyright & Discreet Staff Link */}
                    <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 text-center sm:text-left sm:flex-row">
                        <p>&copy; {new Date().getFullYear()} {site?.name} — {site?.office}.</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Situs resmi pelayanan santunan kecelakaan lalu lintas.</span>
                            <Link href="/login" className="text-slate-400 hover:text-slate-600 transition">
                                Akses Khusus Pegawai
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* STICKY BOTTOM EMERGENCY BAR (MOBILE ONLY) */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 backdrop-blur-md shadow-2xl sm:hidden flex items-center gap-2.5">
                <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-sm active:bg-emerald-700 transition"
                >
                    <MessageCircle className="size-4.5" />
                    <span>WhatsApp Petugas</span>
                </a>
                <a
                    href={`tel:${site?.phone ? site.phone.replace(/[^0-9]/g, '') : '0265340156'}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 active:bg-slate-200 transition"
                    title="Telepon Kantor / Call Center"
                >
                    <Phone className="size-4.5 text-brand-800" />
                    <span>Telepon</span>
                </a>
            </div>
        </div>
    );
}

