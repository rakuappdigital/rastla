"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict } from "@/components/LangProvider";

// ── Icon components ──────────────────────────────────────────────────────────

function RaffleIcon({ active }: { active: boolean }) {
  const c = (a: string, i: string) => (active ? a : i);
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      {/* Lid */}
      <rect x="3.5" y="0.5" width="13" height="4" rx="2"
        fill={c("#f59e0b", "rgba(255,255,255,0.35)")} />
      {/* Neck */}
      <rect x="5.5" y="4.5" width="9" height="3"
        fill={c("#d97706", "rgba(255,255,255,0.2)")} />
      {/* Body */}
      <path d="M 2 7.5 L 18 7.5 L 19.5 10.5 L 19.5 19.5 Q 19.5 21.5 17.5 21.5 L 2.5 21.5 Q 0.5 21.5 0.5 19.5 L 0.5 10.5 Z"
        fill={c("rgba(251,191,36,0.18)", "rgba(255,255,255,0.07)")}
        stroke={c("#f59e0b", "rgba(255,255,255,0.35)")} strokeWidth="1.2" />
      {/* Balls */}
      <circle cx="6.2"  cy="13.5" r="2.2" fill={c("#FF6B6B", "rgba(255,255,255,0.22)")} />
      <circle cx="13.8" cy="13.5" r="2.2" fill={c("#4ECDC4", "rgba(255,255,255,0.22)")} />
      <circle cx="10"   cy="18.2" r="2.2" fill={c("#A855F7", "rgba(255,255,255,0.22)")} />
    </svg>
  );
}

function WheelIcon({ active }: { active: boolean }) {
  const segColors = active
    ? ["#FF6B6B", "#FFC233", "#4ECDC4", "#A855F7", "#EC4899", "#84CC16"]
    : Array(6).fill("rgba(255,255,255,0.22)");
  const n = 6;
  const R = 10;
  const cx = 11;
  const cy = 11;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {segColors.map((color, i) => {
        const a1 = (i / n) * 2 * Math.PI - Math.PI / 2;
        const a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
        const x1 = (cx + Math.cos(a1) * R).toFixed(2);
        const y1 = (cy + Math.sin(a1) * R).toFixed(2);
        const x2 = (cx + Math.cos(a2) * R).toFixed(2);
        const y2 = (cy + Math.sin(a2) * R).toFixed(2);
        return (
          <path key={i}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
            fill={color}
            stroke={active ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.08)"}
            strokeWidth="0.8"
          />
        );
      })}
      {/* Center pin */}
      <circle cx={cx} cy={cy} r="3.5"
        fill={active ? "#f1f5f9" : "rgba(255,255,255,0.45)"}
        stroke={active ? "#94a3b8" : "rgba(255,255,255,0.2)"} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="1.4"
        fill={active ? "#64748b" : "rgba(255,255,255,0.3)"} />
    </svg>
  );
}

function DiceIcon({ active }: { active: boolean }) {
  const dot = active ? "white" : "rgba(255,255,255,0.5)";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="1" width="18" height="18" rx="4"
        fill={active ? "#ef4444" : "rgba(255,255,255,0.1)"}
        stroke={active ? "#dc2626" : "rgba(255,255,255,0.38)"} strokeWidth="1.3" />
      <circle cx="6"  cy="6"  r="1.9" fill={dot} />
      <circle cx="14" cy="6"  r="1.9" fill={dot} />
      <circle cx="10" cy="10" r="1.9" fill={dot} />
      <circle cx="6"  cy="14" r="1.9" fill={dot} />
      <circle cx="14" cy="14" r="1.9" fill={dot} />
    </svg>
  );
}

function CoinIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {/* Coin body */}
      <circle cx="11" cy="11" r="10"
        fill={active ? "#eab308" : "rgba(255,255,255,0.1)"}
        stroke={active ? "#b45309" : "rgba(255,255,255,0.38)"} strokeWidth="1.5" />
      {/* Inner rim */}
      <circle cx="11" cy="11" r="7.5"
        fill="none"
        stroke={active ? "rgba(180,83,9,0.45)" : "rgba(255,255,255,0.15)"}
        strokeWidth="1" />
      {/* Star motif */}
      <polygon
        points="11,5.5 12.4,9 16.2,9 13.3,11.4 14.5,15 11,12.8 7.5,15 8.7,11.4 5.8,9 9.6,9"
        fill={active ? "rgba(120,53,15,0.65)" : "rgba(255,255,255,0.28)"} />
    </svg>
  );
}

function TeamIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <circle cx="4"  cy="5.5" r="3"   fill={active ? "#3b82f6" : "rgba(255,255,255,0.28)"} />
      <ellipse cx="4" cy="14"  rx="3.8" ry="3" fill={active ? "#3b82f6" : "rgba(255,255,255,0.18)"} />
      <circle cx="18" cy="5.5" r="3"   fill={active ? "#ef4444" : "rgba(255,255,255,0.28)"} />
      <ellipse cx="18" cy="14" rx="3.8" ry="3" fill={active ? "#ef4444" : "rgba(255,255,255,0.18)"} />
      <circle cx="11" cy="4.5" r="3.5"  fill={active ? "#22c55e" : "rgba(255,255,255,0.35)"} />
      <ellipse cx="11" cy="14" rx="4.2" ry="3.5" fill={active ? "#22c55e" : "rgba(255,255,255,0.22)"} />
    </svg>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────

type IconComponent = React.FC<{ active: boolean }>;

export default function Nav() {
  const path = usePathname();
  const d = useDict();

  const segments = path.split("/");
  const lang = segments[1] || "tr";
  const otherLang = lang === "tr" ? "en" : "tr";
  const otherPath = segments.length > 2
    ? `/${otherLang}/${segments.slice(2).join("/")}`
    : `/${otherLang}`;

  const tabs: { slug: string; label: string; Icon: IconComponent }[] = [
    { slug: "cekilis",   label: d.nav.raffle, Icon: RaffleIcon },
    { slug: "cark",      label: d.nav.wheel,  Icon: WheelIcon  },
    { slug: "zar",       label: d.nav.dice,   Icon: DiceIcon   },
    { slug: "yazi-tura", label: d.nav.coin,   Icon: CoinIcon   },
    { slug: "takim",     label: d.nav.teams,  Icon: TeamIcon   },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,10,16,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-md mx-auto flex">
        {tabs.map(({ slug, label, Icon }) => {
          const href   = `/${lang}/${slug}`;
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={slug}
              href={href}
              className="relative flex-1 flex flex-col items-center gap-1 py-3 transition-all"
            >
              {/* Active top bar */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: 32, height: 2.5, background: "rgba(255,255,255,0.75)" }}
                />
              )}

              <span
                className="transition-transform duration-150"
                style={{ transform: active ? "scale(1.12)" : "scale(1)" }}
              >
                <Icon active={active} />
              </span>

              <span
                className="text-[9px] font-semibold tracking-wide uppercase transition-colors duration-150"
                style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)" }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* Language switcher */}
        <Link
          href={otherPath}
          className="flex flex-col items-center justify-center gap-1 px-2 py-3 transition-colors border-l border-white/[0.05]"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.3" />
            <ellipse cx="9" cy="9" rx="4.5" ry="8" stroke="currentColor" strokeWidth="1.3" />
            <line x1="1.5" y1="6.5" x2="16.5" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
            <line x1="1.5" y1="11.5" x2="16.5" y2="11.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wide">
            {otherLang}
          </span>
        </Link>
      </div>
    </nav>
  );
}
