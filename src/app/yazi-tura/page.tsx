"use client";

import { useState } from "react";

export default function YaziTuraPage() {
  const [result, setResult] = useState<"yazı" | "tura" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [counts, setCounts] = useState({ yazı: 0, tura: 0 });

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      const landed = Math.random() < 0.5 ? "yazı" : "tura";
      setResult(landed);
      setCounts((c) => ({ ...c, [landed]: c[landed] + 1 }));
      setFlipping(false);
    }, 1000);
  };

  const total = counts.yazı + counts.tura;

  return (
    <div className="p-5 pt-10">
      <header className="mb-8">
        <div className="text-4xl mb-2">🪙</div>
        <h1 className="text-2xl font-bold">Yazı / Tura</h1>
        <p className="text-white/40 text-sm mt-1">Madeni parayı fırlat</p>
      </header>

      {/* Coin */}
      <div className="flex justify-center mb-8" style={{ perspective: "600px" }}>
        <div
          key={animKey}
          className={`w-40 h-40 rounded-full flex items-center justify-center text-7xl select-none shadow-2xl border-4 ${
            flipping
              ? "animate-flip-coin border-yellow-400/50"
              : result
              ? "border-yellow-400/60 animate-bounce-in"
              : "border-yellow-400/20"
          }`}
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #fef08a, #ca8a04 60%, #78350f)",
          }}
        >
          {flipping ? "🪙" : result === "yazı" ? "👤" : result === "tura" ? "⭐" : "🪙"}
        </div>
      </div>

      {/* Result label */}
      {result && !flipping && (
        <div className="text-center mb-6 animate-slide-up">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Sonuç</div>
          <div className="text-3xl font-bold text-yellow-300 capitalize">{result.toUpperCase()}</div>
        </div>
      )}

      {/* Flip button */}
      <button
        onClick={flip}
        disabled={flipping}
        className="w-full py-4 rounded-2xl font-bold text-lg bg-yellow-400 text-black disabled:opacity-40 active:scale-95 transition-all"
      >
        {flipping ? "Uçuyor..." : "🪙 Fırlat!"}
      </button>

      {/* Stats */}
      {total > 0 && (
        <div className="mt-6 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
          <div className="text-xs text-white/30 uppercase tracking-widest mb-3">İstatistik — {total} atış</div>
          <div className="flex gap-3">
            {(["yazı", "tura"] as const).map((side) => (
              <div key={side} className="flex-1 bg-white/[0.04] rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{side === "yazı" ? "👤" : "⭐"}</div>
                <div className="text-xl font-bold">{counts[side]}</div>
                <div className="text-xs text-white/40 capitalize">{side}</div>
                <div className="text-xs text-yellow-400 mt-1">
                  {total > 0 ? Math.round((counts[side] / total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(counts.yazı / total) * 100}%` : "50%" }}
            />
          </div>
        </div>
      )}

      {/* Reset */}
      {total > 0 && (
        <button
          onClick={() => { setCounts({ yazı: 0, tura: 0 }); setResult(null); }}
          className="mt-3 w-full py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          Sıfırla
        </button>
      )}
    </div>
  );
}
