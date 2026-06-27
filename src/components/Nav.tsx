"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDict } from "@/components/LangProvider";

export default function Nav() {
  const path = usePathname();
  const d = useDict();

  // Extract lang from path: /tr/cekilis → "tr"
  const segments = path.split("/");
  const lang = segments[1] || "tr";
  const otherLang = lang === "tr" ? "en" : "tr";

  // Build other-lang path: /tr/cekilis → /en/cekilis
  const otherPath = segments.length > 2
    ? `/${otherLang}/${segments.slice(2).join("/")}`
    : `/${otherLang}`;

  const TeamIcon = ({ active }: { active: boolean }) => (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <circle cx="4"  cy="5.5" r="3" fill={active ? "#3b82f6" : "rgba(255,255,255,0.28)"} />
      <ellipse cx="4" cy="14" rx="3.8" ry="3" fill={active ? "#3b82f6" : "rgba(255,255,255,0.18)"} />
      <circle cx="18" cy="5.5" r="3" fill={active ? "#ef4444" : "rgba(255,255,255,0.28)"} />
      <ellipse cx="18" cy="14" rx="3.8" ry="3" fill={active ? "#ef4444" : "rgba(255,255,255,0.18)"} />
      <circle cx="11" cy="4.5" r="3.5" fill={active ? "#22c55e" : "rgba(255,255,255,0.35)"} />
      <ellipse cx="11" cy="14" rx="4.2" ry="3.5" fill={active ? "#22c55e" : "rgba(255,255,255,0.22)"} />
    </svg>
  );

  const tabs = [
    { slug: "cekilis",   label: d.nav.raffle, icon: "🎟️",  CustomIcon: null },
    { slug: "cark",      label: d.nav.wheel,  icon: "🎡",  CustomIcon: null },
    { slug: "zar",       label: d.nav.dice,   icon: "🎲",  CustomIcon: null },
    { slug: "yazi-tura", label: d.nav.coin,   icon: "🪙",  CustomIcon: null },
    { slug: "takim",     label: d.nav.teams,  icon: null,  CustomIcon: TeamIcon },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,10,16,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const href = `/${lang}/${tab.slug}`;
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={tab.slug}
              href={href}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-white" : "text-white/28 hover:text-white/50"
              }`}
            >
              <span className={`leading-none transition-transform flex items-center justify-center ${active ? "scale-110" : "scale-100"}`}
                style={{ height: 22 }}>
                {tab.CustomIcon ? <tab.CustomIcon active={active} /> : <span className="text-xl">{tab.icon}</span>}
              </span>
              <span className={`text-[9px] font-semibold tracking-wide uppercase ${active ? "text-white/80" : "text-white/28"}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full" style={{ width: 32, height: 2, background: "rgba(255,255,255,0.7)" }} />
              )}
            </Link>
          );
        })}

        {/* Language switcher */}
        <Link
          href={otherPath}
          className="flex flex-col items-center justify-center gap-1 px-2 py-3 text-white/28 hover:text-white/60 transition-colors border-l border-white/[0.05]"
        >
          <span className="text-sm leading-none">🌐</span>
          <span className="text-[9px] font-bold uppercase tracking-wide">{otherLang}</span>
        </Link>
      </div>
    </nav>
  );
}
