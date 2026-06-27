"use client";

interface LineInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  badge?: string;
  rows?: number;
}

const DASHED_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='36'%3E%3Cline x1='0' y1='35.5' x2='100%25' y2='35.5' stroke='rgba(255,255,255,0.07)' stroke-width='1' stroke-dasharray='6%2C5'/%3E%3C/svg%3E")`;

export default function LineInput({ value, onChange, placeholder, label, badge, rows = 6 }: LineInputProps) {
  const lineCount = value ? value.split("\n").filter(Boolean).length : 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
      {(label || badge !== undefined) && (
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          {label && (
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">
              {label}
            </span>
          )}
          {badge !== undefined && (
            <span className="text-[10px] text-white/25 tabular-nums">{badge}</span>
          )}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={Math.max(rows, lineCount + 1)}
        className="w-full bg-transparent text-white/90 placeholder:text-white/18 text-sm resize-none outline-none px-4 py-3"
        style={{
          lineHeight: "36px",
          backgroundImage: DASHED_BG,
          backgroundSize: "100% 36px",
          backgroundRepeat: "repeat",
          backgroundPositionY: "3px",
        }}
      />
    </div>
  );
}
