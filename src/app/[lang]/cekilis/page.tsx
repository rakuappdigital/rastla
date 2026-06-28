"use client";

import { useState, useRef } from "react";
import LineInput from "@/components/LineInput";
import LotteryJar from "@/components/LotteryJar";
import ResetConfirm from "@/components/ResetConfirm";
import { useDict } from "@/components/LangProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function CekilisPage() {
  const d = useDict();
  const [text, setText, clearText] = useLocalStorage("rastla_cekilis_text", "");
  const [history, setHistory, clearHistory] = useLocalStorage<string[]>("rastla_cekilis_history", []);
  const [winner, setWinner] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const names = text.split("\n").map((n) => n.trim()).filter(Boolean);

  const draw = () => {
    if (names.length < 2 || drawing) return;
    setDrawing(true);
    setWinner(null);
    const end = Date.now() + 1800;
    const tick = () => {
      if (Date.now() < end) {
        timeoutRef.current = setTimeout(tick, 80);
      } else {
        const picked = names[Math.floor(Math.random() * names.length)];
        setWinner(picked);
        setAnimKey((k) => k + 1);
        setHistory((h) => [picked, ...h].slice(0, 10));
        setDrawing(false);
      }
    };
    tick();
  };

  const handleReset = () => {
    clearText();
    clearHistory();
    setWinner(null);
    setShowReset(false);
  };

  return (
    <div className="p-5 pt-8">
      <div className="relative mb-6">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-5xl mb-2">🎟️</div>
            <h1 className="text-2xl font-bold tracking-tight">{d.raffle.title}</h1>
            <p className="text-white/40 text-sm mt-1">{d.raffle.subtitle}</p>
          </div>
          {(names.length > 0 || history.length > 0) && (
            <button
              onClick={() => setShowReset(true)}
              className="mt-1 px-3 py-1.5 rounded-xl text-xs text-white/30 border border-white/[0.06] hover:border-white/15 hover:text-white/50 transition-all"
            >
              {d.common.reset}
            </button>
          )}
        </div>
      </div>

      <LineInput
        value={text}
        onChange={(v) => { setText(v); setWinner(null); }}
        placeholder={d.raffle.placeholder}
        label={d.raffle.label}
        badge={names.length > 0 ? `${names.length} ${d.raffle.people}` : undefined}
      />

      <div className="mt-6">
        <LotteryJar names={names} drawing={drawing} winner={winner} />
      </div>

      <button
        onClick={draw}
        disabled={names.length < 2 || drawing}
        className={`w-full mt-5 py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed ${
          drawing
            ? "bg-amber-400/30 text-amber-200"
            : "bg-gradient-to-b from-amber-300 to-amber-500 text-black shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(251,191,36,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)]"
        }`}
      >
        {drawing ? d.raffle.drawing : d.raffle.drawBtn}
      </button>

      {names.length < 2 && text.length > 0 && (
        <p className="text-center text-xs text-white/25 mt-2">{d.raffle.minWarning}</p>
      )}

      {winner && !drawing && (
        <div
          key={animKey}
          className="mt-6 rounded-2xl p-6 text-center animate-bounce-in animate-winner-glow"
          style={{
            background: "radial-gradient(ellipse at top, rgba(251,191,36,0.15), rgba(251,191,36,0.04))",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1">{d.raffle.winner}</div>
          <div className="text-3xl font-bold text-amber-300">{winner}</div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6">
          <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mb-3">{d.raffle.history}</div>
          <div className="space-y-1.5">
            {history.map((name, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-2.5 bg-white/[0.03] border border-white/[0.04]">
                <span className="text-white/20 text-xs w-4 tabular-nums">{i + 1}</span>
                <span className="text-sm text-white/65">{name}</span>
                {i === 0 && <span className="ml-auto text-[10px] text-amber-400 font-semibold uppercase tracking-wide">{d.raffle.last}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showReset && (
        <ResetConfirm
          title={d.common.resetTitle}
          message={d.common.resetMsg}
          cancelLabel={d.common.cancel}
          confirmLabel={d.common.confirmReset}
          onConfirm={handleReset}
          onCancel={() => setShowReset(false)}
        />
      )}
    </div>
  );
}
