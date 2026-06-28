import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",      // Statik HTML/CSS/JS → Capacitor için
  trailingSlash: true,   // /tr/cekilis → /tr/cekilis/index.html
  images: {
    unoptimized: true,   // Static export'ta Next.js image optimizer çalışmaz
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
