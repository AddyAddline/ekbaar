import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Devanagari, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import { PortalFooter } from "@/components/PortalChrome";

const noto = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoDev = Noto_Sans_Devanagari({
  variable: "--font-noto-dev",
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Cyber Satark — the cyber crime portal, rebuilt around the citizen",
  description:
    "An independent prototype that rebuilds India's cybercrime reporting journey around the incident: interrupt an active scam, build one verified case file, learn the tells, and stay with the case until it is finished.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${noto.variable} ${notoDev.variable} ${notoMono.variable} flex min-h-dvh flex-col`}
      >
        {children}
        <PortalFooter />
      </body>
    </html>
  );
}
