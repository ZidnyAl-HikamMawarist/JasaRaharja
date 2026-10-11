import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../Layouts/AdminLayout';
import ConfirmDialog from './ConfirmDialog';

export default function CategoryManager({
    activeMenu,
    title,
    stats,
    categories,
    singular,
    plural,
    endpoint,
    colorField = false,
    codeField = false,
}) {
    const empty = { name: '', color: '#2563eb', code: '', description: '', sort_order: 0 };
    const [form, setForm] = useState(empty);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const reset = () => {
        setForm(empty);
        setErrors({});
        setEditingId(null);
    };

    const submit = (e) => {
        e.preventDefault();

        const payload = {
            name: form.name,
            sort_order: Number(form.sort_order) || 0,
        };
        if (colorField) payload.color = form.color;
        if (codeField) {
            payload.code = (form.code || '').toUpperCase();
            payload.description = form.description;
        }

        if (editingId) {
            router.put(`${endpoint}/${editingId}`, payload, {
                preserveScroll: true,
                onError: (errs) => setErrors(errs),
                onSuccess: reset,
            });
        } else {
            router.post(endpoint, payload, {
                preserveScroll: true,
                onError: (errs) => setErrors(errs),
                onSuccess: reset,
            });
        }
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setErrors({});
        setForm({
            name: cat.name,
            color: cat.color ?? '#2563eb',
            code: cat.code ?? '',
            description: cat.description ?? '',
            sort_order: cat.sort_order ?? 0,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AdminLayout activeMenu={activeMenu} title={title} stats={stats}>
            <Head title={title} />

            <form onSubmit={submit} className="card p-6">
                <h2 className="text-base font-bold text-slate-900">
                    {editingId ? `Ubah ${singular}` : `Tambah ${singular}`}
                </h2>

                <div className="mt-5 grid gap-4 lg:grid-cols-4">
                    <div className={codeField ? 'lg:col-span-2' : 'lg:col-span-2'}>
                        <label className="label" htmlFor="name">Nama *</label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input"
                            required
                        />
                        {errors.name && <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>}
                    </div>

                    {codeField && (
                        <div>
                            <label className="label" htmlFor="code">Kode *</label>
                            <input
                                id="code"
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                placeholder="IT"
                                className="input font-mono uppercase"
                                required
                            />
                            {errors.code && <p className="mt-1.5 text-sm text-rose-600">{errors.code}</p>}
                        </div>
                    )}

                    {colorField && (
                        <div>
                            <label className="label" htmlFor="color">Warna Label</label>
                            <div className="flex gap-2">
                                <input
                                    id="color"
                                    type="color"
                                    value={form.color}
                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
                                />
                                <input
                                    type="text"
                                    value={form.color}
                                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                                    className="input font-mono"
                                />
                            </div>
                            {errors.color && <p className="mt-1.5 text-sm text-rose-600">{errors.color}</p>}
                        </div>
                    )}

                    <div>
                        <label className="label" htmlFor="sort_order">Urutan</label>
                        <input
                            id="sort_order"
                            type="number"
                            min="0"
                            value={form.sort_order}
                            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                            className="input tabular-nums"
                        />
                    </div>

                    {codeField && (
                        <div className="lg:col-span-4">
                            <label className="label" htmlFor="description">Deskripsi</label>
                            <input
                                id="description"
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="input"
                                placeholder="Opsional"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-2">
                    <button type="submit" className="btn-primary">
                        {editingId ? 'Simpan Perubahan' : `Tambah ${singular}`}
                    </button>
                    {editingId && (
                        <button type="button" onClick={reset} className="btn-secondary">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            <div className="card mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[34rem] text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-left">
                            <tr className="text-xs uppercase tracking-wide text-slate-500">
                                <th className="px-4 py-3 font-semibold">Nama</th>
                                {codeField && <th className="px-4 py-3 font-semibold">Kode</th>}
                                {colorField && <th className="px-4 py-3 font-semibold">Warna</th>}
                                <th className="px-4 py-3 font-semibold">Urutan</th>
                                <th className="px-4 py-3 text-right font-semibold">Dipakai</th>
                                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="transition hover:bg-slate-50/70">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{cat.name}</td>
                                    {codeField && (
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{cat.code}</td>
                                    )}
                                    {colorField && (
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="size-4 rounded-full"
                                                    style={{ backgroundColor: cat.color }}
                                                />
                                                <span className="font-mono text-xs text-slate-500">
                                                    {cat.color}
                                                </span>
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-4 py-3 tabular-nums text-slate-600">
                                        {cat.sort_order}
                                    </td>
                                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                                        {cat.count}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                        <div className="inline-flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(cat)}
                                                className="btn-ghost px-2 py-1 text-xs"
                                            >
                                                Ubah
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteTarget(cat)}
                                                className="btn-ghost px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-16 text-center text-slate-500">
                                        Belum ada data.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                title={`Hapus ${singular}?`}
                message={`Kategori "${deleteTarget?.name ?? ''}" akan dihapus. Data yang terkait tidak ikut terhapus.`}
                confirmLabel="Hapus"
                danger
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => {
                    router.delete(`${endpoint}/${deleteTarget.id}`, { preserveScroll: true });
                    setDeleteTarget(null);
                }}
            />
        </AdminLayout>
    );
}
