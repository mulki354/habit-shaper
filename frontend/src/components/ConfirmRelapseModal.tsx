import React, { useState } from 'react';

interface ConfirmRelapseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    habitName: string;
}

export const ConfirmRelapseModal: React.FC<ConfirmRelapseModalProps> = ({
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
            console.error('Gagal mencatat relapse:', err);
            setError(err.message || 'Terjadi kesalahan saat mencatat relapse.');
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-bounce">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Tandai Relapse Hari Ini?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Apakah Anda yakin ingin menandai relapse untuk habit <span className="font-semibold text-zinc-200">"{habitName}"</span>? Streak bersih Anda akan di-reset kembali ke <span className="text-rose-400 font-bold">Day 0</span>.
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
                            {loading ? 'Mencatat...' : 'Ya, Relapse'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
