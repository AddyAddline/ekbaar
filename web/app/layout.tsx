import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "EkBaar — tell it once",
  description:
    "An independent prototype that rebuilds the cybercrime reporting journey around the incident: interrupt an active scam, build one verified case file, and stay with the case until it is finished.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${plex.variable} ${plexMono.variable} min-h-dvh flex flex-col`}
      >
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-line px-5 py-3 text-center">
          <p className="text-[11px] text-ink-faint tracking-wide">
            Independent hackathon prototype, not a government service. All data
            synthetic.
          </p>
        </footer>
      </body>
    </html>
  );
}
