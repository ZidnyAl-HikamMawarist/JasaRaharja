import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

export default function Login({ flash }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <Head title="Masuk Dashboard" />

            <div className="relative hidden overflow-hidden bg-slate-900 lg:block">
                {/* Background Carousel Image */}
                <img
                    src="/images/carousel/jasa-raharja-gedung.webp"
                    alt="Gedung PT Jasa Raharja Tasikmalaya"
                    className="absolute inset-0 h-full w-full object-cover object-center transform scale-105 transition-transform duration-1000"
                />

                {/* Dark Blue/Slate Corporate Overlays for optimal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/80 to-blue-900/60" />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

                <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-white/20 text-sm font-extrabold text-white backdrop-blur-md border border-white/25 shadow-lg shadow-black/20">
                            JR
                        </span>
                        <div className="leading-tight">
                            <p className="text-sm font-bold text-white tracking-wide">PT Jasa Raharja</p>
                            <p className="text-xs text-blue-200/90 font-medium">Perwakilan Tasikmalaya</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 border border-blue-400/40 px-3 py-1 text-[11px] font-bold text-blue-200 backdrop-blur-md mb-4 uppercase tracking-wider">
                            Portal Administrasi Internal
                        </span>
                        <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
                            Kelola berita dan inventaris kantor dalam satu tempat.
                        </h1>
                        <p className="mt-4 text-sm xl:text-base leading-relaxed text-blue-100/90">
                            Dashboard terpadu pengelolaan publikasi kegiatan kantor, arsip dokumentasi galeri, dan monitoring inventaris aset tetap secara akurat.
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-blue-200/70 border-t border-white/10 pt-6">
                        <p>&copy; {new Date().getFullYear()} PT Jasa Raharja (Persero).</p>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                            Sistem Terhubung
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center bg-slate-50 px-4 py-8 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex items-center gap-3 lg:hidden">
                        <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-xs font-extrabold text-white shadow-md shadow-brand-600/25">
                            JR
                        </span>
                        <div className="leading-tight">
                            <p className="text-sm font-bold text-slate-900">PT Jasa Raharja</p>
                            <p className="text-xs text-slate-500">Perwakilan Tasikmalaya</p>
                        </div>
                    </div>

                    <div className="card p-5 sm:p-8 shadow-xl shadow-slate-900/5">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                            Masuk Dashboard
                        </h2>
                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600">
                            Gunakan akun administrator Perwakilan Tasikmalaya.
                        </p>

                        {auth?.user && (
                            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/90 p-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                    <p className="text-xs font-semibold text-blue-950">
                                        Anda saat ini sedang login sebagai <span className="font-bold text-blue-700">{auth.user.name}</span> ({auth.user.role_label || 'Administrator'}).
                                    </p>
                                </div>
                                <div className="mt-3.5 flex flex-wrap gap-2">
                                    <Link
                                        href="/admin"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                                    >
                                        Buka Dashboard Admin &rarr;
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => router.post('/logout')}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                    >
                                        Keluar / Ganti Akun
                                    </button>
                                </div>
                            </div>
                        )}

                        {flash?.error && (
                            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {flash.error}
                            </div>
                        )}
                        {flash?.success && (
                            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <label className="label" htmlFor="login">
                                    Username atau Email
                                </label>
                                <input
                                    id="login"
                                    type="text"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    className="input"
                                    autoComplete="username"
                                    autoFocus
                                    required
                                />
                                {errors.login && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.login}</p>
                                )}
                            </div>

                            <div>
                                <label className="label" htmlFor="password">
                                    Kata Sandi
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="input"
                                    autoComplete="current-password"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-rose-600">{errors.password}</p>
                                )}
                            </div>

                            <label className="flex items-center gap-2.5 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                                />
                                Ingat saya di perangkat ini
                            </label>

                            <button type="submit" disabled={processing} className="btn-primary w-full py-3">
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Akun demo
                            </p>
                            <p className="mt-1.5 text-sm text-slate-700">
                                Username <span className="font-semibold">admin</span> &middot; Kata sandi{' '}
                                <span className="font-semibold">JasaRaharja2026!</span>
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        <a href="/" className="font-semibold text-brand-700 hover:text-brand-800">
                            &larr; Kembali ke situs publik
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
