import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Rastla",
  description: "Çekiliş, çark, zar, yazı tura ve takım kurucu — hepsi bir arada",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={geist.variable}>
      <body className="bg-[#0a0a0f] text-white font-[var(--font-geist)] antialiased">
        <div className="max-w-md mx-auto min-h-screen pb-24 relative">
          {children}
        </div>
        <Nav />
      </body>
    </html>
  );
}
