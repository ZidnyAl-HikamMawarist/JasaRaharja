import { Head, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import ArticleCard from '../../Components/ArticleCard';

export default function ArticleShow({ activeMenu, site, waNumber, article, related }) {
    return (
        <PublicLayout activeMenu={activeMenu} site={site} waNumber={waNumber}>
            <Head title={article.title} />

            <article className="pb-16">
                <header className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
                    <div className="container-page py-8 sm:py-12">
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                            <Link href="/" className="hover:text-brand-700">Beranda</Link>
                            <span>/</span>
                            <Link href="/berita" className="hover:text-brand-700">Berita</Link>
                        </nav>

                        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                            {article.category && (
                                <span className="badge bg-brand-50 text-brand-700 text-xs">{article.category}</span>
                            )}
                            <time className="text-xs sm:text-sm text-slate-500">{article.published_at}</time>
                            <span className="size-1 rounded-full bg-slate-300" />
                            <span className="text-xs sm:text-sm text-slate-500">{article.reading_time} menit baca</span>
                        </div>

                        <h1 className="mt-3.5 sm:mt-4 max-w-4xl text-2xl sm:text-3xl lg:text-[2.6rem] font-extrabold leading-tight tracking-tight text-slate-900">
                            {article.title}
                        </h1>

                        {article.excerpt && (
                            <p className="mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
                                {article.excerpt}
                            </p>
                        )}

                        <div className="mt-5 sm:mt-6 flex items-center gap-3 text-xs sm:text-sm text-slate-500">
                            <span className="grid size-8 sm:size-9 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                                {initials(article.author)}
                            </span>
                            <span>
                                <span className="font-semibold text-slate-800">{article.author}</span>
                                <span className="mx-2">&middot;</span>
                                {article.views} kali dibaca
                            </span>
                        </div>
                    </div>
                </header>

                <div className="container-page pt-6 sm:pt-10">
                    {article.image && (
                        <figure className="overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-brand-50">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="max-h-[22rem] sm:max-h-[32rem] w-full object-cover"
                            />
                        </figure>
                    )}

                    <div
                        className="prose-ish mt-8 sm:mt-10 max-w-3xl text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="mt-10 sm:mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/berita" className="btn-secondary justify-center text-center">
                            &larr; Kembali ke daftar berita
                        </Link>
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary justify-center text-center"
                        >
                            Hubungi Petugas
                        </a>
                    </div>
                </div>
            </article>

            {related.length > 0 && (
                <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
                    <div className="container-page">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            Berita Lainnya
                        </h2>
                        <div className="mt-6 sm:mt-8 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {related.map((a) => (
                                <ArticleCard key={a.id} article={a} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}

function initials(name) {
    return (name ?? 'JR')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}
