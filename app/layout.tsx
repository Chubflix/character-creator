import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Character Creator - Chubflix",
  description: "AI-powered character sheet creator for TavernAI and ChubAI",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#141414',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
