import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function Contact({ activeMenu, site, waNumber, officeHours, faqs, profile }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <PublicLayout activeMenu={activeMenu} site={site} waNumber={waNumber}>
            <Head title="Kontak & Profil" />

            <header className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
                <div className="container-page py-10 sm:py-14">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-brand-600">Kontak</p>
                    <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Hubungi Kami
                    </h1>
                    <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
                        Kunjungi Representation Tasikmalaya atau hubungi petugas melalui WhatsApp
                        untuk konsultasi cepat.
                    </p>
                </div>
            </header>

            <section className="container-page py-8 sm:py-12">
                <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
                    <div className="card p-5 sm:p-7">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Alamat Kantor</h2>
                        <p className="mt-2.5 sm:mt-3 text-sm leading-relaxed text-slate-700 font-medium">{site?.address}</p>
                        <p className="mt-1 text-sm text-slate-600">{site?.city}</p>

                        <dl className="mt-5 sm:mt-6 space-y-3.5 border-t border-slate-100 pt-4 sm:pt-5 text-sm">
                            <div className="flex justify-between sm:justify-start gap-3">
                                <dt className="w-24 shrink-0 font-semibold text-slate-500">Telepon</dt>
                                <dd className="text-slate-900 font-medium">
                                    <a href={`tel:${site?.phone ? site.phone.replace(/[^0-9]/g, '') : '0265340156'}`} className="hover:underline">
                                        {site?.phone || '(0265) 340156'}
                                    </a>
                                </dd>
                            </div>
                            <div className="flex justify-between sm:justify-start gap-3">
                                <dt className="w-24 shrink-0 font-semibold text-slate-500">Call Center</dt>
                                <dd className="text-brand-900 font-bold">
                                    <a href="tel:1500020" className="hover:underline">
                                        1500020 <span className="text-xs font-normal text-slate-500">(24 Jam)</span>
                                    </a>
                                </dd>
                            </div>
                            <div className="flex justify-between sm:justify-start gap-3">
                                <dt className="w-24 shrink-0 font-semibold text-slate-500">Email</dt>
                                <dd className="break-all text-slate-800 text-right sm:text-left">{site?.email || 'tasikmalaya@jasaraharja.co.id'}</dd>
                            </div>
                            <div className="flex justify-between sm:justify-start gap-3">
                                <dt className="w-24 shrink-0 font-semibold text-slate-500">WhatsApp</dt>
                                <dd>
                                    <a
                                        href={`https://wa.me/${waNumber}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-bold text-emerald-700 hover:text-emerald-800"
                                    >
                                        {site?.whatsapp || waNumber}
                                    </a>
                                </dd>
                            </div>
                        </dl>

                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary mt-6 sm:mt-7 w-full justify-center text-center"
                        >
                            Chat WhatsApp
                        </a>
                    </div>

                    <div className="card p-5 sm:p-7">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Jam Kerja</h2>
                        <ul className="mt-3.5 divide-y divide-slate-100">
                            {officeHours.map((row) => (
                                <li key={row.day} className="flex justify-between gap-4 py-2.5 sm:py-3 text-xs sm:text-sm">
                                    <span className="font-medium text-slate-700">{row.day}</span>
                                    <span className="text-slate-600">{row.time}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="mt-6 sm:mt-8 text-sm sm:text-base font-bold text-slate-900">Wilayah Layanan</h3>
                        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                            {profile.regions.map((r) => (
                                <span key={r.title} className="badge bg-slate-100 text-slate-700 text-[11px] sm:text-xs">
                                    {r.title}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="card p-5 sm:p-7 lg:col-span-1">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Peta Lokasi</h2>
                        {site?.mapsEmbed ? (
                            <div className="mt-3.5 aspect-4/3 overflow-hidden rounded-xl border border-slate-200">
                                <iframe
                                    src={site.mapsEmbed}
                                    className="size-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi Kantor"
                                />
                            </div>
                        ) : (
                            <div className="mt-3.5 grid aspect-4/3 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                                <p className="text-xs text-slate-500">
                                    Peta belum diatur. Tambahkan URL embed Google Maps pada menu
                                    Pengaturan.
                                </p>
                            </div>
                        )}

                        {site?.mapsLink && (
                            <a
                                href={site.mapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary mt-4 w-full justify-center text-center"
                            >
                                Buka di Google Maps
                            </a>
                        )}
                    </div>
                </div>

                {profile.body && (
                    <div className="card mt-6 p-5 sm:p-7">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Tentang Kantor</h2>
                        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">{profile.body}</p>

                        <div className="mt-5 sm:mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2">
                            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 sm:p-5">
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-brand-700">
                                    Visi
                                </p>
                                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
                                    {profile.vision}
                                </p>
                            </div>
                            <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-sky-700">
                                    Misi
                                </p>
                                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-slate-700">
                                    {profile.mission}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {faqs.length > 0 && (
                    <div className="mt-10 sm:mt-12">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            Pertanyaan Umum
                        </h2>
                        <div className="mt-4 sm:mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {faqs.map((faq, i) => (
                                <div key={faq.q}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                        className="flex w-full items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 text-left"
                                    >
                                        <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                            {faq.q}
                                        </span>
                                        <span
                                            className={`shrink-0 text-slate-400 font-bold text-base transition ${
                                                openIndex === i ? 'rotate-45' : ''
                                            }`}
                                        >
                                            +
                                        </span>
                                    </button>
                                    {openIndex === i && (
                                        <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm leading-relaxed text-slate-600">
                                            {faq.a}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-10 sm:mt-12 rounded-2xl bg-brand-800 p-6 sm:p-8 text-white">
                    <h2 className="text-lg sm:text-xl font-bold">Masih perlu informasi?</h2>
                    <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-brand-100">
                        Petugas Representation Tasikmalaya siap membantu pertanyaan seputar santunan
                        dan prosedur pelaporan.
                    </p>
                    <div className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50 active:scale-98"
                        >
                            Chat WhatsApp
                        </a>
                        <Link href="/berita" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-98">
                            Baca Berita Terbaru
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
