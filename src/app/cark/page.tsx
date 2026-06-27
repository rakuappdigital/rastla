"use client";

import { useState } from "react";
import SpinWheel from "@/components/SpinWheel";
import LineInput from "@/components/LineInput";
import ResetConfirm from "@/components/ResetConfirm";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function CarkPage() {
  const [input, setInput, clearInput] = useLocalStorage("rastla_cark_input", "");
  const [winner, setWinner] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const items = input.split("\n").map((s) => s.trim()).filter(Boolean);

  const handleResult = (w: string) => {
    setWinner(w);
    setAnimKey((k) => k + 1);
  };

  const handleReset = () => {
    clearInput();
    setWinner(null);
    setShowReset(false);
  };

  return (
    <div className="p-5 pt-8">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-5xl mb-2">🎡</div>
            <h1 className="text-2xl font-bold tracking-tight">Çark</h1>
            <p className="text-white/40 text-sm mt-1">Seçenekleri yaz, çarkı döndür</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => setShowReset(true)}
              className="mt-1 px-3 py-1.5 rounded-xl text-xs text-white/30 border border-white/[0.06] hover:border-white/15 hover:text-white/50 transition-all"
            >
              Sıfırla
            </button>
          )}
        </div>
      </div>

      {/* Input */}
      <LineInput
        value={input}
        onChange={(v) => { setInput(v); setWinner(null); }}
        placeholder={"Ali\nAyşe\nMehmet\nFatma"}
        label="Seçenekler"
        badge={items.length > 0 ? `${items.length} dilim` : undefined}
        rows={4}
      />

      {/* Wheel */}
      <div className="mt-6">
        {items.length >= 2 ? (
          <SpinWheel items={items} onResult={handleResult} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-white/20">
            <div className="text-6xl animate-float">🎡</div>
            <p className="text-sm">En az 2 seçenek gir</p>
          </div>
        )}
      </div>

      {/* Winner */}
      {winner && (
        <div
          key={animKey}
          className="mt-6 rounded-2xl p-6 text-center animate-bounce-in"
          style={{
            background: "radial-gradient(ellipse at top, rgba(168,85,247,0.18), rgba(168,85,247,0.04))",
            border: "1px solid rgba(168,85,247,0.35)",
            boxShadow: "0 0 40px rgba(168,85,247,0.15)",
          }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">Kazanan</div>
          <div className="text-3xl font-bold text-purple-300">{winner}</div>
        </div>
      )}

      {showReset && (
        <ResetConfirm onConfirm={handleReset} onCancel={() => setShowReset(false)} />
      )}
    </div>
  );
}
