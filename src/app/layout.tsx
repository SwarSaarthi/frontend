/**
 * SwarSaarthi — Root Layout
 *
 * Sets up:
 *  - Google Fonts:Plus Jakarta Sans (UI) + Noto Sans Devanagari (Hindi text)
 *  - Local Quicksand variable font for the main brand look
 *  - LanguageProvider for bilingual support
 *  - Navbar + Footer shared across all pages
 *  - SEO metadata
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Noto_Sans_Devanagari, Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// Quicksand variable — only weights actually used (400 regular, 600 semibold, 700 bold)
// One TTF serves all, but limiting range lets Next generate a smaller subset slice
// and avoids shipping 300 Light never used in UI.
const quicksand = localFont({
  src: [
    {
      path: "../../fonts/Quicksand-VariableFont_wght.ttf",
      weight: "400 700",
      style: "normal",
    },
  ],
  variable: "--font-quicksand",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// Noto Devanagari — only 400 + 600 needed (body + heading). 500/700 removed
// to halve Google font payload; next/font self-hosts so no runtime CDN hit.
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
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

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${plusJakarta.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
