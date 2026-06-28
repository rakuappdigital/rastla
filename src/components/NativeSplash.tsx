"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "raku" | "rastla";

// Görsel arka planları beyaz olarak hazırlandı.
// object-contain: logo tam görünür, kalan alan aynı beyaz (#fff) ile dolar → kusursuz.
const SPLASH: Record<Phase, { src: string; bg: string }> = {
  raku:   { src: "/images/raku-logo.png",    bg: "#ffffff" },
  rastla: { src: "/images/rastla-splash.png", bg: "#ffffff" },
};

export default function NativeSplash() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    const isNative = !!(window as unknown as { Capacitor?: unknown }).Capacitor;
    if (!isNative) return;

    const lang = navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
    setPhase("raku");

    const t1 = setTimeout(() => setPhase("rastla"), 2000);
    const t2 = setTimeout(() => {
      setPhase(null);
      router.replace(`/${lang}/cekilis`);
    }, 5000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [router]);

  if (!phase) return null;

  const { src, bg } = SPLASH[phase];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: bg,          // Görsel köşe rengiyle aynı — boşluk fark edilmez
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* object-contain: logo kırpılmaz, ortalanır, kalan alan bg rengiyle dolar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    </div>
  );
}
