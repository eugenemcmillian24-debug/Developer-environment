import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevBase — AI-Powered Dev Environment",
  description: "AI-powered mobile development environment with OpenRouter + Groq integration, voice-to-app, and intelligent code generation",
  keywords: ["mobile development", "AI", "Android", "Termux", "code generation", "Next.js", "Expo"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080c10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
