"use client";

import { useState } from "react";
import SpinWheel from "@/components/SpinWheel";

export default function CarkPage() {
  const [input, setInput] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const items = input
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleResult = (w: string) => {
    setWinner(w);
    setAnimKey((k) => k + 1);
  };

  return (
    <div className="p-5 pt-10">
      <header className="mb-6">
        <div className="text-4xl mb-2">🎡</div>
        <h1 className="text-2xl font-bold">Çark</h1>
        <p className="text-white/40 text-sm mt-1">İsimleri ekle, çarkı çevir</p>
      </header>

      {/* Input */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-white/50 uppercase tracking-widest">Seçenekler</label>
          <span className="text-xs text-white/30">{items.length} dilim</span>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"Ali\nAyşe\nMehmet\nFatma"}
          rows={4}
          className="w-full bg-transparent text-white placeholder:text-white/20 text-sm resize-none outline-none leading-7"
        />
      </div>

      {/* Wheel */}
      {items.length >= 2 ? (
        <SpinWheel items={items} onResult={handleResult} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-10 text-white/20">
          <div className="text-5xl animate-float">🎡</div>
          <p className="text-sm">En az 2 seçenek gir</p>
        </div>
      )}

      {/* Winner */}
      {winner && (
        <div
          key={animKey}
          className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 text-center animate-bounce-in"
        >
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Kazanan</div>
          <div className="text-2xl font-bold text-purple-300">{winner}</div>
        </div>
      )}
    </div>
  );
}
