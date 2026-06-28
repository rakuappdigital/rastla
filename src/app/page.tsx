"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const lang = navigator.language?.toLowerCase().startsWith("tr") ? "tr" : "en";
    router.replace(`/${lang}/cekilis`);
  }, [router]);
  return null;
}
