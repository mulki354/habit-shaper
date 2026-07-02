import React from 'react';
import { useAuth } from '../context/AuthContent';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-[100dvh] bg-zinc-950 px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex justify-between items-center pb-6 border-b border-zinc-800">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Dashboard</h1>
                        <p className="text-sm text-zinc-400">Masuk sebagai: {user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 text-zinc-300 font-medium rounded-lg text-sm transition"
                    >
                        Keluar Sesi
                    </button>
                </header>

                <main className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl text-center space-y-4">
                    <h2 className="text-2xl font-bold text-emerald-500">Koneksi Sesi Berhasil!</h2>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Halaman terlindungi ini hanya dapat diakses setelah melakukan otentikasi login/register yang sah.
                    </p>
                </main>
            </div>
        </div>
    );
};
