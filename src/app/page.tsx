/**
 * SwarSaarthi — Home Page
 *
 * A warm, human-centric, ultra-attractive landing page featuring:
 *  - Distinct vibrant color theme for EVERY section with smooth background transitions
 *  - Sleek modern cards (rounded-xl, backdrop-blur translucent glass)
 *  - Prominent centered Real-Color watermark icon background overlays (opacity 25%-45%)
 *  - All text color styled as text-zinc-900 for high-contrast crisp readability
 *  - Fully reactive bilingual support via useLanguage(): when toggled, cards show ONLY the active language
 */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import TiltCard from "@/components/TiltCard";
import HomeWordTeaser from "@/components/HomeWordTeaser";

function SoundWaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M3 10v4M7 8v8M11 6v12M15 9v6M19 11v2" strokeLinecap="round" />
    </svg>
  );
}
function EarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.2-1 4-2.5 5.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M9 16c1.2 1.2 4.8 1.2 6 0" strokeLinecap="round" />
    </svg>
  );
}
function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" strokeLinecap="round" />
    </svg>
  );
}
function TrendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M4 16l6-6 4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const { t } = useLanguage();

  const steps = useMemo(
    () => [
      { n: "01", icon: EarIcon, title: t.step1Title, desc: t.step1Desc },
      { n: "02", icon: MicIcon, title: t.step2Title, desc: t.step2Desc },
      { n: "03", icon: TrendIcon, title: t.step3Title, desc: t.step3Desc },
    ],
    [t.step1Title, t.step1Desc, t.step2Title, t.step2Desc, t.step3Title, t.step3Desc],
  );

  return (
    <div>
      {/* HERO — editorial, left-aligned, paper bg */}
      <section className="px-4 sm:px-6">
        <div className="max-w-6xl mx-auto py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start">
            {/* Left: copy */}
            <div>
              {/* eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-stone-strong" />
                <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] font-semibold uppercase text-ink-soft">
                  <SoundWaveIcon className="w-3.5 h-3.5 text-clay" />
                  {t.tagline}
                </span>
              </div>

              <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold text-ink leading-[0.95] mb-4">
                {t.heroTitle}
                <span className="block text-clay mt-1 font-medium text-[22px] sm:text-[26px] tracking-tight font-hindi">
                  आइए, साथ मिलकर बोलना सीखें
                </span>
              </h1>

              <p className="text-[15px] sm:text-[16px] leading-7 text-ink-soft max-w-[52ch] mt-5">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-clay text-white text-sm font-semibold rounded-full hover:bg-clay-hover transition-colors duration-150"
                >
                  <MicIcon className="w-4 h-4" />
                  {t.ctaPractice}
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-line text-ink text-sm font-medium rounded-full hover:bg-mist hover:border-stone-strong transition-colors duration-150"
                >
                  <span className="w-4 h-4 rounded-full border border-ink-faint flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-faint" />
                  </span>
                  {t.ctaProfile}
                </Link>
              </div>

              <p className="mt-8 text-xs text-ink-faint flex items-start gap-2 max-w-[52ch]">
                <span className="mt-0.5 w-3 h-3 rounded-full border border-stone-strong flex items-center justify-center shrink-0 text-[8px] leading-none">i</span>
                <span>{t.disclaimer}</span>
              </p>
            </div>

            {/* Right: notebook card — no image, just type */}
            <div className="lg:pt-2">
              <div className="card p-6 sm:p-7">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] tracking-[0.12em] uppercase font-semibold text-ink-faint">
                    Today&apos;s word
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-mist border border-line text-ink-soft">1 / 15</span>
                </div>

                <div className="text-center py-4">
                  <p className="font-hindi text-[52px] sm:text-[56px] font-bold text-ink leading-none">नमस्ते</p>
                  <p className="text-sm text-ink-soft italic mt-2">Namaste — Hello / Greetings</p>
                  <div className="flex justify-center gap-1.5 mt-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                    <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                  </div>
                </div>

                <div className="rule my-6" />

                <div className="flex items-center gap-3 text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-full bg-clay-soft border border-line flex items-center justify-center">
                      <SoundWaveIcon className="w-3.5 h-3.5 text-clay" />
                    </span>
                    Listen
                  </span>
                  <span className="h-3 w-px bg-line" />
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-full bg-moss-soft border border-line flex items-center justify-center">
                      <MicIcon className="w-3.5 h-3.5 text-moss" />
                    </span>
                    Speak
                  </span>
                  <span className="ml-auto text-ink-faint">Tap mic to try</span>
                </div>
              </div>

              <p className="text-xs text-ink-faint mt-3 text-center">
                Preview — practice room uses the same card. No gradients, no gloss.
              </p>
            </div>
  return (
    <div className="relative overflow-hidden font-sans">
      {/* ================================================================
          1. HERO SECTION — Warm Terracotta & Sunset Glow Theme
          ================================================================ */}
      <section className="relative py-20 sm:py-28 px-4 bg-linear-to-b from-[#FFF5ED] via-[#FFE8D6] to-[#FFF0E5] transition-colors duration-700">
        {/* Background decorative ambient glow */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-250 h-75 bg-primary/10 rounded-full blur-3xl blob-shape z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-zinc-900 mb-4 leading-tight tracking-tight animate-slide-up">
            {t.heroTitle}
          </h1>

          {/* Hindi subtitle with hand-drawn underline accent */}
          <div className="mb-8 animate-slide-up">
            <span className="text-3xl sm:text-5xl font-hindi text-primary font-bold underline-hand-drawn px-3 py-1">
              आइए, साथ मिलकर बोलना सीखें
            </span>
          </div>

          {/* Description */}
          <p className="text-base sm:text-xl text-zinc-800 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up font-medium">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up mb-10">
            <Link
              href="/practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-primary text-white font-extrabold text-base sm:text-lg shadow-xl shadow-primary/25 hover:bg-primary-dark hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all duration-300 group"
            >
              <span className="text-xl group-hover:scale-125 transition-transform duration-200">🎙️</span>
              <span>{t.ctaPractice}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-white/90 backdrop-blur-md text-primary font-extrabold text-base sm:text-lg border-2 border-primary-200 hover:border-primary hover:bg-primary-50/60 shadow-md active:scale-95 transition-all duration-300 group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform duration-200">📊</span>
              <span>{t.ctaProfile}</span>
            </Link>
          </div>

          {/* Assistive Tool Notice */}
          <div className="inline-block px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200/60 text-xs font-semibold text-zinc-900 shadow-xs">
            ⓘ {t.disclaimer}
          </div>
        </div>
      </section>

      {/* ================================================================
          2. LIVE INTERACTIVE DEMO SECTION — Fresh Forest Sage Theme
          ================================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-linear-to-b from-[#FFF0E5] via-[#E2F0EA] to-[#D9EDE3] transition-colors duration-700 border-t border-secondary/20">
        <HomeWordTeaser />
      </section>

      {/* ================================================================
          3. WHY SWARSAARTHI? (HUMAN EMPATHY) — Warm Honey & Golden Amber Theme
          ================================================================ */}
      <section className="py-20 sm:py-28 px-4 bg-linear-to-b from-[#D9EDE3] via-[#FFF2D4] to-[#FFEBC2] transition-colors duration-700 border-t border-accent/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold px-4 py-1.5 rounded-full bg-amber-200/80 text-amber-950 uppercase tracking-wider mb-3 inline-block shadow-xs border border-amber-300/60">
              {t.empathyBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900">
              {t.empathyTitle}
            </h2>
            <p className="text-base text-zinc-800 mt-3 font-medium">
              {t.empathySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-8 h-full flex flex-col justify-between border border-white/80 shadow-lg hover:bg-white/70 transition-all group">
                {/* Centered Real-Color Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    💖
                  </span>
                </div>

                <div className="relative z-10 pt-2">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.empathyCard1Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.empathyCard1Desc}
                  </p>
                </div>
                <div className="relative z-10 mt-8 pt-4 border-t border-primary-200/60 text-xs font-bold text-primary">
                  {t.empathyCard1Tag}
                </div>
              </div>
            </TiltCard>

            {/* Card 2 */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-8 h-full flex flex-col justify-between border border-white/80 shadow-lg hover:bg-white/70 transition-all group">
                {/* Centered Real-Color Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🎧
                  </span>
                </div>

                <div className="relative z-10 pt-2">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.empathyCard2Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.empathyCard2Desc}
                  </p>
                </div>
                <div className="relative z-10 mt-8 pt-4 border-t border-secondary/30 text-xs font-bold text-secondary-dark">
                  {t.empathyCard2Tag}
                </div>
              </div>
            </TiltCard>

            {/* Card 3 */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-8 h-full flex flex-col justify-between border border-white/80 shadow-lg hover:bg-white/70 transition-all group">
                {/* Centered Real-Color Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🌱
                  </span>
                </div>

                <div className="relative z-10 pt-2">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.empathyCard3Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.empathyCard3Desc}
                  </p>
                </div>
                <div className="relative z-10 mt-8 pt-4 border-t border-amber-300/60 text-xs font-bold text-amber-900">
                  {t.empathyCard3Tag}
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ================================================================
          4. HOW IT WORKS SECTION — Earthy Rose & Terracotta Clay Theme
          ================================================================ */}
      <section className="py-20 sm:py-28 px-4 bg-linear-to-b from-[#FFEBC2] via-[#F8E2DC] to-[#F2D5CB] transition-colors duration-700 border-t border-primary-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold px-4 py-1.5 rounded-full bg-primary-100 text-primary-dark uppercase tracking-wider mb-3 inline-block shadow-xs border border-primary-200/60">
              {t.howItWorksBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900">
              {t.howItWorksTitle}
            </h2>
            <p className="text-base text-zinc-800 mt-3 font-medium">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Listen */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/55 backdrop-blur-md rounded-xl p-8 border border-white/80 shadow-lg hover:bg-white/75 transition-all group h-full flex flex-col justify-between">
                {/* Centered Real-Color Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    👂
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-extrabold shadow-md">
                    1
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-primary-50 text-primary uppercase tracking-wider">
                    {t.step1Label}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.step1Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.step1Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Step 2: Speak */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/55 backdrop-blur-md rounded-xl p-8 border border-white/80 shadow-lg hover:bg-white/75 transition-all group h-full flex flex-col justify-between">
                {/* Centered Real-Color Mic Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🎙️
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center text-lg font-extrabold shadow-md">
                    2
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-secondary/20 text-secondary-dark uppercase tracking-wider">
                    {t.step2Label}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.step2Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.step2Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Step 3: Improve */}
            <TiltCard maxTilt={8}>
              <div className="relative overflow-hidden bg-white/55 backdrop-blur-md rounded-xl p-8 border border-white/80 shadow-lg hover:bg-white/75 transition-all group h-full flex flex-col justify-between">
                {/* Centered Real-Color Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-9xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    📈
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-lg font-extrabold shadow-md">
                    3
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
                    {t.step3Label}
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-zinc-900 mb-3">
                    {t.step3Title}
                  </h3>
                  <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.step3Desc}
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. FEATURES SHOWCASE GRID — Rich Warm Stone Theme (FULLY REACTIVE BILINGUAL)
          ================================================================ */}
      <section className="py-20 sm:py-28 px-4 bg-linear-to-b from-[#F2D5CB] via-[#EFEAE2] to-[#E8E1D5] transition-colors duration-700 border-t border-[#DCD3C7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold px-4 py-1.5 rounded-full bg-[#DFD6C9] text-zinc-900 uppercase tracking-wider mb-3 inline-block shadow-xs border border-[#D5CBC0]">
              {t.featuresBadge}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900">
              {t.featuresTitle}
            </h2>
            <p className="text-base text-zinc-800 mt-3 font-medium">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    📚
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature1Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 2 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🎙️
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature2Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 3 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🎯
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature3Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 4 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🌐
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature4Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature4Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 5 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    📊
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature5Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature5Desc}
                  </p>
                </div>
              </div>
            </TiltCard>

            {/* Feature 6 */}
            <TiltCard maxTilt={6}>
              <div className="relative overflow-hidden bg-white/50 backdrop-blur-md rounded-xl p-7 h-full flex flex-col border border-white/80 shadow-md hover:bg-white/70 transition-all group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-8xl font-black select-none opacity-25 group-hover:scale-125 group-hover:opacity-45 transition-all duration-500">
                    🛡️
                  </span>
                </div>
                <div className="relative z-10 pt-2">
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature6Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                    {t.feature6Desc}
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — three columns with thin rules */}
      <section className="px-4 sm:px-6 border-t border-line bg-white">
        <div className="max-w-6xl mx-auto py-12 sm:py-16">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-ink">{t.howItWorksTitle}</h2>
            <span className="hidden sm:block h-px flex-1 bg-line ml-6" />
            <span className="text-xs text-ink-faint shrink-0">3 steps · 2 minutes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-line rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`p-6 sm:p-7 bg-white ${i !== 2 ? "sm:border-r border-b sm:border-b-0 border-line" : ""}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full border border-line flex items-center justify-center bg-mist">
                    <s.icon className="w-4 h-4 text-ink-soft" />
                  </span>
                  <span className="text-xs font-semibold tracking-widest text-ink-faint">{s.n}</span>
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">{s.title}</h3>
                <p className="text-sm leading-6 text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE — simple, no emoji */}
      <section className="px-4 sm:px-6 bg-mist border-y border-line">
        <div className="max-w-3xl mx-auto py-10 sm:py-12 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-stone-strong bg-white mb-4">
            <span className="text-clay font-serif text-lg leading-none">“</span>
          </div>
          <blockquote className="font-hindi text-xl sm:text-2xl font-semibold text-ink leading-relaxed">
            हर शब्द एक कदम है, हर कदम एक उपलब्धि है
          </blockquote>
          <p className="text-sm text-ink-soft mt-2">Every word is a step, every step is an achievement</p>
          <div className="w-10 h-px bg-stone-strong mx-auto mt-6" />
      {/* ================================================================
          6. STUDENT ENGINEERING PROJECT STORY — Sunset Peach Theme
          ================================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-linear-to-b from-[#E8E1D5] via-[#FFE5D9] to-[#FFD8C7] transition-colors duration-700 border-t border-[#F0CEBE]">
        <div className="max-w-4xl mx-auto">
          <TiltCard maxTilt={4}>
            <div className="p-8 sm:p-12 rounded-xl bg-white/60 backdrop-blur-md border border-white/90 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-9xl font-black select-none opacity-20 group-hover:scale-125 group-hover:opacity-35 transition-all duration-500">
                  🎓
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center text-3xl shrink-0 shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                  🎓
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-block px-3.5 py-1 rounded-md bg-primary-100 text-primary-dark text-xs font-extrabold mb-3">
                    {t.projectBadge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-3">
                    {t.projectTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-900 font-medium leading-relaxed">
                    {t.projectDesc}
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ================================================================
          7. MOTIVATIONAL QUOTE SECTION — Soft Emerald Leaf Theme
          ================================================================ */}
      <section className="py-20 px-4 bg-linear-to-b from-[#FFD8C7] via-[#D5EADF] to-[#FFF5ED] transition-colors duration-700 border-t border-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-5xl mb-4 animate-bounce-gentle">🌱</p>
          <blockquote className="text-2xl sm:text-4xl font-hindi text-zinc-900 font-extrabold leading-relaxed mb-4">
            &ldquo;हर शब्द एक कदम है, हर कदम एक उपलब्धि है&rdquo;
          </blockquote>
          <p className="text-base text-zinc-900 font-semibold">
            Every word is a step, every step is an achievement
          </p>
        </div>
      </section>
    </div>
  );
}
