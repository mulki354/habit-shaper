import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { Habit } from './HabitCard';

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    habit?: Habit | null; // Jika bernilai null/undefined = mode TAMBAH, jika ada isinya = mode EDIT
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSuccess, habit }) => {
    const isEditMode = !!habit;
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<'BUILD' | 'BREAK'>('BUILD');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Reset formulir saat modal dibuka atau beralih mode
    useEffect(() => {
        if (isOpen) {
            if (habit) {
                setName(habit.name);
                setType(habit.type);
            } else {
                setName('');
                setType('BUILD');
            }
            setError(null);
            setValidationError(null);
        }
    }, [isOpen, habit]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidationError(null);

        // Validasi Sederhana
        const trimmedName = name.trim();
        if (!trimmedName) {
            setValidationError('Nama kebiasaan tidak boleh kosong.');
            return;
        }
        if (trimmedName.length < 3) {
            setValidationError('Nama kebiasaan harus minimal 3 karakter.');
            return;
        }

        try {
            setLoading(true);
            if (isEditMode && habit) {
                // Endpoint edit: PATCH /habits/:id
                await api.patch(`/habits/${habit.id}`, { name: trimmedName });
            } else {
                // Endpoint tambah: POST /habits
                await api.post('/habits', { name: trimmedName, type });
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Gagal menyimpan habit:', err);
            setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Overlay */}
            <div
                className="fixed inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <header className="flex justify-between items-center pb-4 border-b border-zinc-800/60 mb-6">
                    <h2 className="text-xl font-bold text-zinc-50 tracking-tight">
                        {isEditMode ? 'Ubah Habit' : 'Buat Habit Baru'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800/80 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert dari Server */}
                    {error && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Input Nama Habit */}
                    <div className="space-y-2">
                        <label htmlFor="habit-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Nama Kebiasaan
                        </label>
                        <input
                            id="habit-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (validationError) setValidationError(null);
                            }}
                            placeholder="Contoh: Meditasi Pagi, Bersepeda, dll."
                            className={`w-full px-4 py-3 bg-zinc-950 border text-sm text-zinc-100 rounded-xl focus:outline-none focus:ring-2 transition ${validationError
                                    ? 'border-rose-500/50 focus:ring-rose-500/20'
                                    : 'border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                                }`}
                            disabled={loading}
                            autoFocus
                        />
                        {validationError && (
                            <span className="block text-xs font-medium text-rose-400 mt-1">
                                {validationError}
                            </span>
                        )}
                    </div>

                    {/* Tipe Habit Selector */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Tipe Kebiasaan
                        </label>
                        {isEditMode ? (
                            // Tipe tidak bisa diubah ketika mode Edit (PRD § 1.1.C)
                            <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between text-zinc-500 text-xs font-medium">
                                <span>Tipe: <span className="font-bold text-zinc-400">{type}</span></span>
                                <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md font-semibold">TIDAK BISA DIUBAH</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {/* Pilihan BUILD */}
                                <button
                                    type="button"
                                    onClick={() => setType('BUILD')}
                                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition ${type === 'BUILD'
                                            ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                                            : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400'
                                        }`}
                                >
                                    <span className="text-sm font-bold">BUILD</span>
                                    <span className="text-[10px] opacity-80 text-center font-medium">Membangun habit positif</span>
                                </button>
                                {/* Pilihan BREAK */}
                                <button
                                    type="button"
                                    onClick={() => setType('BREAK')}
                                    className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition ${type === 'BREAK'
                                            ? 'border-rose-500/50 bg-rose-500/5 text-rose-400'
                                            : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400'
                                        }`}
                                >
                                    <span className="text-sm font-bold">BREAK</span>
                                    <span className="text-[10px] opacity-80 text-center font-medium">Menghentikan habit buruk</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-sm font-semibold rounded-xl transition duration-150 active:scale-98"
                            disabled={loading}
                        >
                            Batalkan
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-zinc-50 text-sm font-bold rounded-xl transition duration-150 active:scale-98 shadow-lg shadow-emerald-950/20 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
