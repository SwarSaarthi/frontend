/**
 * SwarSaarthi — Root Layout
 *
 * Sets up:
 *  - Google Fonts: Poppins (UI) + Noto Sans Devanagari (Hindi text)
 *  - LanguageProvider for bilingual support
 *  - Navbar + Footer shared across all pages
 *  - SEO metadata
 */

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorFollower from "@/components/CursorFollower";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwarSaarthi - AI Powered Speech Assistive System | स्वर सारथी",
  description:
    "SwarSaarthi is an AI-powered speech assistive system that helps individuals improve their Hindi pronunciation through personalized practice and real-time feedback. This is an assistive tool, not a diagnostic system.",
  keywords: [
    "speech therapy",
    "Hindi pronunciation",
    "speech assistive",
    "articulation",
    "ASR",
    "TTS",
    "स्वर सारथी",
    "हिंदी उच्चारण",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm-cream text-text-primary">
        <LanguageProvider>
          <CursorFollower />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}


