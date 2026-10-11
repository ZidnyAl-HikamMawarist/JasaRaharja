import { Link } from '@inertiajs/react';
import StatusBadge from './StatusBadge';

export default function ArticleCard({ article }) {
    return (
        <Link
            href={`/berita/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/5"
        >
            <div className="relative aspect-16/10 overflow-hidden bg-brand-50">
                {article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="grid size-full place-items-center bg-slate-100 text-xs font-medium text-slate-400">
                        Foto Kegiatan
                    </div>
                )}
                {article.category && (
                    <span className="absolute left-3 top-3">
                        <StatusBadge tone="brand">{article.category}</StatusBadge>
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                    <time className="text-slate-600">{article.published_at}</time>
                    <span className="size-1 rounded-full bg-slate-300" />
                    <span>{article.reading_time} menit baca</span>
                </div>

                <h3 className="mt-2.5 line-clamp-2 text-base sm:text-lg font-bold leading-snug text-slate-900 transition group-hover:text-brand-800">
                    {article.title}
                </h3>

                {article.excerpt && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                        {article.excerpt}
                    </p>
                )}

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-800">
                    Baca selengkapnya
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition group-hover:translate-x-1" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
