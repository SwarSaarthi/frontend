/**
 * SwarSaarthi — Home Page
 *
 * A warm, welcoming landing page with:
 *  - Hero section with app name, tagline, and CTAs
 *  - "How it works" section explaining the 3-step process
 *  - Positioned as an "AI-Powered Speech Assistive System" (NOT a diagnosis tool)
 *
 * This is a simple landing page. Further sections (testimonials,
 * features, team) can be added in future iterations.
 */

"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="gradient-warm py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* App badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-primary-100 mb-6 animate-slide-up">
            <span className="text-sm">🗣️</span>
            <span className="text-xs font-medium text-primary">
              {t.tagline}
            </span>
          </div>

          {/* Main heading — bilingual */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-3 leading-tight animate-slide-up">
            {t.heroTitle}
          </h1>

          {/* Hindi subtitle */}
          <p className="text-2xl sm:text-3xl font-hindi text-primary-light mb-6 animate-slide-up font-semibold">
            आइए, साथ मिलकर बोलना सीखें
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up">
            {t.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-semibold text-base shadow-md hover:bg-primary-dark hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <span className="text-lg">🎙️</span>
              {t.ctaPractice}
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-semibold text-base border-2 border-primary-200 hover:border-primary hover:bg-primary-50 active:scale-95 transition-all duration-200"
            >
              <span className="text-lg">📊</span>
              {t.ctaProfile}
            </Link>
          </div>

          {/* Disclaimer badge */}
          <p className="mt-8 text-xs text-text-muted italic animate-slide-up">
            ⓘ {t.disclaimer}
          </p>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS SECTION
          ================================================================ */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-12">
            {t.howItWorksTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1: Listen */}
            <div className="card-warm p-6 text-center group">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                <span className="text-3xl animate-float">👂</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t.step1Title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2: Speak */}
            <div className="card-warm p-6 text-center group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <span
                  className="text-3xl animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  🎙️
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t.step2Title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3: Improve */}
            <div className="card-warm p-6 text-center group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <span
                  className="text-3xl animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  📈
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t.step3Title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          MOTIVATIONAL SECTION
          ================================================================ */}
      <section className="py-12 sm:py-16 px-4 bg-warm-sand">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-4xl mb-4">🌱</p>
          <blockquote className="text-xl sm:text-2xl font-hindi text-text-primary italic leading-relaxed mb-3">
            &ldquo;हर शब्द एक कदम है, हर कदम एक उपलब्धि है&rdquo;
          </blockquote>
          <p className="text-sm text-text-secondary">
            Every word is a step, every step is an achievement
          </p>
        </div>
      </section>
    </div>
  );
}
