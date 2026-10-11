import { Link } from '@inertiajs/react';

export default function SectionHeading({ eyebrow, title, description, action, align = 'left' }) {
    const center = align === 'center';

    return (
        <div className={`flex flex-col gap-3.5 sm:gap-5 sm:flex-row sm:items-end ${center ? 'sm:justify-center sm:text-center' : 'sm:justify-between'}`}>
            <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
                {eyebrow && (
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-800">{eyebrow}</p>
                )}
                <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{description}</p>
                )}
            </div>

            {action && (
                <Link
                    href={action.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-xs transition hover:border-brand-700 hover:bg-brand-50 hover:text-brand-900 active:scale-98 shrink-0 w-full sm:w-auto text-center"
                >
                    <span>{action.label}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </Link>
            )}
        </div>
    );
}
