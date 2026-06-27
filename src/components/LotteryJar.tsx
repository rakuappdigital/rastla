"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = [
  "#FF6B6B", "#FF8E53", "#FFC233", "#4ECDC4",
  "#45B7D1", "#A855F7", "#EC4899", "#84CC16",
  "#F97316", "#06B6D4", "#EF4444", "#8B5CF6",
];

const W = 260;
const H = 300;
const BALL_R = 21;
// Inner jar bounds
const IX1 = 18, IX2 = W - 18;
const IY1 = 52, IY2 = H - 20;

interface Ball {
  name: string;
  color: string;
  x: number; y: number;
  vx: number; vy: number;
}

function makeBalls(names: string[]): Ball[] {
  const list = names.length > 0 ? names.slice(0, 14) : ["", "", ""];
  return list.map((name, i) => ({
    name,
    color: COLORS[i % COLORS.length],
    x: IX1 + BALL_R + Math.random() * (IX2 - IX1 - BALL_R * 2),
    y: IY2 - BALL_R - Math.random() * 80,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -Math.random() * 1,
  }));
}

interface Props { names: string[]; drawing: boolean; winner: string | null; }

export default function LotteryJar({ names, drawing, winner }: Props) {
  const [balls, setBalls] = useState<Ball[]>(() => makeBalls([]));
  const [winnerBall, setWinnerBall] = useState<Ball | null>(null);
  const [popped, setPopped] = useState(false);
  const ballsRef = useRef<Ball[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const b = makeBalls(names);
    setBalls(b);
    ballsRef.current = b;
    setWinnerBall(null);
    setPopped(false);
  }, [names]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    const animate = () => {
      const updated = ballsRef.current.map((ball) => {
        let { x, y, vx, vy } = ball;

        if (drawing) {
          vx += (Math.random() - 0.5) * 2.5;
          vy += (Math.random() - 0.5) * 2.5;
          vx = Math.max(-6, Math.min(6, vx));
          vy = Math.max(-6, Math.min(6, vy));
        } else {
          // Gentle gravity settle
          vy += 0.25;
          vx *= 0.97;
          vy = Math.min(vy, 5);
        }

        x += vx; y += vy;
        if (x < IX1 + BALL_R)  { x = IX1 + BALL_R;  vx = Math.abs(vx) * 0.7; }
        if (x > IX2 - BALL_R)  { x = IX2 - BALL_R;  vx = -Math.abs(vx) * 0.7; }
        if (y < IY1 + BALL_R)  { y = IY1 + BALL_R;  vy = Math.abs(vy) * 0.6; }
        if (y > IY2 - BALL_R)  { y = IY2 - BALL_R;  vy = -Math.abs(vy) * (drawing ? 0.8 : 0.4); }
        return { ...ball, x, y, vx, vy };
      });
      ballsRef.current = updated;
      setBalls([...updated]);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawing]);

  useEffect(() => {
    if (!winner) { setWinnerBall(null); setPopped(false); return; }
    const found = ballsRef.current.find((b) => b.name === winner) ?? ballsRef.current[0];
    if (found) {
      setWinnerBall({ ...found, x: W / 2, y: IY1 + 20 });
      setPopped(true);
    }
  }, [winner]);

  const displayBalls = winner
    ? balls.filter((b) => b.name !== winner)
    : balls;

  return (
    <div className="relative flex justify-center select-none" style={{ height: H + 8 }}>
      {/* Glow halo during drawing */}
      {drawing && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none animate-pulse-scale"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18) 0%, transparent 70%)" }} />
      )}

      {/* Jar SVG */}
      <svg width={W} height={H} className={`absolute top-0 left-1/2 -translate-x-1/2 ${drawing ? "animate-jar-shake" : ""}`}
        style={{ filter: `drop-shadow(0 12px 32px rgba(251,191,36,${drawing ? "0.35" : "0.15"}))` }}>
        <defs>
          <linearGradient id="jg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.09)" />
            <stop offset="35%"  stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.07)" />
          </linearGradient>
          <linearGradient id="jborder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(251,191,36,0.55)" />
            <stop offset="50%"  stopColor="rgba(251,191,36,0.80)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.45)" />
          </linearGradient>
          <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#fef08a" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <clipPath id="jc">
            <path d="M 56 48 L 204 48 L 220 72 L 242 96 L 242 272 Q 242 290 224 290 L 36 290 Q 18 290 18 272 L 18 96 L 40 72 Z" />
          </clipPath>
        </defs>

        {/* Body fill */}
        <path d="M 56 48 L 204 48 L 220 72 L 242 96 L 242 272 Q 242 290 224 290 L 36 290 Q 18 290 18 272 L 18 96 L 40 72 Z" fill="url(#jg)" />
        {/* Body border */}
        <path d="M 56 48 L 204 48 L 220 72 L 242 96 L 242 272 Q 242 290 224 290 L 36 290 Q 18 290 18 272 L 18 96 L 40 72 Z"
          fill="none" stroke="url(#jborder)" strokeWidth="2" />
        {/* Bottom tint */}
        <path d="M 18 230 L 18 272 Q 18 290 36 290 L 224 290 Q 242 290 242 272 L 242 230 Z"
          fill="rgba(251,191,36,0.04)" />
        {/* Neck */}
        <rect x="58" y="22" width="144" height="28" rx="5"
          fill="rgba(251,191,36,0.06)" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" />
        {/* Lid */}
        <rect x="44" y="6" width="172" height="20" rx="10" fill="url(#lid)" />
        <rect x="44" y="6" width="172" height="20" rx="10"
          fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        {/* Lid shine */}
        <rect x="60" y="9" width="80" height="5" rx="2.5" fill="rgba(255,255,255,0.3)" />
        {/* Glass shine left */}
        <path d="M 28 106 Q 23 170 28 230" stroke="rgba(255,255,255,0.14)" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M 44 96 Q 40 145 44 190" stroke="rgba(255,255,255,0.08)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Glass shine right (subtle) */}
        <path d="M 230 106 Q 235 160 230 220" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>

      {/* Balls layer — clipped inside jar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: W, height: H, overflow: "hidden" }}>
        <div style={{ clipPath: "path('M 56 48 L 204 48 L 220 72 L 242 96 L 242 272 Q 242 290 224 290 L 36 290 Q 18 290 18 272 L 18 96 L 40 72 Z')" }}>
          {displayBalls.map((ball, i) => (
            <div key={`${ball.name || ""}${i}`} className="absolute flex items-center justify-center rounded-full transition-none"
              style={{
                width: BALL_R * 2, height: BALL_R * 2,
                left: ball.x - BALL_R, top: ball.y - BALL_R,
                background: `radial-gradient(circle at 32% 28%, ${ball.color}ff, ${ball.color}99)`,
                boxShadow: `0 3px 10px ${ball.color}55, inset 0 1px 3px rgba(255,255,255,0.4)`,
                fontSize: 8, fontWeight: 900, color: "rgba(0,0,0,0.6)",
              }}>
              {ball.name ? ball.name.slice(0, 2) : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Winner ball pops out above jar */}
      {winnerBall && popped && (
        <div className="absolute left-1/2 -translate-x-1/2 animate-ball-pop z-20 flex items-center justify-center rounded-full font-black"
          style={{
            width: BALL_R * 2.8, height: BALL_R * 2.8,
            top: IY1 - 10,
            background: `radial-gradient(circle at 32% 28%, ${winnerBall.color}ff, ${winnerBall.color}cc)`,
            boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 40px ${winnerBall.color}99, inset 0 2px 4px rgba(255,255,255,0.5)`,
            fontSize: 11, color: "rgba(0,0,0,0.7)",
          }}>
          {winnerBall.name.slice(0, 2)}
        </div>
      )}
    </div>
  );
}
