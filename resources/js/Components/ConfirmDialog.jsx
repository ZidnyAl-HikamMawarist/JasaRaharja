export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    danger = false,
    onConfirm,
    onCancel,
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{message}</p>

                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={danger ? 'btn-danger' : 'btn-primary'}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
