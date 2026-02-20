import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ometeotl",
  description: "AI Risk & Epistemic Reliability Lab — Latin America",
  themeColor: "#0e4d57",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e4d57",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" style={{ colorScheme: "light" }}>
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />

        {/* Small but institutional: prevent layout jump + better rendering */}
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body
        className="antialiased"
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          overflowX: "hidden",
        }}
      >
        {/* Institutional accessibility (ETH-style discipline) */}
        <a
          href="#main"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "12px",
            padding: "10px 12px",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.15)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            zIndex: 9999,
          }}
          className="skip-link"
        >
          Skip to content
        </a>

        <main id="main">{children}</main>
      </body>
    </html>
  );
}