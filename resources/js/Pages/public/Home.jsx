import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import SectionHeading from '../../Components/SectionHeading';
import ArticleCard from '../../Components/ArticleCard';
import StatusBadge from '../../Components/StatusBadge';
import HeroCarousel from '../../Components/HeroCarousel';

export default function Home({
    activeMenu,
    site,
    waNumber,
    hero,
    maklumat,
    quickFacts,
    steps,
    stepNote,
    articles,
    gallery,
    stats,
    assetCondition,
    assetSummaryEnabled,
}) {
    return (
        <PublicLayout activeMenu={activeMenu} site={site} waNumber={waNumber}>
            <Head title="Beranda" />

            {/* HERO CAROUSEL / ACTION GUIDE */}
            <HeroCarousel slides={hero.slides} site={site} waNumber={waNumber} />

            {/* QUICK FACTS / JAMINAN PELAYANAN RESMI */}
            <section className="container-page py-6 sm:py-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {quickFacts.map((f) => (
                        <div key={f.label} className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition hover:border-brand-300">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {f.label}
                            </p>
                            <p className="mt-1 text-sm sm:text-base font-extrabold text-slate-900">{f.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ALUR SANTUNAN */}
            <section id="alur-santunan" className="scroll-mt-20 bg-slate-50 py-12 sm:py-16 lg:py-20 border-t border-slate-200">
                <div className="container-page">
                    <SectionHeading
                        eyebrow="Pedoman Pengajuan"
                        title="Alur Pengajuan Santunan"
                        description="Lima tahapan pelayanan santunan bagi korban kecelakaan penumpang umum dan lalu lintas jalan."
                    />

                    <ol className="mt-8 sm:mt-12 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                        {steps.map((step, i) => (
                            <li key={step.no} className="relative flex flex-col">
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute left-[55%] top-5.5 right-[-45%] h-0.5 bg-slate-200 z-0" />
                                )}
                                <div className="relative z-10 flex flex-col flex-1 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:border-brand-300 hover:shadow-xs">
                                    <span className="grid size-11 place-items-center rounded-xl bg-brand-800 text-sm font-extrabold text-white shadow-xs">
                                        {step.no}
                                    </span>
                                    <h3 className="mt-4 text-base font-bold text-slate-900 leading-snug">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                                        {step.desc}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    {stepNote && (
                        <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50/70 p-5 sm:p-6 text-sm text-slate-700 leading-relaxed shadow-xs">
                            <p className="font-bold text-base text-brand-900 mb-1">Kelengkapan Dokumen Utama:</p>
                            <p>{stepNote}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* BERITA */}
            <section className="container-page py-12 sm:py-16 lg:py-20">
                <SectionHeading
                    eyebrow="Kabar Terbaru"
                    title="Berita & Kegiatan"
                    description="Dokumentasi kegiatan lapangan, Penyaluran santunan, dan sosialisasi keselamatan di wilayah Tasikmalaya."
                    action={{ label: 'Lihat semua berita', href: '/berita' }}
                />

                {articles.length > 0 ? (
                    <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((a) => (
                            <ArticleCard key={a.id} article={a} />
                        ))}
                    </div>
                ) : (
                    <EmptyState text="Belum ada berita yang tayang." />
                )}
            </section>

            {/* GALERI */}
            <section className="container-page py-12 sm:py-16 lg:py-20">
                <SectionHeading
                    eyebrow="Dokumentasi"
                    title="Galeri Kegiatan"
                    description="Jejak visual kegiatan pelayanan dan sosialisasi kantor Perwakilan Tasikmalaya."
                    action={{ label: 'Lihat semua foto', href: '/galeri' }}
                />

                {gallery.length > 0 ? (
                    <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {gallery.slice(0, 8).map((g) => (
                            <Link
                                key={g.id}
                                href="/galeri"
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md hover:border-brand-300"
                            >
                                <div className="relative aspect-16/10 sm:aspect-4/3 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={g.image}
                                        alt={g.title}
                                        loading="lazy"
                                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    {g.category && (
                                        <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-950/70 backdrop-blur-xs px-2 py-0.5 text-xs font-semibold text-white">
                                            {g.category}
                                        </span>
                                    )}
                                </div>
                                <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                                    <p className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-800 transition">
                                        {g.title}
                                    </p>
                                    {g.taken_at && (
                                        <p className="mt-1.5 text-xs text-slate-500">
                                            {g.taken_at}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState text="Belum ada foto dokumentasi." />
                )}
            </section>
        </PublicLayout>
    );
}

function HighlightImage({ url }) {
    if (!url) {
        return <div className="grid size-full place-items-center bg-gradient-to-br from-brand-100 to-sky-100 text-sm font-semibold text-brand-700">Dokumentasi</div>;
    }
    return (
        <img
            src={url}
            alt=""
            className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
    );
}

function Stat({ value, label, suffix = '' }) {
    return (
        <div>
            <dt className="text-2xl font-extrabold tracking-tight text-slate-900">
                {Number(value ?? 0).toLocaleString('id-ID')}
                {suffix}
            </dt>
            <dd className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </dd>
        </div>
    );
}

const tones = {
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
};

function ConditionCard({ label, value, tone }) {
    return (
        <div className={`rounded-xl p-4 text-center ${tones[tone]}`}>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide opacity-80">{label}</p>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-sm text-slate-500">{text}</p>
        </div>
    );
}

function Megaphone() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6" aria-hidden="true">
            <path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1zM15 8a4 4 0 010 8M18 5a8 8 0 010 14" />
        </svg>
    );
}
