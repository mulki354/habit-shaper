import React, { useState } from 'react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    habitName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    habitName,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setError(null);
            await onConfirm();
            onClose();
        } catch (err: any) {
            console.error('Gagal menghapus habit:', err);
            setError(err.message || 'Terjadi kesalahan saat menghapus habit.');
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
            <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center space-y-4">
                    {/* Warning Icon Visual */}
                    <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Hapus Kebiasaan?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Apakah Anda yakin ingin menghapus habit <span className="font-semibold text-zinc-200">"{habitName}"</span>? Semua data progres harian dan streak akan terhapus secara permanen.
                        </p>
                    </div>

                    {/* Server Error Alert */}
                    {error && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-semibold text-left">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-sm font-semibold rounded-xl transition duration-150 active:scale-98"
                            disabled={loading}
                        >
                            Batalkan
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-zinc-50 text-sm font-semibold rounded-xl transition duration-150 active:scale-98 shadow-lg shadow-rose-950/20"
                            disabled={loading}
                        >
                            {loading ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
