"use client";

import { useState } from "react";
import { useDict } from "@/components/LangProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ResetConfirm from "@/components/ResetConfirm";

type Side = "heads" | "tails";

function CoinFace({ side, headsLabel, tailsLabel }: { side: Side; headsLabel: string; tailsLabel: string }) {
  const isHeads = side === "heads";
  return (
    <div
      className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: isHeads ? undefined : "rotateY(180deg)",
        background: "radial-gradient(circle at 33% 30%, #fef9c3, #eab308 48%, #92400e 100%)",
        border: "8px solid #b45309",
        boxShadow: "inset 0 3px 10px rgba(255,255,200,0.45), inset 0 -3px 6px rgba(0,0,0,0.2), 0 6px 24px rgba(234,179,8,0.4)",
      }}
    >
      <div className="absolute inset-[6px] rounded-full" style={{ border: "1.5px solid rgba(180,83,9,0.4)" }} />
      {isHeads ? (
        <>
          <svg viewBox="0 0 60 60" width="62" height="62" className="relative z-10">
            <ellipse cx="30" cy="24" rx="13" ry="14" fill="rgba(0,0,0,0.30)" />
            <ellipse cx="30" cy="52" rx="18" ry="12" fill="rgba(0,0,0,0.25)" />
          </svg>
          <span className="relative z-10 text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "rgba(0,0,0,0.45)", marginTop: -6 }}>
            {headsLabel}
          </span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 60 60" width="62" height="62" className="relative z-10">
            <polygon points="30,5 36,22 54,22 40,33 45,50 30,40 15,50 20,33 6,22 24,22" fill="rgba(0,0,0,0.28)" />
          </svg>
          <span className="relative z-10 text-[10px] font-black tracking-[0.25em] uppercase" style={{ color: "rgba(0,0,0,0.45)", marginTop: -6 }}>
            {tailsLabel}
          </span>
        </>
      )}
    </div>
  );
}

export default function YaziTuraPage() {
  const d = useDict();
  const [counts, setCounts, clearCounts] = useLocalStorage<Record<Side, number>>(
    "rastla_coin_counts", { heads: 0, tails: 0 }
  );
  const [result, setResult] = useState<Side | null>(null);
  const [pending, setPending] = useState<Side | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const total = counts.heads + counts.tails;

  const flip = () => {
    if (flipping) return;
    const landed: Side = Math.random() < 0.5 ? "heads" : "tails";
    setPending(landed);
    setFlipping(true);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      setResult(landed);
      setCounts((c) => ({ ...c, [landed]: c[landed] + 1 }));
      setFlipping(false);
    }, 1100);
  };

  const handleReset = () => { clearCounts(); setResult(null); setPending(null); setShowReset(false); };

  const animName = pending === "tails" ? "coin-flip-tura" : "coin-flip-yazi";
  const staticTransform = !flipping && result === "tails" ? "rotateY(180deg)" : "rotateY(0deg)";

  const resultLabel = result === "heads" ? d.coin.heads : result === "tails" ? d.coin.tails : null;

  return (
    <div className="p-5 pt-8">
      <div className="relative mb-8">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-5xl mb-2">🪙</div>
            <h1 className="text-2xl font-bold tracking-tight">{d.coin.title}</h1>
            <p className="text-white/40 text-sm mt-1">{d.coin.subtitle}</p>
          </div>
          {total > 0 && (
            <button onClick={() => setShowReset(true)} className="mt-1 px-3 py-1.5 rounded-xl text-xs text-white/30 border border-white/[0.06] hover:border-white/15 hover:text-white/50 transition-all">
              {d.common.reset}
            </button>
          )}
        </div>
      </div>

      {/* 3D Coin */}
      <div className="flex justify-center" style={{ perspective: "700px" }}>
        <div
          key={animKey}
          style={{
            width: 180, height: 180, position: "relative",
            transformStyle: "preserve-3d",
            animation: flipping ? `${animName} 1.1s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
            transform: flipping ? undefined : staticTransform,
            transition: flipping ? "none" : "transform 0.4s ease",
            filter: "drop-shadow(0 16px 32px rgba(234,179,8,0.3))",
          }}
        >
          <CoinFace side="heads" headsLabel={d.coin.heads} tailsLabel={d.coin.tails} />
          <CoinFace side="tails" headsLabel={d.coin.heads} tailsLabel={d.coin.tails} />
        </div>
      </div>

      <div className="mt-5 text-center min-h-8">
        {!flipping && resultLabel && (
          <div className="animate-slide-up">
            <div className="text-white/35 text-[10px] uppercase tracking-[0.2em] mb-0.5">{d.coin.resultLabel}</div>
            <div className="text-2xl font-black text-yellow-300 tracking-widest uppercase">{resultLabel}</div>
          </div>
        )}
        {flipping && <div className="text-white/30 text-sm animate-pulse-scale">{d.coin.flipping}</div>}
      </div>

      <button onClick={flip} disabled={flipping}
        className={`w-full mt-6 py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-40 ${
          flipping
            ? "bg-yellow-400/20 text-yellow-200"
            : "bg-gradient-to-b from-yellow-300 to-yellow-500 text-black shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(234,179,8,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}
      >
        {d.coin.flip}
      </button>

      {total > 0 && (
        <div className="mt-6 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mb-4">
            {d.coin.statsLabel} — {total} {d.coin.flipsUnit}
          </div>
          <div className="flex gap-3 mb-4">
            {(["heads", "tails"] as const).map((side) => (
              <div key={side} className={`flex-1 rounded-xl p-3 text-center transition-all ${result === side ? "bg-yellow-400/10 border border-yellow-400/25" : "bg-white/[0.03] border border-white/[0.05]"}`}>
                <div className="text-2xl mb-1.5">{side === "heads" ? "👤" : "⭐"}</div>
                <div className="text-xl font-black tabular-nums">{counts[side]}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-wide mt-0.5">{side === "heads" ? d.coin.heads : d.coin.tails}</div>
                <div className="text-xs text-yellow-400 font-semibold mt-1 tabular-nums">{total > 0 ? Math.round((counts[side] / total) * 100) : 0}%</div>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/[0.06]">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${total > 0 ? (counts.heads / total) * 100 : 50}%`, background: "linear-gradient(90deg, #fde047, #eab308)" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/25">{d.coin.heads}</span>
            <span className="text-[10px] text-white/25">{d.coin.tails}</span>
          </div>
        </div>
      )}

      {showReset && (
        <ResetConfirm title={d.common.resetTitle} message={d.common.resetMsg} cancelLabel={d.common.cancel} confirmLabel={d.common.confirmReset} onConfirm={handleReset} onCancel={() => setShowReset(false)} />
      )}
    </div>
  );
}
