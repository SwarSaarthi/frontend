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

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import TiltCard from "@/components/TiltCard";
import HomeWordTeaser from "@/components/HomeWordTeaser";

export default function Home() {
  const { t } = useLanguage();

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
