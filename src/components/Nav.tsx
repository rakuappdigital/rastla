"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/cekilis",   label: "Çekiliş", icon: "🎟️" },
  { href: "/cark",      label: "Çark",    icon: "🎡" },
  { href: "/zar",       label: "Zar",     icon: "🎲" },
  { href: "/yazi-tura", label: "Yazı/Tura",icon: "🪙" },
  { href: "/takim",     label: "Takım",   icon: "👥" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f1a]/95 backdrop-blur border-t border-white/[0.06]">
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const active = path.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? "text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className={`text-[10px] font-medium tracking-wide ${active ? "text-white" : ""}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-[2px] rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
