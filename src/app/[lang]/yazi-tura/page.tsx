"use client";

import { useState } from "react";
import Image from "next/image";
import { useDict } from "@/components/LangProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ResetConfirm from "@/components/ResetConfirm";

type Side = "heads" | "tails";

const DURATION = 1400;

// Yüz komponenti — filter OLMADAN, sadece backfaceVisibility
function CoinFace({ side }: { side: Side }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        // Tails yüzü başlangıçta arkaya dönük
        transform: side === "tails" ? "rotateY(180deg)" : undefined,
      }}
    >
      <Image
        src={`/images/coin-${side === "heads" ? "h" : "t"}.png`}
        alt={side}
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

export default function YaziTuraPage() {
  const d = useDict();
  const [counts, setCounts, clearCounts] = useLocalStorage<Record<Side, number>>(
    "rastla_coin_counts", { heads: 0, tails: 0 }
  );
  const [result,    setResult]    = useState<Side | null>(null);
  const [pending,   setPending]   = useState<Side | null>(null);
  const [flipping,  setFlipping]  = useState(false);
  const [animKey,   setAnimKey]   = useState(0);
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
    }, DURATION);
  };

  const handleReset = () => {
    clearCounts(); setResult(null); setPending(null); setShowReset(false);
  };

  // Sonuca göre animasyon adı; önceden hesaplanıyor
  const animName = pending === "tails" ? "coin-flip-tura" : "coin-flip-yazi";

  // Animasyon bittikten sonra statik durum
  const staticTransform =
    !flipping && result === "tails" ? "rotateY(180deg)" : "rotateY(0deg)";

  const resultLabel =
    result === "heads" ? d.coin.heads : result === "tails" ? d.coin.tails : null;

  return (
    <div className="p-5 pt-8">

      {/* Header */}
      <div className="relative mb-8">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-5xl mb-2">🪙</div>
            <h1 className="text-2xl font-bold tracking-tight">{d.coin.title}</h1>
            <p className="text-white/40 text-sm mt-1">{d.coin.subtitle}</p>
          </div>
          {total > 0 && (
            <button
              onClick={() => setShowReset(true)}
              className="mt-1 px-3 py-1.5 rounded-xl text-xs text-white/30 border border-white/[0.06] hover:border-white/15 hover:text-white/50 transition-all"
            >
              {d.common.reset}
            </button>
          )}
        </div>
      </div>

      {/* Coin */}
      <div className="flex justify-center">
        {/*
          Katmanlar (dıştan içe):
          1. perspective wrapper — perspektif verir
          2. glow div — boxShadow ile, 3D context DIŞINDA
          3. preserve-3d container — hiç filter yok
          4. CoinFace ×2 — backfaceVisibility: hidden, filter yok
        */}
        <div style={{ perspective: "700px", position: "relative", width: 220, height: 220 }}>

          {/* Glow — 3D context dışında, boxShadow güvenli */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
            style={{
              boxShadow: flipping
                ? "0 0 70px rgba(234,179,8,0.55), 0 20px 40px rgba(180,83,9,0.4)"
                : "0 0 30px rgba(234,179,8,0.2), 0 12px 24px rgba(0,0,0,0.4)",
            }}
          />

          {/* 3D container — filter OLMADAN */}
          <div
            key={animKey}
            style={{
              width: 220,
              height: 220,
              position: "relative",
              transformStyle: "preserve-3d",
              animation: flipping
                ? `${animName} ${DURATION}ms cubic-bezier(0.4,0,0.2,1) forwards`
                : "none",
              transform: flipping ? undefined : staticTransform,
              transition: flipping ? "none" : "transform 0.3s ease",
            }}
          >
            <CoinFace side="heads" />
            <CoinFace side="tails" />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 text-center min-h-8">
        {!flipping && resultLabel ? (
          <div className="animate-slide-up">
            <div className="text-white/35 text-[10px] uppercase tracking-[0.2em] mb-0.5">
              {d.coin.resultLabel}
            </div>
            <div className="text-2xl font-black text-yellow-300 tracking-widest uppercase">
              {resultLabel}
            </div>
          </div>
        ) : flipping ? (
          <div className="text-white/30 text-sm animate-pulse-scale">{d.coin.flipping}</div>
        ) : null}
      </div>

      {/* Flip button */}
      <button
        onClick={flip}
        disabled={flipping}
        className={`w-full mt-5 py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-40 ${
          flipping
            ? "bg-yellow-400/20 text-yellow-200"
            : "bg-gradient-to-b from-yellow-300 to-yellow-500 text-black shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(234,179,8,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}
      >
        {d.coin.flip}
      </button>

      {/* Stats */}
      {total > 0 && (
        <div className="mt-6 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mb-4">
            {d.coin.statsLabel} — {total} {d.coin.flipsUnit}
          </div>

          <div className="flex gap-3 mb-4">
            {(["heads", "tails"] as const).map((side) => (
              <div key={side} className="flex-1 rounded-xl p-3 text-center transition-all"
                style={{
                  background: result === side ? "rgba(234,179,8,0.08)" : "rgba(255,255,255,0.03)",
                  border: result === side ? "1px solid rgba(234,179,8,0.25)" : "1px solid rgba(255,255,255,0.05)",
                }}>
                <div className="relative w-10 h-10 mx-auto mb-2">
                  <Image src={`/images/coin-${side === "heads" ? "h" : "t"}.png`} alt={side} fill className="object-contain" />
                </div>
                <div className="text-xl font-black tabular-nums">{counts[side]}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-wide mt-0.5">
                  {side === "heads" ? d.coin.heads : d.coin.tails}
                </div>
                <div className="text-xs text-yellow-400 font-semibold mt-1 tabular-nums">
                  {total > 0 ? Math.round((counts[side] / total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>

          <div className="h-2 rounded-full overflow-hidden bg-white/[0.06]">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${total > 0 ? (counts.heads / total) * 100 : 50}%`, background: "linear-gradient(90deg,#fde047,#eab308)" }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/25">{d.coin.heads}</span>
            <span className="text-[10px] text-white/25">{d.coin.tails}</span>
          </div>
        </div>
      )}

      {showReset && (
        <ResetConfirm title={d.common.resetTitle} message={d.common.resetMsg}
          cancelLabel={d.common.cancel} confirmLabel={d.common.confirmReset}
          onConfirm={handleReset} onCancel={() => setShowReset(false)} />
      )}
    </div>
  );
}
