import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-emerald-500 tracking-tight">
          Habit Shaper
        </h1>

        <p className="text-zinc-400 text-sm max-w-[65ch] leading-relaxed">
          Selamat datang di Habit Shaper! Proyek frontend React + TypeScript + Tailwind CSS v4 berhasil diinisialisasi dan dikonfigurasi.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium rounded-lg transition duration-200 shadow-lg shadow-emerald-950/50"
          >
            Tactile Test Count: {count}
          </button>

          <span className="inline-block px-4 py-1.5 bg-zinc-850 border border-zinc-850 text-zinc-400 font-medium rounded-lg text-xs">
            Tailwind v4 Active &bull; Font Outfit &bull; Docker Ready
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
