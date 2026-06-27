"use client";

import { useEffect, useRef, useState } from "react";

const BALL_COLORS = [
  "#FF6B6B", "#FF8E53", "#FFC233", "#4ECDC4",
  "#45B7D1", "#A855F7", "#EC4899", "#84CC16",
  "#F97316", "#06B6D4", "#EF4444", "#8B5CF6",
];

interface Props {
  names: string[];
  drawing: boolean;
  winner: string | null;
}

interface Ball {
  name: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const JAR_W = 220;
const JAR_H = 260;
const BALL_R = 20;

function initBalls(names: string[]): Ball[] {
  return names.slice(0, 16).map((name, i) => ({
    name,
    color: BALL_COLORS[i % BALL_COLORS.length],
    x: BALL_R + 10 + ((i % 4) * ((JAR_W - BALL_R * 2 - 20) / 3)) + (Math.random() - 0.5) * 10,
    y: BALL_R + 20 + (Math.floor(i / 4) * ((JAR_H * 0.72 - BALL_R * 2) / 3)) + (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  }));
}

export default function LotteryJar({ names, drawing, winner }: Props) {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [winnerBall, setWinnerBall] = useState<Ball | null>(null);
  const [showWinnerPop, setShowWinnerPop] = useState(false);
  const rafRef = useRef<number>(0);
  const ballsRef = useRef<Ball[]>([]);

  useEffect(() => {
    const b = initBalls(names);
    setBalls(b);
    ballsRef.current = b;
    setWinnerBall(null);
    setShowWinnerPop(false);
  }, [names]);

  // Animate balls when drawing
  useEffect(() => {
    if (!drawing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const animate = () => {
      const updated = ballsRef.current.map((ball) => {
        let { x, y, vx, vy } = ball;
        vx += (Math.random() - 0.5) * 1.5;
        vy += (Math.random() - 0.5) * 1.5;
        vx = Math.max(-4, Math.min(4, vx));
        vy = Math.max(-4, Math.min(4, vy));
        x += vx;
        y += vy;
        // Bounds (jar inner area approx 10–210 x, 10–200 y)
        if (x < BALL_R + 8)  { x = BALL_R + 8;  vx = Math.abs(vx); }
        if (x > JAR_W - BALL_R - 8) { x = JAR_W - BALL_R - 8; vx = -Math.abs(vx); }
        if (y < BALL_R + 8)  { y = BALL_R + 8;  vy = Math.abs(vy); }
        if (y > JAR_H * 0.78 - BALL_R) { y = JAR_H * 0.78 - BALL_R; vy = -Math.abs(vy); }
        return { ...ball, x, y, vx, vy };
      });
      ballsRef.current = updated;
      setBalls([...updated]);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawing]);

  // Show winner ball pop
  useEffect(() => {
    if (!winner) { setWinnerBall(null); setShowWinnerPop(false); return; }
    const found = ballsRef.current.find((b) => b.name === winner) || ballsRef.current[0];
    if (found) {
      const centered = { ...found, x: JAR_W / 2, y: JAR_H * 0.3 };
      setWinnerBall(centered);
      setShowWinnerPop(true);
    }
  }, [winner]);

  const displayBalls = winner ? balls.filter((b) => b.name !== winner) : balls;

  return (
    <div className="relative flex justify-center select-none" style={{ height: JAR_H + 10 }}>
      {/* Jar SVG shape */}
      <svg
        width={JAR_W}
        height={JAR_H}
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{ filter: "drop-shadow(0 8px 24px rgba(251,191,36,0.15))" }}
      >
        <defs>
          <linearGradient id="jar-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(251,191,36,0.18)" />
            <stop offset="40%" stopColor="rgba(251,191,36,0.06)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.12)" />
          </linearGradient>
          <linearGradient id="rim-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(251,191,36,0.6)" />
            <stop offset="50%" stopColor="rgba(251,191,36,0.9)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.5)" />
          </linearGradient>
          <clipPath id="jar-clip">
            <path d="M 50 40 L 170 40 L 185 70 L 210 90 L 210 240 Q 210 260 190 260 L 30 260 Q 10 260 10 240 L 10 90 L 35 70 Z" />
          </clipPath>
        </defs>

        {/* Jar body fill */}
        <path
          d="M 50 40 L 170 40 L 185 70 L 210 90 L 210 240 Q 210 260 190 260 L 30 260 Q 10 260 10 240 L 10 90 L 35 70 Z"
          fill="url(#jar-grad)"
        />
        {/* Jar body border */}
        <path
          d="M 50 40 L 170 40 L 185 70 L 210 90 L 210 240 Q 210 260 190 260 L 30 260 Q 10 260 10 240 L 10 90 L 35 70 Z"
          fill="none"
          stroke="rgba(251,191,36,0.35)"
          strokeWidth="1.5"
        />
        {/* Neck */}
        <rect x="50" y="16" width="120" height="26" rx="4"
          fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" />
        {/* Lid */}
        <rect x="40" y="4" width="140" height="16" rx="8"
          fill="rgba(251,191,36,0.2)" stroke="url(#rim-grad)" strokeWidth="1.5" />
        {/* Glass shine */}
        <path d="M 22 100 Q 18 150 22 200" stroke="rgba(255,255,255,0.12)" strokeWidth="5"
          fill="none" strokeLinecap="round" />
        <path d="M 36 90 Q 33 130 36 170" stroke="rgba(255,255,255,0.07)" strokeWidth="3"
          fill="none" strokeLinecap="round" />
      </svg>

      {/* Balls inside jar */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 ${drawing ? "animate-jar-shake" : ""}`}
        style={{ width: JAR_W, height: JAR_H }}
      >
        {displayBalls.map((ball, i) => (
          <div
            key={ball.name + i}
            className="absolute flex items-center justify-center rounded-full text-[9px] font-black text-white/80 shadow-md transition-none"
            style={{
              width: BALL_R * 2,
              height: BALL_R * 2,
              left: ball.x - BALL_R,
              top: ball.y - BALL_R,
              background: `radial-gradient(circle at 35% 30%, ${ball.color}ee, ${ball.color}88)`,
              boxShadow: `0 2px 8px ${ball.color}55, inset 0 1px 2px rgba(255,255,255,0.35)`,
            }}
          >
            {ball.name.slice(0, 2)}
          </div>
        ))}

        {/* Winner ball pop animation */}
        {winnerBall && showWinnerPop && (
          <div
            className="absolute flex items-center justify-center rounded-full font-black shadow-xl animate-ball-pop"
            style={{
              width: BALL_R * 2.4,
              height: BALL_R * 2.4,
              left: winnerBall.x - BALL_R * 1.2,
              top: winnerBall.y - BALL_R * 1.2,
              background: `radial-gradient(circle at 35% 30%, ${winnerBall.color}ff, ${winnerBall.color}aa)`,
              boxShadow: `0 0 30px ${winnerBall.color}99, inset 0 1px 3px rgba(255,255,255,0.5)`,
              fontSize: 10,
              color: "rgba(0,0,0,0.7)",
              zIndex: 10,
            }}
          >
            {winnerBall.name.slice(0, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
