import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container Stack */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 p-4 bg-zinc-900/90 backdrop-blur-md border rounded-xl shadow-2xl pointer-events-auto animate-in slide-in-from-right-5 fade-in duration-200 ${toast.type === 'success'
                                ? 'border-emerald-500/20'
                                : toast.type === 'error'
                                    ? 'border-rose-500/20'
                                    : 'border-zinc-800'
                            }`}
                    >
                        {/* Ikon Kustom */}
                        <div className={`mt-0.5 flex items-center justify-center p-1 rounded-lg ${toast.type === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : toast.type === 'error'
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-zinc-800 text-zinc-400'
                            }`}>
                            {toast.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            ) : toast.type === 'error' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 1 1 1.063 1.06l-.041.02a.75.75 0 0 1-1.063-1.06Zm-1.87 9.485a20.803 20.803 0 0 0 5.239 0 .75.75 0 0 0 .57-.595V7.75c0-.414-.336-.75-.75-.75h-4.5a.75.75 0 0 0-.75.75v12.39c0 .351.242.646.57.695Z" />
                                </svg>
                            )}
                        </div>

                        {/* Konten Teks */}
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-zinc-100 leading-snug">
                                {toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Kesalahan' : 'Informasi'}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                                {toast.message}
                            </p>
                        </div>

                        {/* Tombol Close */}
                        <button
                            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                            className="text-zinc-500 hover:text-zinc-300 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast harus digunakan di dalam ToastProvider');
    }
    return context;
};
