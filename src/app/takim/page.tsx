"use client";

import { useState } from "react";

const TEAM_COLORS = [
  { bg: "bg-blue-500/20",   border: "border-blue-500/30",   text: "text-blue-300",   label: "🔵" },
  { bg: "bg-red-500/20",    border: "border-red-500/30",    text: "text-red-300",    label: "🔴" },
  { bg: "bg-green-500/20",  border: "border-green-500/30",  text: "text-green-300",  label: "🟢" },
  { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-300", label: "🟡" },
  { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-300", label: "🟣" },
  { bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-300", label: "🟠" },
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
  const [text, setText] = useState("");
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [animKey, setAnimKey] = useState(0);

  const names = text.split("\n").map((n) => n.trim()).filter(Boolean);

  const build = () => {
    if (names.length < teamCount) return;
    const shuffled = shuffle(names);
    const result: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => result[i % teamCount].push(name));
    setTeams(result);
    setAnimKey((k) => k + 1);
  };

  const maxTeams = Math.min(6, names.length);

  return (
    <div className="p-5 pt-10">
      <header className="mb-8">
        <div className="text-4xl mb-2">👥</div>
        <h1 className="text-2xl font-bold">Takım Kurucu</h1>
        <p className="text-white/40 text-sm mt-1">Kişileri takımlara rastgele böl</p>
      </header>

      {/* Input */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-white/50 uppercase tracking-widest">Katılımcılar</label>
          <span className="text-xs text-white/30">{names.length} kişi</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setTeams([]); }}
          placeholder={"Ali\nAyşe\nMehmet\nFatma\nCan\nEla"}
          rows={5}
          className="w-full bg-transparent text-white placeholder:text-white/20 text-sm resize-none outline-none leading-7"
        />
      </div>

      {/* Team count selector */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-5">
        <div className="text-xs text-white/50 uppercase tracking-widest mb-3">Takım Sayısı</div>
        <div className="flex gap-2 flex-wrap">
          {[2, 3, 4, 5, 6].filter((n) => n <= Math.max(maxTeams, 2)).map((n) => (
            <button
              key={n}
              onClick={() => { setTeamCount(n); setTeams([]); }}
              className={`w-12 py-2.5 rounded-xl font-bold transition-all ${
                teamCount === n
                  ? "bg-green-500 text-white"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/10"
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
        className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
      >
        👥 Takımları Oluştur
      </button>

      {names.length > 0 && names.length < teamCount && (
        <p className="text-center text-xs text-white/30 mt-2">
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
                className={`${color.bg} border ${color.border} rounded-2xl p-4 animate-slide-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${color.text}`}>
                  <span>{color.label}</span>
                  <span>Takım {i + 1}</span>
                  <span className="ml-auto text-white/30 font-normal">{team.length} kişi</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.map((name, j) => (
                    <span
                      key={j}
                      className="bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white/80"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Reshuffle */}
          <button
            onClick={build}
            className="w-full py-3 rounded-xl text-sm text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/10 transition-all mt-1"
          >
            🔀 Tekrar Karıştır
          </button>
        </div>
      )}
    </div>
  );
}
