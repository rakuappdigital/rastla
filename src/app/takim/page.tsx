"use client";

import { useState } from "react";
import LineInput from "@/components/LineInput";
import ResetConfirm from "@/components/ResetConfirm";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const TEAM_COLORS = [
  { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  text: "#93c5fd", dot: "#3b82f6" },
  { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   text: "#fca5a5", dot: "#ef4444" },
  { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.3)",   text: "#86efac", dot: "#22c55e" },
  { bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)",   text: "#fde047", dot: "#eab308" },
  { bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.3)",  text: "#d8b4fe", dot: "#a855f7" },
  { bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.3)",  text: "#fdba74", dot: "#f97316" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TakimPage() {
  const [text, setText, clearText] = useLocalStorage("rastla_takim_text", "");
  const [teamCount, setTeamCount, clearTeamCount] = useLocalStorage("rastla_takim_count", 2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const names = text.split("\n").map((n) => n.trim()).filter(Boolean);

  const build = () => {
    if (names.length < teamCount) return;
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffle(names).forEach((name, i) => result[i % teamCount].push(name));
    setTeams(result);
    setAnimKey((k) => k + 1);
  };

  const handleReset = () => {
    clearText();
    clearTeamCount();
    setTeams([]);
    setShowReset(false);
  };

  return (
    <div className="p-5 pt-8">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute -top-4 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="text-5xl mb-2">👥</div>
            <h1 className="text-2xl font-bold tracking-tight">Takım Kurucu</h1>
            <p className="text-white/40 text-sm mt-1">Kişileri takımlara rastgele böl</p>
          </div>
          {(names.length > 0 || teams.length > 0) && (
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
        value={text}
        onChange={(v) => { setText(v); setTeams([]); }}
        placeholder={"Ali\nAyşe\nMehmet\nFatma\nCan\nEla"}
        label="Katılımcılar"
        badge={names.length > 0 ? `${names.length} kişi` : undefined}
        rows={5}
      />

      {/* Team count */}
      <div
        className="rounded-2xl p-4 mt-4 mb-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em] mb-3">
          Takım Sayısı
        </div>
        <div className="flex gap-2 flex-wrap">
          {[2, 3, 4, 5, 6].filter((n) => n <= Math.max(6, 2)).map((n) => (
            <button
              key={n}
              onClick={() => { setTeamCount(n); setTeams([]); }}
              disabled={names.length > 0 && n > names.length}
              className={`w-12 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-25 ${
                teamCount === n
                  ? "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_3px_0_rgba(0,0,0,0.3),0_0_20px_rgba(34,197,94,0.25)]"
                  : "bg-white/[0.05] text-white/40 hover:bg-white/[0.08]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Build button */}
      <button
        onClick={build}
        disabled={names.length < teamCount}
        className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed ${
          "bg-gradient-to-b from-green-400 to-green-600 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(34,197,94,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}
      >
        👥 Takımları Oluştur
      </button>

      {names.length > 0 && names.length < teamCount && (
        <p className="text-center text-xs text-white/25 mt-2">
          En az {teamCount} kişi gerekli ({names.length}/{teamCount})
        </p>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <div key={animKey} className="mt-6 space-y-3">
          {teams.map((team, i) => {
            const color = TEAM_COLORS[i % TEAM_COLORS.length];
            return (
              <div
                key={i}
                className="rounded-2xl p-4 animate-slide-up"
                style={{
                  background: color.bg,
                  border: `1px solid ${color.border}`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: color.dot }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: color.text }}
                  >
                    Takım {i + 1}
                  </span>
                  <span className="ml-auto text-[10px] text-white/25 tabular-nums">
                    {team.length} kişi
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.map((name, j) => (
                    <span
                      key={j}
                      className="rounded-xl px-3 py-1.5 text-sm font-medium"
                      style={{
                        background: "rgba(255,255,255,0.09)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            onClick={build}
            className="w-full py-3 rounded-2xl text-sm text-white/35 hover:text-white/60 border border-white/[0.06] hover:border-white/10 transition-all active:scale-95"
          >
            🔀 Tekrar Karıştır
          </button>
        </div>
      )}

      {showReset && (
        <ResetConfirm onConfirm={handleReset} onCancel={() => setShowReset(false)} />
      )}
    </div>
  );
}
