import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingControls from "@/components/FloatingControls";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Luckura",
  description: "Raffle, wheel, dice, coin flip and team builder",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={geist.variable}>
      <body className="font-[var(--font-geist)] antialiased"
        style={{ background: "var(--c-bg)", color: "var(--c-text)", overflow: "hidden" }}>
        <ThemeProvider>
          {/* Sabit üst kontrol çubuğu — scroll dışı */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0,
              zIndex: 100,
              paddingTop: "env(safe-area-inset-top)",
              pointerEvents: "none",
            }}
          >
            <div className="max-w-md mx-auto" style={{ position: "relative", height: 52 }}>
              <div style={{ position: "absolute", top: 8, right: 12, pointerEvents: "auto" }}>
                <FloatingControls />
              </div>
            </div>
          </div>

          {/* Kaydırılabilir içerik — üst bar ve nav dışında */}
          <div
            className="max-w-md mx-auto overflow-y-auto overflow-x-hidden"
            style={{
              height: "100dvh",
              paddingTop: "calc(52px + env(safe-area-inset-top))",
              paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
            }}
          >
            {children}
          </div>

          <Nav />
        </ThemeProvider>
      </body>
    </html>
  );
}
