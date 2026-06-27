"use client";

import { useState } from "react";

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

function Die({ value, shaking }: { value: number; shaking: boolean }) {
  return (
    <div
      className={`relative w-20 h-20 rounded-2xl bg-white shadow-lg ${
        shaking ? "animate-shake" : ""
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {DOT_POSITIONS[value].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={9} fill="#1a1a2e" />
        ))}
      </svg>
    </div>
  );
}

export default function ZarPage() {
  const [diceCount, setDiceCount] = useState(2);
  const [values, setValues] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const roll = () => {
    if (shaking) return;
    setShaking(true);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      const rolled = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
      setValues(rolled);
      setShaking(false);
    }, 650);
  };

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="p-5 pt-10">
      <header className="mb-8">
        <div className="text-4xl mb-2">🎲</div>
        <h1 className="text-2xl font-bold">Zar</h1>
        <p className="text-white/40 text-sm mt-1">Kaç zar atıyorsun?</p>
      </header>

      {/* Dice count selector */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-6">
        <div className="text-xs text-white/50 uppercase tracking-widest mb-4">Zar Sayısı</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => { setDiceCount(n); setValues([]); }}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${
                diceCount === n
                  ? "bg-red-500 text-white"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Dice display */}
      <div className="flex justify-center gap-4 mb-8 min-h-24 items-center">
        {values.length === 0 ? (
          Array.from({ length: diceCount }).map((_, i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-2xl border-2 border-white/10 border-dashed flex items-center justify-center"
            >
              <span className="text-white/20 text-2xl">?</span>
            </div>
          ))
        ) : (
          values.map((v, i) => (
            <Die key={`${animKey}-${i}`} value={v} shaking={shaking} />
          ))
        )}
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={shaking}
        className="w-full py-4 rounded-2xl font-bold text-lg bg-red-500 text-white disabled:opacity-50 active:scale-95 transition-all"
      >
        {shaking ? "Atılıyor..." : "🎲 Zar At"}
      </button>

      {/* Total */}
      {values.length > 0 && !shaking && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center animate-bounce-in">
          <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
            {diceCount > 1 ? "Toplam" : "Sonuç"}
          </div>
          <div className="text-4xl font-bold text-red-300">{total}</div>
          {diceCount > 1 && (
            <div className="text-white/30 text-sm mt-1">
              {values.join(" + ")} = {total}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
