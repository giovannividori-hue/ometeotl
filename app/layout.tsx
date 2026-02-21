// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, IBM_Plex_Mono } from "next/font/google";

const ethSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const ethMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ometeotl",
  description: "AI Risk & Epistemic Reliability Lab — Latin America",
  themeColor: "#E60028",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#E60028",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ethSans.variable} ${ethMono.variable}`}
      style={{ colorScheme: "light" }}
    >
      <body className="antialiased bg-[var(--bg)] text-[var(--fg)]">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}