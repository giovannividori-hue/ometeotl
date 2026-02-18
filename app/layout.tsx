import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ometeotl",
  description: "AI Risk & Epistemic Reliability Lab — Latin America",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
