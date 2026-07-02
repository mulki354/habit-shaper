import React from 'react';

export interface Habit {
    id: number;
    userId: number;
    name: string;
    type: 'BUILD' | 'BREAK';
    createdAt: string;
    updatedAt: string;
    currentStreak?: number; // Hanya untuk BUILD
    weeklyCompletionRate?: number; // Hanya untuk BUILD (desimal 0 - 1)
    cleanStreak?: number; // Hanya untuk BREAK
}

interface HabitCardProps {
    habit: Habit;
    onActionClick?: (habit: Habit) => void;
    onEditClick?: (habit: Habit) => void;
    onDeleteClick?: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    onActionClick,
    onEditClick,
    onDeleteClick
}) => {
    const isBuild = habit.type === 'BUILD';

    // Konversi weeklyCompletionRate desimal (misal 0.43) ke jumlah hari (misal 3 dari 7 hari)
    const completedDays = isBuild && habit.weeklyCompletionRate !== undefined
        ? Math.round(habit.weeklyCompletionRate * 7)
        : 0;

    return (
        <div className={`relative flex flex-col justify-between p-6 bg-zinc-900 border rounded-2xl shadow-lg transition duration-300 group hover:-translate-y-1 ${isBuild
            ? 'border-zinc-800/80 hover:border-emerald-500/30'
            : 'border-zinc-800/80 hover:border-rose-500/30'
            }`}>
            {/* Bagian Atas: Badge Tipe, Kontrol Edit/Delete & Nama Habit */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${isBuild
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        }`}>
                        {habit.type}
                    </span>

                    {/* Tombol Aksi Kontrol (Edit & Delete) */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditClick?.(habit);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 active:scale-90 rounded-lg transition duration-150"
                            title="Ubah nama habit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.83 20.013a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick?.(habit);
                            }}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-90 rounded-lg transition duration-150"
                            title="Hapus habit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 group-hover:text-zinc-50 transition tracking-tight line-clamp-2">
                    {habit.name}
                </h3>

                <span className="text-xs text-zinc-500 font-medium mt-1 block">
                    Dibuat: {new Date(habit.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
            </div>

            {/* Bagian Tengah: Informasi Streak & Statistik Utama */}
            <div className="my-6 space-y-4">
                <div className="flex items-center gap-3">
                    {/* Visualisasi Angka Streak */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-zinc-50 tracking-tight">
                            {isBuild ? (habit.currentStreak ?? 0) : (habit.cleanStreak ?? 0)}
                        </span>
                        <span className="text-sm font-semibold text-zinc-400">hari</span>
                    </div>

                    {/* Icon Streak sesuai Tipe */}
                    <div className={`flex items-center justify-center p-2 rounded-xl ${isBuild ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {isBuild ? (
                            // Fire icon (BUILD)
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse">
                                <path fillRule="evenodd" d="M12.969 18.943c-2.25.078-4.547-.193-6.685-.796a.75.75 0 11.41-1.444c1.895.539 3.93.78 5.92.71a25.474 25.474 0 005.586-.838.75.75 0 01.49 1.417 26.974 26.974 0 01-5.721.95zM17.472 6.272a.75.75 0 01.99.99 15.352 15.352 0 01-1.92 2.656.75.75 0 11-1.144-.97 13.852 13.852 0 001.69-2.278.75.75 0 01.384-.4z" clipRule="evenodd" />
                                <path d="M11.758 1.148a.75.75 0 00-.707.03C9.178 2.432 8.01 4.582 8.01 6.873c0 2.29.625 4.308 1.637 5.75a.75.75 0 101.242-.843c-.792-1.134-1.28-2.67-1.28-4.907 0-1.748.868-3.418 2.378-4.482a.75.75 0 00-.229-1.243z" />
                                <path d="M16.012 8.875c0-1.48-.352-2.87-.978-4.093a.75.75 0 00-1.325.297c-.366 1.425-.562 2.923-.562 4.462 0 1.242.128 2.453.372 3.624a.75.75 0 001.218.498 7.375 7.375 0 002.275-4.788z" />
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-1.5c-4.694 0-8.5-3.806-8.5-8.5S7.306 3.5 12 3.5s8.5 3.806 8.5 8.5-3.806 8.5-8.5 8.5z" />
                            </svg>
                        ) : (
                            // Sparkles icon (BREAK)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM18 10.5l-.5-3.5-3.5-.5 3.5-.5.5-3.5.5 3.5 3.5.5-3.5.5-.5 3.5zM19 19.5l-.25-1.75-1.75-.25 1.75-.25.25-1.75.25 1.75 1.75.25-1.75.25-.25 1.75z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Sub-informasi (Weekly Rate untuk BUILD atau status bersih untuk BREAK) */}
                {isBuild ? (
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-zinc-400">
                            <span>Kepatuhan Mingguan</span>
                            <span className="text-emerald-400">{completedDays}/7 hari</span>
                        </div>
                        {/* Progress Bar Mini */}
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${(habit.weeklyCompletionRate ?? 0) * 100}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span>Melacak masa bersih dari pantangan</span>
                    </div>
                )}
            </div>

            {/* Bagian Bawah: Aksi Cepat (Tactile Button) */}
            <div className="pt-4 border-t border-zinc-800/60">
                <button
                    onClick={() => onActionClick?.(habit)}
                    className={`w-full py-2.5 px-4 font-semibold text-sm rounded-xl transition duration-200 active:scale-[0.98] ${isBuild
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-zinc-50 hover:shadow-lg hover:shadow-emerald-950/20'
                        : 'bg-zinc-800 hover:bg-zinc-700/80 text-rose-400 border border-zinc-700/50 hover:border-rose-500/30'
                        }`}
                >
                    {isBuild ? 'Tandai Selesai Hari Ini' : 'Saya Relapse Hari Ini'}
                </button>
            </div>
        </div>
    );
};
