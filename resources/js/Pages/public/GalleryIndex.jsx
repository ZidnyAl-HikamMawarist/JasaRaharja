import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import Pagination from '../../Components/Pagination';

export default function GalleryIndex({ activeMenu, site, waNumber, photos, filters, categories }) {
    const [lightbox, setLightbox] = useState(null);

    return (
        <PublicLayout activeMenu={activeMenu} site={site} waNumber={waNumber}>
            <Head title="Galeri Kegiatan" />

            <header className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
                <div className="container-page py-10 sm:py-14">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-brand-600">Dokumentasi</p>
                    <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Galeri Kegiatan</h1>
                    <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
                        Jejak visual kegiatan kantor, Penyaluran santunan, dan sosialisasi Keselamatan.
                    </p>

                    <div className="mt-5 sm:mt-7 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap">
                        <CategoryChip
                            label="Semua"
                            active={!filters.kategori}
                            onClick={() => router.get('/galeri', {}, { preserveScroll: true })}
                        />
                        {categories.map((c) => (
                            <CategoryChip
                                key={c.id}
                                label={`${c.name} (${c.count})`}
                                active={Number(filters.kategori) === c.id}
                                onClick={() =>
                                    router.get(
                                        '/galeri',
                                        { kategori: Number(filters.kategori) === c.id ? undefined : c.id },
                                        { preserveScroll: true },
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </header>

            <section className="container-page py-8 sm:py-10">
                {photos.data.length > 0 ? (
                    <>
                        <div className="columns-1 gap-3.5 sm:columns-2 sm:gap-4 lg:columns-3">
                            {photos.data.map((photo) => (
                                <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => setLightbox(photo)}
                                    className="group mb-3.5 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-lg active:scale-98"
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.title}
                                        loading="lazy"
                                        className="w-full transition duration-500 group-hover:scale-[1.03]"
                                    />
                                    <div className="p-3.5 sm:p-4">
                                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500">
                                            {photo.category && (
                                                <span className="font-semibold text-brand-700">
                                                    {photo.category}
                                                </span>
                                            )}
                                            {photo.taken_at && (
                                                <>
                                                    <span className="size-1 rounded-full bg-slate-300" />
                                                    <span>{photo.taken_at}</span>
                                                </>
                                            )}
                                        </div>
                                        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-bold leading-snug text-slate-900">
                                            {photo.title}
                                        </p>
                                        {photo.caption && (
                                            <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-slate-600">
                                                {photo.caption}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <Pagination
                            meta={photos.meta}
                            params={{ kategori: filters.kategori || undefined }}
                        />
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <p className="text-xs sm:text-sm text-slate-500">Belum ada foto pada kategori ini.</p>
                        <Link href="/galeri" className="btn-secondary mt-5">
                            Lihat semua foto
                        </Link>
                    </div>
                )}
            </section>

            {lightbox && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150"
                    onClick={() => setLightbox(null)}
                >
                    <figure
                        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={lightbox.image} alt={lightbox.title} className="max-h-[55vh] sm:max-h-[70vh] w-full object-contain bg-slate-900" />
                        <figcaption className="p-4 sm:p-5">
                            <p className="text-sm sm:text-base font-bold text-slate-900">{lightbox.title}</p>
                            {lightbox.caption && (
                                <p className="mt-1 text-xs sm:text-sm text-slate-600">{lightbox.caption}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => setLightbox(null)}
                                className="btn-secondary mt-4 w-full sm:w-auto justify-center text-center text-xs sm:text-sm"
                            >
                                Tutup
                            </button>
                        </figcaption>
                    </figure>
                </div>
            )}
        </PublicLayout>
    );
}

function CategoryChip({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shrink-0 transition ${
                active
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
        >
            {label}
        </button>
    );
}
