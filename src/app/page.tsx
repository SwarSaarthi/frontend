"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import TiltCard from "@/components/TiltCard";
import HomeWordTeaser from "@/components/HomeWordTeaser";

function SoundWaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      {...props}
    >
      <path d="M3 10v4M7 8v8M11 6v12M15 9v6M19 11v2" strokeLinecap="round" />
    </svg>
  );
}

function EarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2.2-1 4-2.5 5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M9 16c1.2 1.2 4.8 1.2 6 0" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" strokeLinecap="round" />
    </svg>
  );
}

function ProgressIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 16l6-6 4 4 6-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path
        d="M4 16l6-6 4 4 6-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SparklineMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 44" className={className} aria-hidden>
      <polyline
        className="sparkline-path"
        points="4,36 14,30 22,32 34,20 42,24 54,12 64,16 76,6 84,10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        className="sparkline-tip"
        cx="84"
        cy="10"
        r="3.4"
        fill="currentColor"
      />
    </svg>
  );
}

function ColorBridge({ from, to }: { from: string; to: string }) {
  return (
    <div
      className="home-blend"
      style={{ background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden
    />
  );
}

function WaveBars() {
  return (
    <div className="flex h-10 items-end justify-center gap-1">
      {[8, 16, 22, 12, 20, 10, 18, 14].map((h, i) => (
        <span
          key={i}
          className="bar-wave w-1 rounded-full bg-[#c45c3e]"
          style={{ height: h, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const rotatingWords = useMemo(
    () => [
      { hi: "नमस्ते", en: "Namaste - Hello" },
      { hi: "शुक्रिया", en: "Shukriya - Thank you" },
      { hi: "कृपया", en: "Kripya - Please" },
      { hi: "अभिनंदन", en: "Abhinandan - Congratulations" },
    ],
    [],
  );
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [rotatingWords.length]);

  const steps = useMemo(
    () => [
      {
        n: "01",
        icon: EarIcon,
        title: t.step1Title,
        desc: t.step1Desc,
        tint: "from-[#f6d7c8]/70 to-white/30",
        accent: "#c45c3e",
      },
      {
        n: "02",
        icon: MicIcon,
        title: t.step2Title,
        desc: t.step2Desc,
        tint: "from-[#d7e6dc]/80 to-white/30",
        accent: "#3f6f5c",
      },
      {
        n: "03",
        icon: TrendIcon,
        title: t.step3Title,
        desc: t.step3Desc,
        tint: "from-[#ead9a8]/70 to-white/30",
        accent: "#b8862a",
      },
    ],
    [
      t.step1Title,
      t.step1Desc,
      t.step2Title,
      t.step2Desc,
      t.step3Title,
      t.step3Desc,
    ],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((n) => (n + 1) % 3);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  const empathyCards = [
    {
      title: t.empathyCard1Title,
      desc: t.empathyCard1Desc,
      tag: t.empathyCard1Tag,
      icon: "💖",
      tint: "from-[#f3cfc6]/65 to-white/25",
      tagColor: "text-[#a24b38]",
    },
    {
      title: t.empathyCard2Title,
      desc: t.empathyCard2Desc,
      tag: t.empathyCard2Tag,
      icon: "🎧",
      tint: "from-[#d5e4ef]/75 to-white/25",
      tagColor: "text-[#3d5f78]",
    },
    {
      title: t.empathyCard3Title,
      desc: t.empathyCard3Desc,
      tag: t.empathyCard3Tag,
      icon: "🌱",
      tint: "from-[#d8e6d6]/75 to-white/25",
      tagColor: "text-[#3f6a4a]",
    },
  ];

  const featureCards = [
    {
      title: t.feature1Title,
      desc: t.feature1Desc,
      icon: "📚",
      tint: "from-[#f0d4c4]/70 to-white/20",
    },
    {
      title: t.feature2Title,
      desc: t.feature2Desc,
      icon: "🎙️",
      tint: "from-[#d6e4da]/75 to-white/20",
    },
    {
      title: t.feature3Title,
      desc: t.feature3Desc,
      icon: "🎯",
      tint: "from-[#ead7a6]/70 to-white/20",
    },
    {
      title: t.feature4Title,
      desc: t.feature4Desc,
      icon: "🌐",
      tint: "from-[#d3e0ee]/75 to-white/20",
    },
    {
      title: t.feature5Title,
      desc: t.feature5Desc,
      icon: "📊",
      tint: "from-[#e4d5c2]/70 to-white/20",
    },
    {
      title: t.feature6Title,
      desc: t.feature6Desc,
      icon: "🛡️",
      tint: "from-[#d9d3e6]/70 to-white/20",
    },
  ];

  return (
    <main className="relative overflow-hidden text-zinc-900">
      <section className="relative isolate overflow- bg-[#fff7f1] px-4 py-20 sm:px-6 lg:px-8">
        <Image
          src="/landingpageimage.png"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-[78%_center] sm:object-center opacity-68"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#fff7f1]/60 via-[#fff7f1]/35 to-[#fff7f1]/8"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                <span className="h-px w-8 bg-zinc-400" />
                <span className="inline-flex items-center gap-2">
                  <SoundWaveIcon className="h-3.5 w-3.5 text-[#c45c3e]" />
                  {t.tagline}
                </span>
              </div>

              <h1 className="text-4xl font-black leading-none tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                {t.heroTitle}
                <span className="mt-2 block text-[1.3rem] font-medium text-[#b85034] sm:text-[2rem]">
                  आइए, साथ मिलकर बोलना सीखें
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-zinc-700 sm:text-lg">
                {t.heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c45c3e] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c45c3e]/20 transition hover:bg-[#a94c32]"
                >
                  <MicIcon className="h-4 w-4" />
                  {t.ctaPractice}
                </Link>

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/50 px-6 py-3 text-sm font-semibold text-zinc-800 backdrop-blur-md transition hover:bg-white/80"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-zinc-400 text-[8px]">
                    i
                  </span>
                  {t.ctaProfile}
                </Link>
              </div>

              <p className="mt-8 flex max-w-xl items-start gap-2 text-xs text-zinc-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-400 text-[9px] text-zinc-600">
                  i
                </span>
                <span>{t.disclaimer}</span>
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="glass-card rounded-3xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    Today&apos;s word
                  </span>
                  <span className="rounded-full border border-white/70 bg-white/50 px-2.5 py-1 text-xs text-zinc-600">
                    1 / 15
                  </span>
                </div>

                <div className="rounded-2xl bg-[#f6d9cc]/70 p-6 text-center backdrop-blur-sm">
                  <p className="text-5xl font-black text-zinc-900 sm:text-6xl">
                    {rotatingWords[wordIndex].hi}
                  </p>
                  <p className="mt-2 text-sm italic text-zinc-600">
                    {rotatingWords[wordIndex].en}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        className="h-2 w-2 rounded-full bg-[#c45c3e] opacity-50"
                      />
                    ))}
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-white/70" />

                <div className="flex items-center gap-3 text-xs text-zinc-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3cfc4]">
                      <SoundWaveIcon className="h-3.5 w-3.5 text-[#c45c3e]" />
                    </span>
                    Listen
                  </span>
                  <span className="h-4 w-px bg-zinc-300" />
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7e8de]">
                      <MicIcon className="h-3.5 w-3.5 text-[#3f6f5c]" />
                    </span>
                    Speak
                  </span>
                  <span className="h-4 w-px bg-zinc-300" />
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7e8de]">
                      <ProgressIcon className="h-3.5 w-3.5 text-[#3f6f5c]" />
                    </span>
                    Improve
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ColorBridge from="#fff7f1" to="#f6e4d6" />

      <section className="bg-[#f6e4d6] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <HomeWordTeaser />
        </Reveal>
      </section>

      <ColorBridge from="#f6e4d6" to="#f3e4e0" />

      <section className="bg-[#f3e4e0] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-10 text-center">
            <h2 className="mt-5 text-3xl font-black text-zinc-900 sm:text-5xl">
              {t.empathyTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-700">
              {t.empathySubtitle}
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {empathyCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 70}>
                <TiltCard maxTilt={8}>
                  <div
                    className={`glass-card relative h-65 overflow-hidden rounded-2xl bg-linear-to-br p-7 ${card.tint}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
                      {card.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-extrabold text-zinc-900">
                        {card.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-zinc-700">
                        {card.desc}
                      </p>
                      <div
                        className={`mt-6 border-t border-white/60 pt-4 text-xs font-bold uppercase tracking-[0.08em] ${card.tagColor}`}
                      >
                        {card.tag}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ColorBridge from="#f3e4e0" to="#e4eee8" />

      <section className="bg-[#e4eee8] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-10 text-center">
            <h2 className="mt-5 text-3xl font-black text-zinc-900 sm:text-5xl">
              {t.howItWorksTitle}
            </h2>
            <p className="mt-4 text-base text-zinc-700">
              {t.howItWorksSubtitle}
            </p>
          </Reveal>

          <Reveal>
            <div className="glass-card mb-10 overflow-hidden rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const on = activeStep === index;
                  return (
                    <div key={step.n} className="flex flex-1 items-center">
                      <div className="flex w-full flex-col items-center text-center">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500"
                          style={{
                            background: on
                              ? step.accent
                              : "rgba(255,255,255,0.55)",
                            color: on ? "#fff" : step.accent,
                            borderColor: on
                              ? step.accent
                              : "rgba(255,255,255,0.7)",
                            transform: on ? "scale(1.06)" : "scale(1)",
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-3 text-sm font-bold text-zinc-800">
                          {step.title}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                          {step.n}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="relative mx-2 hidden h-px flex-1 overflow-hidden bg-[#b7c9bd] sm:block">
                          <span className="hiw-runner absolute top-1/2 h-1.5 w-8 -translate-y-1/2 rounded-full bg-[#3f6f5c]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-white/70 bg-white/35 px-4 py-5 text-center">
                {activeStep === 0 && (
                  <>
                    <WaveBars />
                    <p className="mt-3 text-sm text-zinc-700">{t.step1Desc}</p>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#3f6f5c] text-white">
                      <MicIcon className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm text-zinc-700">{t.step2Desc}</p>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <SparklineMark className="mx-auto h-10 w-20 text-[#b8862a]" />
                    <p className="mt-3 text-sm text-zinc-700">{t.step3Desc}</p>
                  </>
                )}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const on = activeStep === index;
              return (
                <Reveal key={step.n} delay={index * 70}>
                  <TiltCard maxTilt={8}>
                    <div
                      className={`glass-card relative h-full overflow-hidden rounded-2xl bg-linear-to-br p-7 ${step.tint}`}
                      style={{
                        outline: on ? `2px solid ${step.accent}` : undefined,
                        outlineOffset: 2,
                      }}
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-white"
                          style={{ background: step.accent }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                          {step.n}
                        </span>
                      </div>
                      <div className="mb-3 flex items-center gap-2 text-zinc-600">
                        <Icon
                          className="h-4 w-4"
                          style={{ color: step.accent }}
                        />
                        <span className="text-xs font-bold uppercase tracking-[0.08em]">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-zinc-700">
                        {step.desc}
                      </p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ColorBridge from="#e4eee8" to="#e6eef3" />

      <section className="bg-[#e6eef3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-12 text-center">
            <h2 className="mt-5 text-3xl font-black text-zinc-900 sm:text-5xl">
              {t.featuresTitle}
            </h2>
            <p className="mt-4 text-base text-zinc-700">{t.featuresSubtitle}</p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 50}>
                <TiltCard maxTilt={8}>
                  <div
                    className={`glass-card relative h-50 overflow-hidden rounded-2xl bg-linear-to-br p-7 ${feature.tint}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
                      {feature.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-extrabold text-zinc-900">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-sm leading-6 text-zinc-700">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ColorBridge from="#e6eef3" to="#ece6d8" />

      {/* <section className="bg-[#ece6d8] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass-card mx-auto max-w-4xl rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#c45c3e] text-3xl shadow-lg shadow-[#c45c3e]/20">
                🎓
              </div>
              <div className="text-center md:text-left">
                <span className="inline-block rounded-md bg-[#f3d7c8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a4634]">
                  {t.projectBadge}
                </span>
                <h3 className="mt-3 text-2xl font-black text-zinc-900 sm:text-3xl">
                  {t.projectTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
                  {t.projectDesc}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section> */}

      <ColorBridge from="#ece6d8" to="#f4eee4" />

      <section className="bg-[#f4eee4] px-4 pb-10 sm:px-6 lg:px-8 relative">
        <Image
          src="/progressBar.png"
          alt="Progress bar"
          fill
          className="absolute inset-0 -my-10 object-contain opacity-60"
          priority
        />
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="relative mx-auto w-full h-48 sm:h-56 md:h-72">
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
              <blockquote className="text-2xl font-black leading-relaxed text-zinc-900 sm:text-4xl">
                हर शब्द एक कदम है, हर कदम एक उपलब्धि है
              </blockquote>
              <p className="mt-4 text-base text-zinc-800">
                Every word is a step, every step is an achievement.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
