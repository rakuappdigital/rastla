"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const COLORS = [
  "#FF6B6B", "#FF8E53", "#FFC233", "#4ECDC4",
  "#45B7D1", "#A855F7", "#EC4899", "#84CC16",
  "#F97316", "#06B6D4",
];

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

  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const n = items.length;
      if (n === 0) return;

      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;
      const r = cx - 6;
      const segAngle = (2 * Math.PI) / n;

      ctx.clearRect(0, 0, size, size);

      // Outer shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      ctx.restore();

      for (let i = 0; i < n; i++) {
        const start = angle + i * segAngle - Math.PI / 2;
        const end = start + segAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + segAngle / 2);
        ctx.textAlign = "right";
        const fontSize = Math.min(14, Math.max(8, 200 / n));
        ctx.font = `bold ${fontSize}px -apple-system, system-ui, sans-serif`;
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        const label = items[i].length > 14 ? items[i].slice(0, 13) + "…" : items[i];
        ctx.fillText(label, r - 10, fontSize / 3);
        ctx.restore();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
      ctx.fillStyle = "#0a0a0f";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center shine
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fill();
    },
    [items]
  );

  useEffect(() => {
    drawWheel(angleRef.current);
  }, [drawWheel]);

  const spin = () => {
    if (spinning || items.length < 2) return;
    setSpinning(true);

    const n = items.length;
    const segAngle = (2 * Math.PI) / n;
    const extraRotations = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalRotation = extraRotations + randomOffset;

    const startAngle = angleRef.current;
    const endAngle = startAngle + totalRotation;
    const duration = 3500 + Math.random() * 1000;
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentAngle = startAngle + (endAngle - startAngle) * easeOut(progress);
      angleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner: segment 0 starts at -π/2, wheel rotated by currentAngle
        const normalizedAngle = ((currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const winnerIndex = Math.floor(((2 * Math.PI - normalizedAngle) % (2 * Math.PI)) / segAngle) % n;
        setSpinning(false);
        onResult(items[winnerIndex]);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel + pointer */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[22px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
        </div>
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-full"
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || items.length < 2}
        className={`w-full max-w-[300px] py-4 rounded-2xl font-bold text-base tracking-wide transition-all active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed ${
          spinning
            ? "bg-purple-500/30 text-purple-200"
            : "bg-gradient-to-b from-purple-400 to-purple-700 text-white shadow-[0_4px_0_rgba(0,0,0,0.3),0_0_30px_rgba(168,85,247,0.25)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-px"
        }`}
      >
        {spinning ? spinningLabel : spinLabel}
      </button>
    </div>
  );
}
