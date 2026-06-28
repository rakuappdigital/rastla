"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

function LangSwitch() {
  const path = usePathname();
  const segs = path.split("/");
  const lang = segs[1] || "tr";
  const other = lang === "tr" ? "en" : "tr";
  const otherPath = segs.length > 2 ? `/${other}/${segs.slice(2).join("/")}` : `/${other}`;
  const isActive = (l: string) => l === lang;

  return (
    <Link href={otherPath} className="flex items-center rounded-full overflow-hidden"
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}>
      {["TR", "EN"].map((l) => (
        <span key={l} className="px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all"
          style={{
            background: isActive(l.toLowerCase()) ? "var(--c-text)" : "transparent",
            color: isActive(l.toLowerCase()) ? "var(--c-bg)" : "var(--c-text-muted)",
          }}>
          {l}
        </span>
      ))}
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-text-muted)" }}>
      <span>{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}

export default function FloatingControls() {
  return (
    <div className="fixed z-40 flex items-center gap-2"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 12px)", right: 16 }}>
      <ThemeToggle />
      <LangSwitch />
    </div>
  );
}
