"use client";

import { useState, useRef } from "react";

export default function CekilisPage() {
  const [text, setText] = useState("");
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const names = text
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  const draw = () => {
    if (names.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const shuffleCount = 12;
    let i = 0;
    const tick = () => {
      setWinner(names[Math.floor(Math.random() * names.length)]);
      i++;
      if (i < shuffleCount) {
        timeoutRef.current = setTimeout(tick, 60 + i * 15);
      } else {
        const picked = names[Math.floor(Math.random() * names.length)];
        setWinner(picked);
        setAnimKey((k) => k + 1);
        setHistory((h) => [picked, ...h].slice(0, 10));
        setSpinning(false);
      }
    };
    tick();
  };

  return (
    <div className="p-5 pt-10">
      <header className="mb-8">
        <div className="text-4xl mb-2">🎟️</div>
        <h1 className="text-2xl font-bold">Çekiliş</h1>
        <p className="text-white/40 text-sm mt-1">Her satıra bir isim yaz, kazananı çek</p>
      </header>

      {/* Input */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-white/50 uppercase tracking-widest">Katılımcılar</label>
          <span className="text-xs text-white/30">{names.length} kişi</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Ali\nAyşe\nMehmet\nFatma"}
          rows={6}
          className="w-full bg-transparent text-white placeholder:text-white/20 text-sm resize-none outline-none leading-7"
        />
      </div>

      {/* Draw button */}
      <button
        onClick={draw}
        disabled={names.length < 2 || spinning}
        className="w-full py-4 rounded-2xl font-bold text-lg bg-amber-400 text-black disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
      >
        {spinning ? "Çekiliyor..." : "🎯 Çekiliş Yap"}
      </button>

      {/* Winner */}
      {winner && (
        <div
          key={animKey}
          className={`mt-6 bg-amber-400/10 border border-amber-400/30 rounded-2xl p-6 text-center ${
            !spinning ? "animate-bounce-in animate-winner-glow" : ""
          }`}
        >
          {!spinning && <div className="text-4xl mb-2">🏆</div>}
          <div className="text-white/50 text-xs uppercase tracking-widest mb-1">
            {spinning ? "Seçiliyor..." : "Kazanan"}
          </div>
          <div className="text-2xl font-bold text-amber-300">{winner}</div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <div className="text-xs text-white/30 uppercase tracking-widest mb-3">Geçmiş Çekilişler</div>
          <div className="space-y-2">
            {history.map((name, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-2.5"
              >
                <span className="text-white/20 text-xs w-4">{i + 1}</span>
                <span className="text-sm text-white/70">{name}</span>
                {i === 0 && <span className="ml-auto text-xs text-amber-400">son</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
