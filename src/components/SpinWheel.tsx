"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const SEG_COLORS = [
  ["#FF6B6B", "#ff3333"],
  ["#FF8E53", "#ff5500"],
  ["#FFC233", "#f59e0b"],
  ["#4ECDC4", "#0ea5e9"],
  ["#A855F7", "#7c3aed"],
  ["#EC4899", "#db2777"],
  ["#84CC16", "#65a30d"],
  ["#06B6D4", "#0284c7"],
  ["#F97316", "#ea580c"],
  ["#8B5CF6", "#6d28d9"],
];

const SIZE = 320;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUTER = CX - 4;   // gold ring outer
const R_WHEEL = CX - 18;  // actual wheel
const R_CENTER = 22;

interface SpinWheelProps {
  items: string[];
  onResult: (winner: string) => void;
  spinLabel?: string;
  spinningLabel?: string;
}

export default function SpinWheel({ items, onResult, spinLabel = "🎡 Çevir!", spinningLabel = "Dönüyor…" }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [spinning, setSpinning] = useState(false);

  const drawWheel = useCallback((angle: number, isSpinning = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const n = items.length;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // ── Outer glow ring ──────────────────────────────────────────
    if (isSpinning) {
      ctx.save();
      ctx.shadowColor = "rgba(168,85,247,0.8)";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(CX, CY, R_OUTER + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(168,85,247,0.5)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // ── Gold outer ring ──────────────────────────────────────────
    const goldRing = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    goldRing.addColorStop(0,   "#fef08a");
    goldRing.addColorStop(0.5, "#eab308");
    goldRing.addColorStop(1,   "#b45309");
    ctx.beginPath();
    ctx.arc(CX, CY, R_OUTER, 0, 2 * Math.PI);
    ctx.fillStyle = goldRing;
    ctx.fill();

    // ── Placeholder wheel (no items) ─────────────────────────────
    if (n < 2) {
      const placeholderColors = SEG_COLORS;
      const pc = placeholderColors.length;
      const sa = (2 * Math.PI) / pc;
      for (let i = 0; i < pc; i++) {
        const start = angle + i * sa - Math.PI / 2;
        const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, R_WHEEL);
        grad.addColorStop(0.3, placeholderColors[i][1] + "99");
        grad.addColorStop(1,   placeholderColors[i][0] + "cc");
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R_WHEEL, start, start + sa);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else {
      // ── Real segments ────────────────────────────────────────────
      const segAngle = (2 * Math.PI) / n;
      for (let i = 0; i < n; i++) {
        const start = angle + i * segAngle - Math.PI / 2;
        const end = start + segAngle;
        const [light, dark] = SEG_COLORS[i % SEG_COLORS.length];

        // Segment with radial gradient
        const grad = ctx.createRadialGradient(CX, CY, R_WHEEL * 0.1, CX, CY, R_WHEEL);
        grad.addColorStop(0,   dark + "cc");
        grad.addColorStop(0.5, light + "ee");
        grad.addColorStop(1,   light + "ff");

        ctx.save();
        if (isSpinning) {
          ctx.shadowColor = light + "66";
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.moveTo(CX, CY);
        ctx.arc(CX, CY, R_WHEEL, start, end);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Text
        ctx.save();
        ctx.translate(CX, CY);
        ctx.rotate(start + segAngle / 2);
        const fontSize = Math.min(14, Math.max(8, 220 / n));
        ctx.font = `bold ${fontSize}px -apple-system, system-ui, sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 3;
        ctx.textAlign = "right";
        const label = items[i].length > 13 ? items[i].slice(0, 12) + "…" : items[i];
        ctx.fillText(label, R_WHEEL - 12, fontSize / 3);
        ctx.restore();
      }
    }

    // ── Tick marks on gold ring ──────────────────────────────────
    const ticks = n >= 2 ? n : SEG_COLORS.length;
    for (let i = 0; i < ticks; i++) {
      const a = angle + (i / ticks) * 2 * Math.PI - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(CX + Math.cos(a) * (R_WHEEL + 2),  CY + Math.sin(a) * (R_WHEEL + 2));
      ctx.lineTo(CX + Math.cos(a) * (R_OUTER - 1),  CY + Math.sin(a) * (R_OUTER - 1));
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // ── Center cap ───────────────────────────────────────────────
    const capGrad = ctx.createRadialGradient(CX - 5, CY - 5, 2, CX, CY, R_CENTER);
    capGrad.addColorStop(0,   "#ffffff");
    capGrad.addColorStop(0.4, "#e2e8f0");
    capGrad.addColorStop(1,   "#94a3b8");
    ctx.beginPath();
    ctx.arc(CX, CY, R_CENTER, 0, 2 * Math.PI);
    ctx.fillStyle = capGrad;
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(CX, CY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "#475569";
    ctx.fill();
  }, [items]);

  useEffect(() => {
    // Idle slow spin for placeholder
    if (items.length >= 2) {
      drawWheel(angleRef.current, false);
      return;
    }
    let a = 0;
    const idle = () => {
      a += 0.003;
      angleRef.current = a;
      drawWheel(a, false);
      rafRef.current = requestAnimationFrame(idle);
    };
    rafRef.current = requestAnimationFrame(idle);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawWheel, items.length]);

  useEffect(() => {
    if (items.length >= 2) drawWheel(angleRef.current, false);
  }, [drawWheel, items]);

  const spin = () => {
    if (spinning || items.length < 2) return;
    cancelAnimationFrame(rafRef.current);
    setSpinning(true);

    const n = items.length;
    const segAngle = (2 * Math.PI) / n;
    const extraRot = (6 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const randOff  = Math.random() * 2 * Math.PI;
    const startAngle = angleRef.current;
    const endAngle   = startAngle + extraRot + randOff;
    const duration   = 3800 + Math.random() * 800;
    const t0 = performance.now();

    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const cur = startAngle + (endAngle - startAngle) * ease(p);
      angleRef.current = cur;
      drawWheel(cur, p < 1);

      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        const norm = ((cur % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const idx  = Math.floor(((2 * Math.PI - norm) % (2 * Math.PI)) / segAngle) % n;
        setSpinning(false);
        onResult(items[idx]);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 z-10" style={{ transform: "translate(-50%, -6px)" }}>
          <svg width="28" height="36" viewBox="0 0 28 36">
            <defs>
              <linearGradient id="ptr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <filter id="ptr-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
            </filter>
            <polygon points="14,34 2,4 26,4" fill="url(#ptr)" filter="url(#ptr-shadow)" />
            <polygon points="14,34 2,4 26,4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          </svg>
        </div>

        {/* Wheel glow when spinning */}
        {spinning && (
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 60px rgba(168,85,247,0.4), 0 0 120px rgba(168,85,247,0.15)" }} />
        )}

        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="rounded-full" />
      </div>

      <button onClick={spin} disabled={spinning || items.length < 2}
        className={`w-full max-w-[300px] py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed ${
          spinning
            ? "bg-purple-500/30 text-purple-200"
            : "bg-gradient-to-b from-purple-400 to-purple-700 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(168,85,247,0.3)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}>
        {spinning ? spinningLabel : spinLabel}
      </button>
    </div>
  );
}
