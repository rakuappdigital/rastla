"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/cekilis",   label: "Çekiliş", icon: "🎟️" },
  { href: "/cark",      label: "Çark",    icon: "🎡" },
  { href: "/zar",       label: "Zar",     icon: "🎲" },
  { href: "/yazi-tura", label: "Yazı/Tura", icon: "🪙" },
  { href: "/takim",     label: "Takım",   icon: "👥" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb"
      style={{
        background: "rgba(10,10,16,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const active = path.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-white" : "text-white/28 hover:text-white/50"
              }`}
            >
              <span className={`text-xl leading-none transition-transform ${active ? "scale-110" : "scale-100"}`}>
                {tab.icon}
              </span>
              <span
                className={`text-[9px] font-semibold tracking-wide uppercase transition-colors ${
                  active ? "text-white/80" : "text-white/28"
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: 32, height: 2, background: "rgba(255,255,255,0.7)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
