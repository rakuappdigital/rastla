"use client";

import { useState, useRef, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

function Die({ value, shaking }: { value: number; shaking: boolean }) {
  return (
    <div
      className={`relative rounded-2xl shadow-xl overflow-hidden transition-transform ${
        shaking ? "animate-shake" : "animate-bounce-in"
      }`}
      style={{
        width: 80,
        height: 80,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        boxShadow: "0 8px 0 rgba(0,0,0,0.25), 0 12px 20px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.8)",
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {DOT_POSITIONS[value].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={9} fill="#1e293b" />
        ))}
      </svg>
    </div>
  );
}

function DiePlaceholder() {
  return (
    <div
      className="rounded-2xl flex items-center justify-center"
      style={{
        width: 80,
        height: 80,
        background: "rgba(255,255,255,0.04)",
        border: "2px dashed rgba(255,255,255,0.1)",
      }}
    >
      <span className="text-white/20 text-2xl font-light">?</span>
    </div>
  );
}

export default function ZarPage() {
  const [diceCount, setDiceCount] = useLocalStorage("rastla_zar_count", 2);
  const [finalValues, setFinalValues] = useState<number[]>([]);
  const [displayValues, setDisplayValues] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear dice only when count changes
  useEffect(() => {
    setFinalValues([]);
    setDisplayValues([]);
  }, [diceCount]);

  const roll = () => {
    if (shaking) return;
    setShaking(true);
    setAnimKey((k) => k + 1);

    // Immediately show random dice
    const randomize = () =>
      Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);

    setDisplayValues(randomize());
    intervalRef.current = setInterval(() => {
      setDisplayValues(randomize());
    }, 80);

    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const final = randomize();
      setFinalValues(final);
      setDisplayValues(final);
      setShaking(false);
    }, 700);
  };

  const total = finalValues.reduce((a, b) => a + b, 0);
  const showDisplay = displayValues.length > 0;

  return (
    <div className="p-5 pt-8">
      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-5xl mb-2">🎲</div>
          <h1 className="text-2xl font-bold tracking-tight">Zar</h1>
          <p className="text-white/40 text-sm mt-1">Kaç zar atıyorsun?</p>
        </div>
      </div>

      {/* Dice count */}
      <div
        className="rounded-2xl p-4 mb-8"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-3">
          Zar Sayısı
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setDiceCount(n)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                diceCount === n
                  ? "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_20px_rgba(239,68,68,0.3)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)]"
                  : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Dice display */}
      <div className="flex justify-center gap-4 mb-8 min-h-[88px] items-center">
        {showDisplay
          ? displayValues.map((v, i) => (
              <Die key={`${animKey}-${i}`} value={v} shaking={shaking} />
            ))
          : Array.from({ length: diceCount }).map((_, i) => (
              <DiePlaceholder key={i} />
            ))}
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={shaking}
        className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-50 ${
          shaking
            ? "bg-red-500/30 text-red-200"
            : "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(239,68,68,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}
      >
        {shaking ? "Atılıyor…" : "🎲 Zar At"}
      </button>

      {/* Result */}
      {finalValues.length > 0 && !shaking && (
        <div
          className="mt-6 rounded-2xl p-5 text-center animate-bounce-in"
          style={{
            background: "radial-gradient(ellipse at top, rgba(239,68,68,0.15), rgba(239,68,68,0.04))",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">
            {diceCount > 1 ? "Toplam" : "Sonuç"}
          </div>
          <div className="text-5xl font-black text-red-300 tabular-nums">{total}</div>
          {diceCount > 1 && (
            <div className="text-white/25 text-sm mt-2 tabular-nums">
              {finalValues.join(" + ")} = {total}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
