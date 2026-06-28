"use client";

import { useState, useRef, useEffect } from "react";
import { useDict } from "@/components/LangProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ── Dot positions ────────────────────────────────────────────────────────────
const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

function Die({ value, shaking, size = 80 }: { value: number; shaking: boolean; size?: number }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex-shrink-0 ${shaking ? "animate-shake" : "animate-bounce-in"}`}
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        boxShadow: "0 6px 0 rgba(0,0,0,0.25), 0 10px 18px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.8)",
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {DOTS[value].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={9} fill="#1e293b" />
        ))}
      </svg>
    </div>
  );
}

function DicePlaceholder({ size = 80 }: { size?: number }) {
  return (
    <div className="rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.1)" }}>
      <span className="text-white/20 font-light" style={{ fontSize: size * 0.3 }}>?</span>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────
type Phase = "idle" | "p1done" | "p2done";

// ── Main page ────────────────────────────────────────────────────────────────
export default function ZarPage() {
  const d = useDict();

  // Responsive die size
  const [screenW, setScreenW] = useState(375);
  useEffect(() => {
    setScreenW(window.innerWidth);
  }, []);

  // Persistent settings
  const [diceCount, setDiceCount] = useLocalStorage("rastla_zar_count", 2);
  const [playerMode, setPlayerMode] = useLocalStorage<1 | 2>("rastla_zar_players", 1);
  const [p1name, setP1name] = useLocalStorage("rastla_zar_p1", "");
  const [p2name, setP2name] = useLocalStorage("rastla_zar_p2", "");

  // Game state (resets each round)
  const [phase, setPhase] = useState<Phase>("idle");
  const [p1Roll, setP1Roll] = useState<number[]>([]);
  const [p2Roll, setP2Roll] = useState<number[]>([]);
  const [display, setDisplay] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset game when settings change
  useEffect(() => { resetGame(); }, [diceCount, playerMode]);

  function resetGame() {
    setPhase("idle");
    setP1Roll([]);
    setP2Roll([]);
    setDisplay([]);
    setShaking(false);
  }

  const randomize = () =>
    Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);

  function doRoll(onDone: (vals: number[]) => void) {
    if (shaking) return;
    setShaking(true);
    setAnimKey((k) => k + 1);
    setDisplay(randomize());
    intervalRef.current = setInterval(() => setDisplay(randomize()), 80);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const final = randomize();
      setDisplay(final);
      setShaking(false);
      onDone(final);
    }, 700);
  }

  const rollP1 = () =>
    doRoll((vals) => {
      setP1Roll(vals);
      if (playerMode === 1) setPhase("p2done"); // solo: done immediately
      else setPhase("p1done");
    });

  const rollP2 = () =>
    doRoll((vals) => {
      setP2Roll(vals);
      setPhase("p2done");
    });

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  const p1total = sum(p1Roll);
  const p2total = sum(p2Roll);
  const winner =
    phase === "p2done" && playerMode === 2
      ? p1total > p2total
        ? (p1name || d.dice.p1placeholder)
        : p1total < p2total
        ? (p2name || d.dice.p2placeholder)
        : null
      : null;

  const isDone = phase === "p2done";
  const namesOk = playerMode === 1 || (p1name.trim().length > 0 && p2name.trim().length > 0);

  // Responsive die size — ekrana sığsın
  const contentW = Math.min(screenW, 448) - 40;
  const DIE_SIZE = playerMode === 2
    ? Math.floor(Math.min(62, (contentW / 2 - 40) / diceCount))
    : Math.floor(Math.min(80, (contentW - (diceCount - 1) * 12) / diceCount));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-5 pt-8">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-5xl mb-2">🎲</div>
          <h1 className="text-2xl font-bold tracking-tight">{d.dice.title}</h1>
          <p className="text-white/40 text-sm mt-1">{d.dice.subtitle}</p>
        </div>
      </div>

      {/* Settings card */}
      <div className="rounded-2xl p-4 mb-5 space-y-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Player mode */}
        <div>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-2">
            {d.dice.playersLabel}
          </div>
          <div className="flex gap-2">
            {([1, 2] as const).map((n) => (
              <button key={n} onClick={() => setPlayerMode(n)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  playerMode === n
                    ? "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_3px_0_rgba(0,0,0,0.3),0_0_16px_rgba(239,68,68,0.25)]"
                    : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
                }`}>
                {n === 1 ? d.dice.solo : d.dice.versus}
              </button>
            ))}
          </div>
        </div>

        {/* Name inputs — 2-player only */}
        {playerMode === 2 && (
          <div className="flex gap-2">
            <input
              value={p1name}
              onChange={(e) => { setP1name(e.target.value); resetGame(); }}
              placeholder={d.dice.p1placeholder}
              maxLength={16}
              className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-red-500/50 transition-colors"
            />
            <input
              value={p2name}
              onChange={(e) => { setP2name(e.target.value); resetGame(); }}
              placeholder={d.dice.p2placeholder}
              maxLength={16}
              className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        )}

        {/* Dice count */}
        <div>
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-2">
            {d.dice.countLabel}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button key={n} onClick={() => setDiceCount(n)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                  diceCount === n
                    ? "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_3px_0_rgba(0,0,0,0.3)]"
                    : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 1-PLAYER MODE ─────────────────────────────────────────────────── */}
      {playerMode === 1 && (
        <>
          <div className="flex justify-center gap-3 mb-6 min-h-[88px] items-center flex-wrap">
            {display.length > 0
              ? display.map((v, i) => <Die key={`${animKey}-${i}`} value={v} shaking={shaking} />)
              : Array.from({ length: diceCount }).map((_, i) => <DicePlaceholder key={i} />)
            }
          </div>

          <button onClick={rollP1} disabled={shaking}
            className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-50 ${
              shaking
                ? "bg-red-500/30 text-red-200"
                : "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(239,68,68,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
            }`}>
            {shaking ? d.dice.rolling : d.dice.roll}
          </button>

          {p1Roll.length > 0 && !shaking && (
            <div className="mt-5 rounded-2xl p-5 text-center animate-bounce-in"
              style={{ background: "radial-gradient(ellipse at top, rgba(239,68,68,0.15), rgba(239,68,68,0.04))", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">
                {diceCount > 1 ? d.dice.total : d.dice.result}
              </div>
              <div className="text-5xl font-black text-red-300 tabular-nums">{p1total}</div>
              {diceCount > 1 && (
                <div className="text-white/25 text-sm mt-2 tabular-nums">{p1Roll.join(" + ")} = {p1total}</div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── 2-PLAYER MODE ─────────────────────────────────────────────────── */}
      {playerMode === 2 && (
        <>
          {!namesOk && (
            <p className="text-center text-xs text-white/30 mb-4">{d.dice.needNames}</p>
          )}

          {namesOk && (
            <>
              {/* Versus layout */}
              <div className="flex gap-2 mb-5 items-stretch">
                {/* Player 1 */}
                <PlayerPanel
                  name={p1name || d.dice.p1placeholder}
                  roll={p1Roll}
                  displayVals={phase === "idle" || phase === "p1done" ? display : p1Roll}
                  shaking={shaking && (phase === "idle")}
                  animKey={animKey}
                  diceCount={diceCount}
                  dieSize={DIE_SIZE}
                  active={phase === "idle"}
                  done={p1Roll.length > 0}
                  isWinner={isDone && playerMode === 2 && winner === (p1name || d.dice.p1placeholder)}
                  totalLabel={d.dice.total}
                />

                {/* VS divider */}
                <div className="flex flex-col items-center justify-center px-1 gap-1">
                  <div className="w-px flex-1 bg-white/[0.06]" />
                  <span className="text-[10px] font-black text-white/20 tracking-widest">VS</span>
                  <div className="w-px flex-1 bg-white/[0.06]" />
                </div>

                {/* Player 2 */}
                <PlayerPanel
                  name={p2name || d.dice.p2placeholder}
                  roll={p2Roll}
                  displayVals={phase === "p1done" ? display : p2Roll}
                  shaking={shaking && phase === "p1done"}
                  animKey={animKey}
                  diceCount={diceCount}
                  dieSize={DIE_SIZE}
                  active={phase === "p1done"}
                  done={p2Roll.length > 0}
                  isWinner={isDone && playerMode === 2 && winner === (p2name || d.dice.p2placeholder)}
                  totalLabel={d.dice.total}
                />
              </div>

              {/* Roll button */}
              {!isDone && (
                <button
                  onClick={phase === "idle" ? rollP1 : rollP2}
                  disabled={shaking}
                  className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-50 ${
                    shaking
                      ? "bg-red-500/30 text-red-200"
                      : "bg-gradient-to-b from-red-400 to-red-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(239,68,68,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
                  }`}
                >
                  {shaking
                    ? d.dice.rolling
                    : phase === "idle"
                    ? d.dice.rollP1(p1name || d.dice.p1placeholder)
                    : d.dice.rollP2(p2name || d.dice.p2placeholder)}
                </button>
              )}

              {/* Result banner */}
              {isDone && (
                <div className="animate-bounce-in space-y-3">
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: winner
                        ? "radial-gradient(ellipse at top, rgba(251,191,36,0.18), rgba(251,191,36,0.04))"
                        : "radial-gradient(ellipse at top, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                      border: winner ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="text-3xl mb-1">{winner ? "🏆" : "🤝"}</div>
                    <div className="text-xl font-black text-amber-300">
                      {winner ? d.dice.winner(winner) : d.dice.draw}
                    </div>
                    {winner && (
                      <div className="text-white/35 text-xs mt-1 tabular-nums">
                        {p1total} — {p2total}
                      </div>
                    )}
                  </div>

                  <button onClick={resetGame}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white/50 border border-white/[0.08] hover:border-white/15 hover:text-white/70 transition-all active:scale-95">
                    {d.dice.playAgain}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ── Player panel (2-player mode) ─────────────────────────────────────────────
function PlayerPanel({
  name, roll, displayVals, shaking, animKey,
  diceCount, dieSize, active, done, isWinner, totalLabel,
}: {
  name: string;
  roll: number[];
  displayVals: number[];
  shaking: boolean;
  animKey: number;
  diceCount: number;
  dieSize: number;
  active: boolean;
  done: boolean;
  isWinner: boolean;
  totalLabel: string;
}) {
  const total = roll.reduce((a, b) => a + b, 0);
  const showDisplay = displayVals.length > 0 && (active || done);

  return (
    <div
      className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-2.5 transition-all"
      style={{
        background: isWinner
          ? "rgba(251,191,36,0.08)"
          : active
          ? "rgba(239,68,68,0.07)"
          : "rgba(255,255,255,0.03)",
        border: isWinner
          ? "1px solid rgba(251,191,36,0.3)"
          : active
          ? "1px solid rgba(239,68,68,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Name */}
      <div className="flex items-center gap-1.5">
        {isWinner && <span className="text-sm">🏆</span>}
        <span
          className="text-xs font-bold truncate max-w-[80px]"
          style={{ color: isWinner ? "#fbbf24" : active ? "#fca5a5" : "rgba(255,255,255,0.5)" }}
        >
          {name}
        </span>
      </div>

      {/* Dice */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {showDisplay
          ? displayVals.map((v, i) => (
              <Die key={`${animKey}-${i}`} value={v} shaking={shaking} size={dieSize} />
            ))
          : Array.from({ length: diceCount }).map((_, i) => (
              <DicePlaceholder key={i} size={dieSize} />
            ))
        }
      </div>

      {/* Total */}
      {done && (
        <div className="text-center">
          <div className="text-[9px] text-white/30 uppercase tracking-widest">{totalLabel}</div>
          <div
            className="text-2xl font-black tabular-nums"
            style={{ color: isWinner ? "#fbbf24" : "rgba(255,255,255,0.8)" }}
          >
            {total}
          </div>
        </div>
      )}
    </div>
  );
}
