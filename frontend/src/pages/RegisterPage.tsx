import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';
import { api } from '../lib/api';

interface RegisterResponse {
    user: {
        id: number;
        email: string;
    };
    accessToken: string;
}

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Kata sandi konfirmasi tidak cocok');
            return;
        }

        setSubmitting(true);
        try {
            const data = await api.post<RegisterResponse>('/auth/register', { email, password });
            await login(data.accessToken);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Gagal mendaftarkan akun baru');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 px-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Daftar Akun</h1>
                    <p className="text-sm text-zinc-400">Mulailah melacak kebiasaan baik Anda</p>
                </div>

                {error && (
                    <div className="p-3 bg-rose-950 border border-rose-800 text-rose-300 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Alamat Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 text-sm transition"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Kata Sandi
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 text-sm transition"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Konfirmasi Kata Sandi
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 text-sm transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:bg-zinc-700 disabled:scale-100 text-white font-medium rounded-lg text-sm transition shadow-lg shadow-emerald-950/20"
                    >
                        {submitting ? 'Memproses...' : 'Daftar Akun'}
                    </button>
                </form>

                <div className="text-center text-sm text-zinc-400 pt-2 border-t border-zinc-800">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                        Masuk Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
};
