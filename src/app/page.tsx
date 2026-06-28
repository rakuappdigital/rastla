"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const lang = navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
    const isNative = !!(window as unknown as { Capacitor?: unknown }).Capacitor;

    if (isNative) {
      // iOS: rastla.png 3 sn tam ekran, sonra navige et
      setShowSplash(true);
      const t = setTimeout(() => {
        router.replace(`/${lang}/cekilis`);
      }, 3000);
      return () => clearTimeout(t);
    } else {
      // Web: direkt geç
      router.replace(`/${lang}/cekilis`);
    }
  }, [router]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50" style={{ background: "#0a0a0f" }}>
      <Image
        src="/images/rastla-splash.png"
        alt="Rastla"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
