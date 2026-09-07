/**
 * SwarSaarthi — Home Page
 *
 * A warm, human-centric, ultra-attractive landing page with:
 *  - Organic background shapes and responsive cursor follower
 *  - Hero section with interactive CTA & bilingual title
 *  - Live interactive sample word teaser card
 *  - "Why SwarSaarthi" Assistive Vision section
 *  - 3-Step "How It Works" interactive tilt cards
 *  - Application Features Showcase grid
 *  - Student Engineering Project story badge
 *  - Motivational Hindi quote & Call-to-action
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
    <div className="relative overflow-hidden">
      {/* ================================================================
          ORGANIC BACKGROUND DECORATIVE BLOBS
          ================================================================ */}
      <div className="pointer-events-none absolute top-10 -left-20 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl blob-shape -z-10" />
      <div className="pointer-events-none absolute top-96 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl blob-shape -z-10" style={{ animationDelay: "4s" }} />
      <div className="pointer-events-none absolute bottom-1/3 left-10 w-72 h-72 bg-accent/15 rounded-full blur-3xl blob-shape -z-10" style={{ animationDelay: "2s" }} />

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* App badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary-200/60 shadow-sm mb-6 animate-slide-up transform hover:-rotate-1 transition-transform cursor-pointer">
            <span className="text-sm">🗣️</span>
            <span className="text-xs sm:text-sm font-semibold text-primary">
              {t.tagline}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 text-primary-dark">
              Hindi Pronunciation
            </span>
          </div>

          {/* Main heading — bilingual */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary mb-4 leading-tight tracking-tight animate-slide-up">
            {t.heroTitle}
          </h1>

          {/* Hindi subtitle with hand-drawn underline accent */}
          <div className="mb-6 animate-slide-up">
            <span className="text-3xl sm:text-4xl font-hindi text-primary font-bold underline-hand-drawn px-2 py-1">
              आइए, साथ मिलकर बोलना सीखें
            </span>
          </div>

          {/* Description */}
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up font-normal">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up mb-10">
            <Link
              href="/practice"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-bold text-base sm:text-lg shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-200 group"
            >
              <span className="text-xl group-hover:scale-125 transition-transform duration-200">🎙️</span>
              <span>{t.ctaPractice}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-primary font-bold text-base sm:text-lg border-2 border-primary-200 hover:border-primary hover:bg-primary-50/50 shadow-sm active:scale-95 transition-all duration-200 group"
            >
              <span className="text-xl group-hover:rotate-12 transition-transform duration-200">📊</span>
              <span>{t.ctaProfile}</span>
            </Link>
          </div>

          {/* Disclaimer badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-warm-sand/80 border border-primary-100 text-xs text-text-secondary italic">
            ⓘ {t.disclaimer}
          </div>
        </div>
      </section>

      {/* ================================================================
          LIVE INTERACTIVE DEMO SECTION (TEASER)
          ================================================================ */}
      <section className="py-8 px-4">
        <HomeWordTeaser />
      </section>

      {/* ================================================================
          WHY SWARSAARTHI? (HUMAN EMPATHY & VISION SECTION)
          ================================================================ */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/15 text-secondary-dark uppercase tracking-wider mb-2 inline-block">
              🌱 Empowering Every Voice
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Designed with Empathy & Kindness
            </h2>
            <p className="text-base text-text-secondary mt-2">
              Speech articulation is a journey. SwarSaarthi provides a safe, patient space to practice Hindi pronunciation comfortably without any stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-8 h-full flex flex-col justify-between group border-l-4 border-l-primary">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    💖
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    Zero Judgment Space
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Practice as many times as you like. There are no timers pushing you and no social pressure — just you and your assistive guide.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-primary-100/60 text-xs font-medium text-primary">
                  100% Patient & Encouraging
                </div>
              </div>
            </TiltCard>

            {/* Card 2 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-8 h-full flex flex-col justify-between group border-l-4 border-l-secondary">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary-dark flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    🎧
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    Gentle Audio Guidance
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Listen to standard Hindi pronunciations repeatedly. Replay words slowly to catch phonetic nuances and syllabic flow.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-secondary/20 text-xs font-medium text-secondary-dark">
                  Clear Hindi Phonetics
                </div>
              </div>
            </TiltCard>

            {/* Card 3 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-8 h-full flex flex-col justify-between group border-l-4 border-l-accent">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-accent/15 text-amber-700 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                    🌱
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    Step-by-Step Progress
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Track your daily word completions and accuracy growth over time. Celebrate every small victory along the way!
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-accent/20 text-xs font-medium text-amber-700">
                  Celebrate Small Victories
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS SECTION (WITH INTERACTIVE TILT CARDS)
          ================================================================ */}
      <section className="py-16 sm:py-24 px-4 bg-white/80 backdrop-blur-sm border-y border-primary-100/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-primary-dark uppercase tracking-wider mb-2 inline-block">
              ✨ Simple 3-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              {t.howItWorksTitle}
            </h2>
            <p className="text-base text-text-secondary mt-2">
              Designed for intuitive use by anyone, anywhere, with simple one-tap controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1: Listen */}
            <TiltCard maxTilt={8}>
              <div className="card-warm p-8 text-center relative group h-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors shadow-inner">
                  <span className="text-4xl animate-float">👂</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-base font-bold mb-4 shadow-md">
                  1
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {t.step1Title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.step1Desc}
                </p>
              </div>
            </TiltCard>

            {/* Step 2: Speak */}
            <TiltCard maxTilt={8}>
              <div className="card-warm p-8 text-center relative group h-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center mb-6 group-hover:bg-secondary/25 transition-colors shadow-inner">
                  <span className="text-4xl animate-float" style={{ animationDelay: "0.5s" }}>
                    🎙️
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-base font-bold mb-4 shadow-md">
                  2
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {t.step2Title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.step2Desc}
                </p>
              </div>
            </TiltCard>

            {/* Step 3: Improve */}
            <TiltCard maxTilt={8}>
              <div className="card-warm p-8 text-center relative group h-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mb-6 group-hover:bg-accent/25 transition-colors shadow-inner">
                  <span className="text-4xl animate-float" style={{ animationDelay: "1s" }}>
                    📈
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center text-base font-bold mb-4 shadow-md">
                  3
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {t.step3Title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t.step3Desc}
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ================================================================
          FEATURES SHOWCASE GRID
          ================================================================ */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-primary-dark uppercase tracking-wider mb-2 inline-block">
              🌟 Core Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Built for Accessible Speech Practice
            </h2>
            <p className="text-base text-text-secondary mt-2">
              Everything you need to practice Hindi speech effectively in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-orange-100 text-primary">
                  📚
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Curated Hindi Words
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Carefully chosen vocabulary dataset focusing on key phonetic sounds, daily greetings, and common conversational terms.
                </p>
              </div>
            </TiltCard>

            {/* Feature 2 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-emerald-100 text-secondary-dark">
                  🎙️
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Single-Tap Recording
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Native browser audio capture configured for 16kHz speech recognition models with instant audio pulse animation.
                </p>
              </div>
            </TiltCard>

            {/* Feature 3 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-amber-100 text-amber-800">
                  🎯
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Visual Accuracy Feedback
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Get immediate score indicators showing how close your pronunciation was, with helpful encouragement to try again.
                </p>
              </div>
            </TiltCard>

            {/* Feature 4 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-purple-100 text-purple-800">
                  🌐
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Bilingual UI (En / Hi)
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Switch between English and Hindi interface text effortlessly anytime with our top navbar language toggle.
                </p>
              </div>
            </TiltCard>

            {/* Feature 5 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-blue-100 text-blue-800">
                  📊
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Personal Progress Dashboard
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Review your practiced word stats, accuracy trends, day streak, and focus on difficult words in your profile.
                </p>
              </div>
            </TiltCard>

            {/* Feature 6 */}
            <TiltCard maxTilt={6}>
              <div className="card-warm p-6 h-full flex flex-col">
                <div className="text-3xl mb-4 p-3 w-fit rounded-2xl bg-rose-100 text-rose-800">
                  🛡️
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  Private & Safe System
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Built purely as an assistive practice system for educational and personal improvement — not a medical diagnostic tool.
                </p>
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
          STUDENT PROJECT STORY & COMMUNITY CARD
          ================================================================ */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <TiltCard maxTilt={4}>
            <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-primary-50 via-warm-sand to-white border-2 border-primary-200/80 shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-4xl shrink-0 shadow-lg rotate-3">
                  🎓
                </div>
                <div className="text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-md bg-primary-100 text-primary-dark text-xs font-bold mb-2">
                    Final Year Engineering Capstone Project
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Built by Students, Powered by Purpose
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    SwarSaarthi (स्वर सारथी) was created as a final year engineering project to bridge the gap in speech assistive technology for Hindi speakers. Our mission is to make speech practice accessible, friendly, and empowering for individuals with speech articulation differences.
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ================================================================
          MOTIVATIONAL SECTION
          ================================================================ */}
      <section className="py-16 px-4 bg-warm-sand/80 border-t border-primary-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-5xl mb-4 animate-bounce-gentle">🌱</p>
          <blockquote className="text-2xl sm:text-4xl font-hindi text-text-primary font-bold leading-relaxed mb-4">
            &ldquo;हर शब्द एक कदम है, हर कदम एक उपलब्धि है&rdquo;
          </blockquote>
          <p className="text-base text-text-secondary font-medium">
            Every word is a step, every step is an achievement
          </p>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA BANNER
          ================================================================ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-linear-to-br from-primary via-primary-dark to-accent text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-hindi">
                क्या आप अभ्यास शुरू करने के लिए तैयार हैं?
              </h2>
              <p className="text-base sm:text-lg text-primary-100 mb-8 max-w-xl mx-auto">
                Step into the Practice Room and try your first word today!
              </p>
              <Link
                href="/practice"
                className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white text-primary font-extrabold text-lg shadow-lg hover:bg-warm-cream hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>🎙️</span>
                <span>{t.ctaPractice}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
