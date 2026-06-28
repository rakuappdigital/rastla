"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Phase = "raku" | "rastla" | "done";

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

  if (!phase) return <div style={{ background: "#0a0a0f", position: "fixed", inset: 0 }} />;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-500"
      style={{ background: "#0a0a0f" }}
    >
      {phase === "raku" && (
        <Image
          src="/images/raku-logo.png"
          alt="Raku"
          width={260}
          height={60}
          className="object-contain"
          priority
        />
      )}
      {phase === "rastla" && (
        <Image
          src="/images/rastla-splash.png"
          alt="Luckura"
          width={280}
          height={280}
          className="object-contain"
          priority
        />
      )}
    </div>
  );
}
