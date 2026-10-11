import { Link, router } from '@inertiajs/react';

export default function Pagination({ meta, params = {} }) {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    const go = (page) => {
        router.get(
            meta.path,
            { ...params, page: page === 1 ? undefined : page },
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const pageLink = (number) => (
        <Link
            key={number}
            href="#"
            onClick={(e) => {
                e.preventDefault();
                go(number);
            }}
            aria-current={number === meta.current_page ? 'page' : undefined}
            className={`grid size-10 place-items-center rounded-lg border text-sm font-semibold transition ${
                number === meta.current_page
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
            {number}
        </Link>
    );

    const start = Math.max(1, meta.current_page - 2);
    const end = Math.min(meta.last_page, meta.current_page + 2);
    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(pageLink(i));
    }

    return (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label="Navigasi halaman">
            {meta.current_page > 1 && (
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        go(meta.current_page - 1);
                    }}
                    className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="Halaman sebelumnya"
                >
                    &larr;
                </Link>
            )}

            {start > 1 && (
                <>
                    {pageLink(1)}
                    {start > 2 && <span className="px-1 text-slate-400">&hellip;</span>}
                </>
            )}

            {numbers}

            {end < meta.last_page && (
                <>
                    {end < meta.last_page - 1 && <span className="px-1 text-slate-400">&hellip;</span>}
                    {pageLink(meta.last_page)}
                </>
            )}

            {meta.current_page < meta.last_page && (
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        go(meta.current_page + 1);
                    }}
                    className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="Halaman berikutnya"
                >
                    &rarr;
                </Link>
            )}
        </nav>
    );
}
