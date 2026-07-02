import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContent';
import { api } from '../lib/api';
import { HabitCard, type Habit } from '../components/HabitCard';
import { HabitModal } from '../components/HabitModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ConfirmRelapseModal } from '../components/ConfirmRelapseModal';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State untuk kontrol Modal CRUD & Aksi
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isRelapseOpen, setIsRelapseOpen] = useState<boolean>(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.get<Habit[]>('/habits');
            setHabits(data);
        } catch (err: any) {
            console.error('Gagal mengambil data habit:', err);
            setError(err.message || 'Terjadi kesalahan saat memuat data kebiasaan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // Handler untuk aksi cepat harian
    const handleActionClick = async (habit: Habit) => {
        if (habit.type === 'BUILD') {
            try {
                setError(null);
                // POST /habits/:id/complete (tanpa body, default hari ini di backend)
                await api.post(`/habits/${habit.id}/complete`, {});
                fetchHabits();
            } catch (err: any) {
                console.error('Gagal menandai selesai:', err);
                setError(err.message || 'Terjadi kesalahan saat menandai kebiasaan selesai.');
            }
        } else {
            // Tipe BREAK: Butuh konfirmasi lewat modal sebelum mencatat relapse
            setSelectedHabit(habit);
            setIsRelapseOpen(true);
        }
    };

    // Handler untuk membuka modal tambah habit baru
    const handleAddClick = () => {
        setSelectedHabit(null);
        setIsModalOpen(true);
    };

    // Handler untuk membuka modal ubah habit
    const handleEditClick = (habit: Habit) => {
        setSelectedHabit(habit);
        setIsModalOpen(true);
    };

    // Handler untuk membuka modal konfirmasi hapus
    const handleDeleteClick = (habit: Habit) => {
        setSelectedHabit(habit);
        setIsDeleteOpen(true);
    };

    // Handler eksekusi penghapusan dari modal konfirmasi
    const handleDeleteConfirm = async () => {
        if (!selectedHabit) return;
        // Endpoint hapus: DELETE /habits/:id
        await api.delete(`/habits/${selectedHabit.id}`);
        fetchHabits();
    };

    // Handler eksekusi relapse dari modal konfirmasi
    const handleRelapseConfirm = async () => {
        if (!selectedHabit) return;
        // Endpoint relapse: POST /habits/:id/relapse
        await api.post(`/habits/${selectedHabit.id}/relapse`, {});
        fetchHabits();
    };

    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 px-4 py-8 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-800/80">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-zinc-50 tracking-tight">Habit Shaper</h1>
                        <p className="text-sm text-zinc-400">
                            Masuk sebagai: <span className="font-semibold text-zinc-300">{user?.email}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleAddClick}
                            className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-zinc-50 font-bold rounded-xl text-sm transition duration-150 shadow-lg shadow-emerald-950/20"
                        >
                            + Tambah Habit Baru
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 text-zinc-300 font-semibold rounded-xl text-sm transition duration-150"
                        >
                            Keluar Sesi
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main>
                    {loading ? (
                        /* Skeleton Loader State */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6 animate-pulse">
                                    <div className="flex justify-between items-center">
                                        <div className="h-5 w-16 bg-zinc-800 rounded-full" />
                                        <div className="h-4 w-24 bg-zinc-800 rounded" />
                                    </div>
                                    <div className="h-6 w-3/4 bg-zinc-800 rounded" />
                                    <div className="space-y-2">
                                        <div className="h-10 w-24 bg-zinc-800 rounded-lg" />
                                        <div className="h-3 w-full bg-zinc-800 rounded" />
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800/60">
                                        <div className="h-10 w-full bg-zinc-800 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        /* Error Alert State */
                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center space-y-4">
                            <svg className="w-12 h-12 text-rose-400 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <h3 className="text-lg font-bold text-rose-400">Gagal Memuat Data</h3>
                            <p className="text-zinc-400 text-sm max-w-md mx-auto">{error}</p>
                            <button
                                onClick={fetchHabits}
                                className="px-4 py-2 bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 font-semibold rounded-xl text-sm transition"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : habits.length === 0 ? (
                        /* Empty State */
                        <div className="p-12 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl text-center space-y-6 max-w-xl mx-auto">
                            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 12.408l1.5-1.5 3 3 7-7" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-zinc-100 tracking-tight">Belum Ada Habit Terdaftar</h3>
                                <p className="text-zinc-400 text-sm max-w-sm mx-auto">
                                    Mulai petualangan perbaikan dirimu dengan membuat target habit pertamamu hari ini!
                                </p>
                            </div>
                            <button
                                onClick={handleAddClick}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-50 font-bold rounded-xl text-sm transition duration-150 shadow-lg shadow-emerald-950/20"
                            >
                                + Mulai Sekarang
                            </button>
                        </div>
                    ) : (
                        /* Habit List Grid State */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onActionClick={handleActionClick}
                                    onEditClick={handleEditClick}
                                    onDeleteClick={handleDeleteClick}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Form: Tambah / Edit Habit */}
            <HabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchHabits}
                habit={selectedHabit}
            />

            {/* Modal Konfirmasi Hapus */}
            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                habitName={selectedHabit?.name || ''}
            />

            {/* Modal Konfirmasi Relapse */}
            <ConfirmRelapseModal
                isOpen={isRelapseOpen}
                onClose={() => setIsRelapseOpen(false)}
                onConfirm={handleRelapseConfirm}
                habitName={selectedHabit?.name || ''}
            />
        </div>
    );
};
