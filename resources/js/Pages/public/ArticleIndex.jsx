import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PublicLayout from '../../Layouts/PublicLayout';
import ArticleCard from '../../Components/ArticleCard';
import Pagination from '../../Components/Pagination';

export default function ArticleIndex({ activeMenu, site, waNumber, articles, filters, categories }) {
    const [term, setTerm] = useState(filters.q ?? '');

    const submit = (e) => {
        e.preventDefault();
        router.get(
            '/berita',
            { q: term || undefined, kategori: filters.kategori || undefined },
            { preserveState: true, replace: true },
        );
    };

    return (
        <PublicLayout activeMenu={activeMenu} site={site} waNumber={waNumber}>
            <Head title="Berita & Kegiatan" />

            <header className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
                <div className="container-page py-10 sm:py-14">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-brand-600">Arsip</p>
                    <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Berita & Kegiatan</h1>
                    <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-slate-600">
                        Dokumentasi kegiatan lapangan, Penyaluran santunan, dan sosialisasi Keselamatan
                        Representation Tasikmalaya.
                    </p>
                </div>
            </header>

            <section className="container-page py-8 sm:py-10">
                <div className="grid gap-6 lg:gap-8 lg:grid-cols-4">
                    <aside className="lg:col-span-1">
                        <form onSubmit={submit} className="card p-4 sm:p-5">
                            <label className="label text-xs sm:text-sm" htmlFor="q">Cari berita</label>
                            <div className="flex gap-2">
                                <input
                                    id="q"
                                    type="search"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="Kata kunci..."
                                    className="input text-xs sm:text-sm"
                                />
                                <button type="submit" className="btn-primary px-3 shrink-0">
                                    <SearchIcon />
                                </button>
                            </div>

                            <div className="mt-5 border-t border-slate-100 pt-4 sm:pt-5">
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Kategori
                                </p>
                                <div className="mt-2.5 flex flex-wrap gap-1.5 lg:space-y-1 lg:block">
                                    <CategoryLink
                                        label="Semua kategori"
                                        count={categories.reduce((s, c) => s + c.count, 0)}
                                        active={!filters.kategori}
                                        onClick={() =>
                                            router.get('/berita', { q: term || undefined }, { preserveState: true })
                                        }
                                    />
                                    {categories.map((c) => (
                                        <CategoryLink
                                            key={c.id}
                                            label={c.name}
                                            count={c.count}
                                            color={c.color}
                                            active={Number(filters.kategori) === c.id}
                                            onClick={() =>
                                                router.get(
                                                    '/berita',
                                                    {
                                                        q: term || undefined,
                                                        kategori: Number(filters.kategori) === c.id ? undefined : c.id,
                                                    },
                                                    { preserveState: true },
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {(filters.q || filters.kategori) && (
                                <Link
                                    href="/berita"
                                    className="btn-secondary mt-5 w-full justify-center text-center text-xs sm:text-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTerm('');
                                        router.get('/berita', {}, { preserveState: true });
                                    }}
                                >
                                    Reset pencarian
                                </Link>
                            )}
                        </form>
                    </aside>

                    <div className="lg:col-span-3">
                        <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs sm:text-sm text-slate-600">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-900">
                                    {articles.total}
                                </span>{' '}
                                berita
                                {filters.q && (
                                    <>
                                        {' '}untuk “<span className="font-semibold">{filters.q}</span>”
                                    </>
                                )}
                            </p>
                        </div>

                        {articles.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                                    {articles.data.map((a) => (
                                        <ArticleCard key={a.id} article={a} />
                                    ))}
                                </div>
                                <Pagination
                                    meta={articles.meta}
                                    params={{
                                        q: filters.q || undefined,
                                        kategori: filters.kategori || undefined,
                                    }}
                                />
                            </>
                        ) : (
                            <div className="card px-6 py-16 text-center">
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Tidak ada berita yang cocok dengan pencarian Anda.
                                </p>
                                <Link href="/berita" className="btn-secondary mt-5">
                                    Lihat semua berita
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function CategoryLink({ label, count, active, color, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold lg:flex lg:w-full lg:justify-between lg:px-3 lg:py-2 lg:text-sm transition ${
                active
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/80 font-bold'
                    : 'text-slate-600 bg-slate-50 border border-slate-100 lg:bg-transparent lg:border-transparent hover:bg-slate-100 hover:text-slate-900'
            }`}
        >
            <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                {color && (
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                )}
                <span className="truncate">{label}</span>
            </span>
            <span className="text-[11px] lg:text-xs text-slate-400 tabular-nums">({count})</span>
        </button>
    );
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
            <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />
        </svg>
    );
}
