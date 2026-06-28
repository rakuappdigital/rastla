"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Phase = "raku" | "rastla";

export default function Home() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    const lang = navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
    const isNative = !!(window as unknown as { Capacitor?: unknown }).Capacitor;

    if (!isNative) {
      router.replace(`/${lang}/cekilis`);
      return;
    }

    setPhase("raku");
    const t1 = setTimeout(() => setPhase("rastla"), 2000);
    const t2 = setTimeout(() => router.replace(`/${lang}/cekilis`), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [router]);

  if (!phase) return null;

  return (
    <div className="fixed inset-0" style={{ background: "#ffffff", zIndex: 9999 }}>
      <Image
        src={phase === "raku" ? "/images/raku-logo.png" : "/images/rastla-splash.png"}
        alt=""
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  );
}
