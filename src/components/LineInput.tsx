"use client";

import { useRef } from "react";

interface LineInputProps {
  value: string;           // newline-separated string (localStorage uyumlu)
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  badge?: string;
}

export default function LineInput({ value, onChange, placeholder, label, badge }: LineInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // String ↔ dizi dönüşümü
  const lines = value.split("\n");
  // Gösterim için: her zaman en az 1 alan, son satır boşsa 1 ekstra
  const items = lines.length === 0 ? [""] : lines;

  const update = (newItems: string[]) => {
    onChange(newItems.join("\n"));
  };

  const handleChange = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    update(next);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Yeni satır ekle, imleci oraya taşı
      const next = [...items];
      next.splice(i + 1, 0, "");
      update(next);
      setTimeout(() => inputRefs.current[i + 1]?.focus(), 10);
    } else if (e.key === "Backspace" && items[i] === "" && items.length > 1) {
      e.preventDefault();
      // Boş satırı sil, üstüne çık
      const next = items.filter((_, j) => j !== i);
      update(next);
      setTimeout(() => inputRefs.current[i - 1]?.focus(), 10);
    }
  };

  const handleRemove = (i: number) => {
    if (items.length <= 1) { update([""]); return; }
    update(items.filter((_, j) => j !== i));
  };

  const filled = items.filter(Boolean).length;

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--c-border)", background: "var(--c-surface)" }}>

      {/* Başlık */}
      {(label || badge !== undefined) && (
        <div className="flex items-center justify-between px-4 pt-3.5 pb-1">
          {label && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--c-text-muted)" }}>
              {label}
            </span>
          )}
          {badge !== undefined && (
            <span className="text-[10px] tabular-nums" style={{ color: "var(--c-text-muted)" }}>
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Satırlar */}
      {items.map((item, i) => (
        <div key={i} className="flex items-center group"
          style={{ borderBottom: i < items.length - 1 ? "1px dashed var(--c-border)" : "none" }}>
          <input
            ref={(el) => { inputRefs.current[i] = el; }}
            value={item}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            placeholder={i === 0 ? placeholder : ""}
            className="flex-1 bg-transparent outline-none px-4 py-3 placeholder:opacity-30"
            style={{ fontSize: 16, color: "var(--c-text)" }}
          />
          {/* Sil butonu */}
          {(item !== "" || items.length > 1) && (
            <button
              onClick={() => handleRemove(i)}
              className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pr-3 transition-opacity text-lg leading-none"
              style={{ color: "var(--c-text-muted)" }}
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {/* Ekle butonu */}
      <button
        onClick={() => {
          const next = [...items, ""];
          update(next);
          setTimeout(() => inputRefs.current[next.length - 1]?.focus(), 10);
        }}
        className="w-full py-2.5 text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-80 active:opacity-60"
        style={{
          color: "var(--c-text-muted)",
          borderTop: filled > 0 ? "1px dashed var(--c-border)" : "none",
        }}
      >
        + {filled > 0 ? "Ekle" : "İsim ekle"}
      </button>
    </div>
  );
}
