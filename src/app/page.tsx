"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

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
        </div>
      </section>
    </div>
  );
}
