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
      <body className="font-[var(--font-geist)] antialiased overflow-hidden"
        style={{ background: "var(--c-bg)", color: "var(--c-text)" }}>
        <ThemeProvider>
          <div
            className="max-w-md mx-auto relative overflow-y-auto overflow-x-hidden"
            style={{
              height: "100dvh",
              paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
              paddingTop: "env(safe-area-inset-top)",
            }}
          >
            {children}
          </div>
          <FloatingControls />
          <Nav />
        </ThemeProvider>
      </body>
    </html>
  );
}
