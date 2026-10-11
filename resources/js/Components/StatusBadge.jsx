const toneClasses = {
    sky: 'bg-sky-50 text-sky-700',
    brand: 'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-100 text-slate-600',
    violet: 'bg-violet-50 text-violet-700',
};

export default function StatusBadge({ tone = 'slate', children, className = '' }) {
    return (
        <span className={`badge ${toneClasses[tone] ?? toneClasses.slate} ${className}`}>
            {children}
        </span>
    );
}

export const assetTone = (status) =>
    ({ baik: 'emerald', servis: 'amber', rusak: 'rose' })[status] ?? 'slate';

export const statusTone = (status) =>
    status === 'published' ? 'emerald' : 'amber';
