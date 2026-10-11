import { useState, useEffect, useCallback, useRef } from 'react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    MessageCircle,
    PhoneCall,
    MapPin,
    Clock,
    Hospital,
    Phone,
} from 'lucide-react';

export default function HeroCarousel({ slides = [], site = {}, waNumber = '6281200000000' }) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const defaultSlides = [
        {
            id: 'gedung-kantor',
            title: 'Kantor Perwakilan Jasa Raharja Tasikmalaya',
            tag: 'Kantor Perwakilan Resmi',
            location: 'Jl. Ir. H. Djuanda No. 110, Tasikmalaya',
            desc: 'Pusat operasional dan koordinasi pelayanan santunan bagi masyarakat di 5 wilayah kabupaten/kota.',
            image: '/images/carousel/jasa-raharja-gedung.webp',
        },
        {
            id: 'layanan-rsud',
            title: 'Layanan Jemput Bola di RSUD Dr. Soekardjo',
            tag: 'Layanan Rumah Sakit',
            location: 'RSUD Dr. Soekardjo Tasikmalaya',
            desc: 'Petugas langsung mendatangi korban dan menerbitkan surat jaminan perawatan secara cepat dan terintegrasi.',
            image: '/images/carousel/jasaraharja-layanan-rsud-tasikmalaya.webp',
        },
        {
            id: 'sosialisasi',
            title: 'Sosialisasi & Edukasi Keselamatan Berkendara',
            tag: 'Edukasi Lapangan',
            location: 'Kota Tasikmalaya & Ciamis',
            desc: 'Upaya preventif bersama kepolisian menekan angka fatalitas kecelakaan lalu lintas di jalur rawan.',
            image: '/images/carousel/jasaraharja-sosialisasi-tasikmalaya.webp',
        },
    ];

    const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;
    const total = activeSlides.length;

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        setCurrent((prev) => (prev - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        if (total <= 1 || isPaused) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 7000);
        return () => clearInterval(timer);
    }, [total, isPaused, nextSlide]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        else if (e.key === 'ArrowRight') nextSlide();
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    };

    const currentSlide = activeSlides[current] || activeSlides[0];
    const phoneDisplay = site?.phone || '(0265) 340156';
    const phoneDigits = site?.phone ? site.phone.replace(/[^0-9]/g, '') : '0265340156';

    return (
        <section
            className="border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50/40"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
            role="region"
            aria-label="Panduan Layanan Tanggap Santunan Jasa Raharja"
        >
            <div className="container-page py-8 sm:py-12 lg:py-16">
                <div className="grid items-start gap-8 lg:gap-12 xl:gap-14 lg:grid-cols-12">
                    {/* Left Column: Action-Oriented Help Guide */}
                    <div className="lg:col-span-7">
                        {/* Primary Badge */}
                        <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>PANDUAN TANGGAP KORBAN KECELAKAAN</span>
                        </div>

                        {/* Direct Problem-Solving Headline */}
                        <h1 className="mt-3.5 text-2xl sm:text-3xl lg:text-3.5xl font-extrabold text-slate-900 leading-[1.25]">
                            Korban Kecelakaan Lalu Lintas? <br />
                            <span className="text-brand-800">Ini 3 Langkah yang Perlu Anda Lakukan.</span>
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                            Jasa Raharja hadir memberikan kepastian jaminan biaya perawatan di rumah sakit dan santunan bagi korban kecelakaan penumpang umum serta lalu lintas jalan di wilayah Priangan Timur.
                        </p>

                        {/* PRIMARY CTA: ABOVE THE FOLD (Visible without scrolling on mobile) */}
                        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <a
                                href={`https://wa.me/${waNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-98"
                            >
                                <MessageCircle className="size-5" />
                                <span>Hubungi Petugas Siaga (WhatsApp)</span>
                            </a>

                            <a
                                href={`tel:${phoneDigits}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                                title="Panggilan Telepon Kantor"
                            >
                                <PhoneCall className="size-4 text-brand-800" />
                                <span>Telp: {phoneDisplay}</span>
                            </a>
                        </div>

                        {/* 24-Hour Hotline Info Note (Minimum 14px font size) */}
                        <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-slate-100/90 border border-slate-200/90 px-3.5 py-2.5 text-sm text-slate-700">
                            <span className="inline-block size-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                            <span>
                                Darurat di luar jam kerja: Call Center Resmi Jasa Raharja{' '}
                                <a href="tel:1500020" className="font-extrabold text-brand-800 hover:text-brand-900 hover:underline">
                                    1500020
                                </a>{' '}
                                <span className="text-slate-500 font-normal">(Bebas Pulsa / 24 Jam)</span>
                            </span>
                        </div>

                        {/* 3 Step Action Hierarchy with Connecting Timeline Line */}
                        <div className="mt-7 relative pl-3 sm:pl-4 space-y-4 before:absolute before:left-[21px] sm:before:left-[25px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                            {/* Step 1 */}
                            <div className="relative flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-300">
                                <span className="relative z-10 grid size-8 sm:size-9 shrink-0 place-items-center rounded-lg bg-brand-800 text-sm font-extrabold text-white shadow-xs">
                                    1
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                                        Laporkan Kejadian ke Pihak Kepolisian
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Segera laporkan kecelakaan ke Unit Laka Lantas Polres / Polsek terdekat kejadian agar diterbitkan Laporan Polisi (LP) sebagai dasar utama penjaminan.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-300">
                                <span className="relative z-10 grid size-8 sm:size-9 shrink-0 place-items-center rounded-lg bg-brand-800 text-sm font-extrabold text-white shadow-xs">
                                    2
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                                        Koordinasi Penjaminan Biaya di Rumah Sakit
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Sampaikan kepada petugas rumah sakit bahwa korban mengalami kecelakaan lalu lintas. Petugas Jasa Raharja langsung menerbitkan Surat Jaminan (Guarantee Letter) biaya perawatan.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex items-start gap-3.5 sm:gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-300">
                                <span className="relative z-10 grid size-8 sm:size-9 shrink-0 place-items-center rounded-lg bg-brand-800 text-sm font-extrabold text-white shadow-xs">
                                    3
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                                        Petugas Kami Melakukan Jemput Bola
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                                        Petugas Jasa Raharja proaktif mendatangi rumah sakit atau kediaman korban untuk membantu pengumpulan dan verifikasi berkas santunan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Navigation Link to Detailed Requirements (Office hours removed as requested) */}
                        <div className="mt-5 flex items-center justify-start border-t border-slate-200 pt-3.5">
                            <a
                                href="#alur-santunan"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-900 hover:underline"
                            >
                                <span>Lihat Rincian Persyaratan Dokumen Klaim</span>
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Authentic Local Evidence & Real Operations Showcase (Sticky on desktop to eliminate empty space) */}
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
                        {/* Real Photo Card: Clean frame with overlay controls and bold caption contrast */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="relative aspect-16/10 w-full bg-slate-900 overflow-hidden group">
                                <img
                                    src={currentSlide.image}
                                    alt={currentSlide.title || 'Dokumentasi Jasa Raharja Tasikmalaya'}
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-103"
                                />

                                {/* Floating In-Photo Navigation Arrows */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                                    <button
                                        type="button"
                                        onClick={prevSlide}
                                        className="grid size-8 place-items-center rounded-lg bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/90 active:scale-95"
                                        aria-label="Foto sebelumnya"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextSlide}
                                        className="grid size-8 place-items-center rounded-lg bg-slate-950/60 text-white backdrop-blur-md transition hover:bg-slate-950/90 active:scale-95"
                                        aria-label="Foto selanjutnya"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>

                                {/* Deep High-Contrast Gradient for 100% Readability */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pt-12 p-4 sm:p-5 text-white z-10">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-white uppercase tracking-wider text-xs bg-brand-800 px-2.5 py-0.5 rounded shadow-xs">
                                            {currentSlide.tag || 'Dokumentasi Resmi'}
                                        </span>
                                        <div className="flex items-center gap-2 text-slate-300 text-xs">
                                            <span>{current + 1} / {total}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="size-3 text-slate-300" />
                                                {currentSlide.location || 'Tasikmalaya'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-base sm:text-lg font-bold text-white leading-snug">
                                        {currentSlide.title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-100 line-clamp-2 leading-relaxed">
                                        {currentSlide.desc}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Essential Official Guarantee Card: 100% Bebas Biaya (Single authoritative source) */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 shadow-xs">
                            <div className="flex items-start gap-3.5">
                                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs">
                                    <ShieldCheck className="size-5.5" />
                                </span>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                                        Jaminan 100% Bebas Biaya & Tanpa Calo
                                    </h3>
                                    <p className="mt-1.5 text-sm text-emerald-900 leading-relaxed">
                                        Seluruh pengurusan santunan Jasa Raharja <strong>TIDAK DIPUNGUT BIAYA APAPUN</strong>. Jangan pernah memberikan imbalan kepada perantara atau pihak yang mengatasnamakan petugas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Integration Trust Badge: Text >= 14px */}
                        <div className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-xs">
                            <Hospital className="size-5 text-brand-800 shrink-0" />
                            <span className="leading-snug">
                                Terhubung langsung secara daring dengan Unit Laka Lantas Polres & RSUD di wilayah Priangan Timur.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
