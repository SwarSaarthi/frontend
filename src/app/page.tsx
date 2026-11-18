"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
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

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Bespoke Clinical & Assistive SVG Icons (No Emojis) ---------- */
function SproutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
      <path d="M12 15c-3 0-5.5-2-5.5-5.5 3 0 5.5 2 5.5 5.5Z" />
    </svg>
  );
}

function HeadphonesAcousticIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function HeartHandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ShieldPatientIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LipBiomechanicsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 12c3.5-3.5 6.5-5 9.5-2 3-3 6-1.5 9.5 2-3.5 3.5-6.5 5.5-9.5 5.5S6 15.5 2.5 12Z" />
      <path d="M6 12c2.5 1.8 4 2.2 6 2.2s3.5-.4 6-2.2c-2.5-.8-4-1-6-1s-3.5.2-6 1Z" />
    </svg>
  );
}

function VocabularyLayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m4 6 8-4 8 4-8 4-8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 18 8 4 8-4" />
    </svg>
  );
}

function DocumentWordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h3" />
    </svg>
  );
}

function ChatBubbleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h8" />
    </svg>
  );
}

function TargetPrecisionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

function BrainCircuitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" />
      <path d="M9 21h6" />
      <path d="M12 6v3M10 8l2 2 2-2" />
    </svg>
  );
}

function MicrophoneStudioIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v4" />
      <circle cx="12" cy="21" r="2" />
    </svg>
  );
}

function BarChartActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 16v-4" />
      <path d="M11 16V8" />
      <path d="M15 16v-6" />
      <path d="M19 16V5" />
    </svg>
  );
}

function FlameStreakIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 14.5A4.5 4.5 0 0 0 13 19a4.5 4.5 0 0 0 4.5-4.5c0-2.5-2-4.5-3-6.5-.5 1.5-1.5 2-2.5 2-1 0-1.5-1-1.5-2.5 0-1.5.5-3 2-4.5-4 1-7 4.5-4 11Z" />
    </svg>
  );
}

function BulbLightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.8 3.5 6h7c2.1-1.2 3.5-3.4 3.5-6a7 7 0 0 0-7-7Z" />
    </svg>
  );
}

function MicroscopeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="m9 14 3-3-3-3-3 3 3 3Z" />
      <path d="m12 11 4.5 4.5" />
    </svg>
  );
}

function TonguePlacementIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8c4-4 12-4 16 0" />
      <path d="M7 11c0 4 2.5 7 5 7s5-3 5-7" />
      <path d="M12 11v4" />
    </svg>
  );
}

function AirflowBreezeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 8h12a3 3 0 1 0-3-3" />
      <path d="M2 13h17a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M4 18h7a2 2 0 1 0-2-2" />
    </svg>
  );
}

function LipsContourIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12c3-3 6-4 9-2 3-2 6-1 9 2-3 3-6 5-9 5s-6-2-9-5Z" />
    </svg>
  );
}

function GraduationBadgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

/* ---------- Senior Scroll-Linked Animated Card Component ---------- */
function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hoverLift = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.62,
        delay: delay * 0.001,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hoverLift
          ? {
              y: -5,
              transition: { duration: 0.22, ease: "easeOut" },
            }
          : undefined
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Scroll-linked progress rail ---------- */
function ScrollRail() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const height = h.scrollHeight - h.clientHeight;
        setPct(height > 0 ? (scrolled / height) * 100 : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.75 bg-transparent">
      <div
        className="h-full bg-[#c45c3e] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
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
        transition: `opacity 0.6s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 0.6s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Splits a line into words and fades them in one by one, for a single
   deliberate moment rather than scattered per-section motion. */
function WordReveal({
  text,
  className = "",
  baseDelay = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: shown ? 1 : 0,
            filter: shown ? "blur(0px)" : "blur(4px)",
            transform: shown ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 0.5s ease ${baseDelay + i * step}ms, filter 0.5s ease ${baseDelay + i * step}ms, transform 0.5s ease ${baseDelay + i * step}ms`,
          }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
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

const PHRASE_TICKER = [
  { hi: "शृंखला", en: "Shrinkhla - Series / Chain" },
  { hi: "प्रतिस्पर्धा", en: "Pratispardha - Competition" },
  { hi: "स्वास्थ्याधिकार", en: "Swasthyaadhikaar - Right to Health" },
  { hi: "अंतर्राष्ट्रीय", en: "Antarraashtriya - International" },
  { hi: "दृष्टिकोण", en: "Drishtikon - Perspective" },
  { hi: "पुनरुत्थान", en: "Punarutthaan - Revival / Resurrection" },
  { hi: "आत्मविश्वासी", en: "Aatmavishwaasi - Self-confident" },
  { hi: "स्पष्टीकरण", en: "Spashteekaran - Clarification" },
  { hi: "उत्कृष्टता", en: "Utkrishtata - Excellence" },
  { hi: "जीजीविषा", en: "Jeejeevisha - Strong Will to Live" },
  { hi: "कर्तव्यपरायणता", en: "Kartavyaparayanata - Devotion to Duty" },
];

function PhraseTicker() {
  const items = [
    ...PHRASE_TICKER,
    ...PHRASE_TICKER,
    ...PHRASE_TICKER,
    ...PHRASE_TICKER,
  ];
  return (
    <div className="ticker-mask relative overflow-hidden py-2">
      <div className="ticker-track flex w-max items-center gap-8">
        {items.map((p, i) => (
          <span
            key={i}
            className="flex items-baseline gap-2 whitespace-nowrap text-sm"
          >
            <span className="font-bold text-zinc-800">{p.hi}</span>
            <span className="text-zinc-500">{p.en}</span>
            <span className="ml-6 text-[#c45c3e]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   "How it works" demo panels.
   Each one is a small, honest re-enactment of the real screen
   flow rather than an abstract loading animation.
   ============================================================ */

/* ============================================================
   DEVANAGARI PHONETIC SPECIMENS DATASET
   Clinically accurate places of articulation for Hindi speech.
   ============================================================ */
const PHONETIC_SPECIMENS = [
  {
    key: "dental",
    titleHi: "दन्त्य वर्ण (Dental)",
    titleEn: "Dental Phonemes",
    symbols: "त · थ · द · ध · न",
    exampleHi: "नमस्ते",
    exampleEn: "Namaste",
    tongueHeight: 88,
    lipOpening: 45,
    airflowHi: "अल्पप्राण / महाप्राण",
    airflowEn: "Controlled Dental Airflow",
    actionHi:
      "जीभ की नोक को ऊपरी सामने वाले दांतों (incisors) के पिछले सिरे से स्पर्श करें और सांस का प्रवाह सुचारु रखें।",
    actionEn:
      "Tip of tongue touches the back of upper front teeth with smooth, steady air release.",
    accent: "#c45c3e",
    tagHi: "दन्त स्पर्श",
    tagEn: "Dental Contact",
  },
  {
    key: "retroflex",
    titleHi: "मूर्धन्य वर्ण (Retroflex)",
    titleEn: "Retroflex Phonemes",
    symbols: "ट · ठ · ड · ढ · ण · र",
    exampleHi: "टोकरी",
    exampleEn: "Tokri",
    tongueHeight: 94,
    lipOpening: 58,
    airflowHi: "कठोर तालू प्रतिक्षेप",
    airflowEn: "Retroflex Flutter",
    actionHi:
      "जीभ की नोक को हल्का ऊपर मोड़कर कठोर तालू के ऊपरी हिस्से को स्पर्श करें और झटके से नीचे लाएं।",
    actionEn:
      "Tongue tip curls upward to contact the hard palate and snaps downward rapidly.",
    accent: "#b8862a",
    tagHi: "मूर्धा कंपन",
    tagEn: "Palatal Snap",
  },
  {
    key: "bilabial",
    titleHi: "ओष्ठ्य वर्ण (Bilabial)",
    titleEn: "Bilabial Phonemes",
    symbols: "प · फ · ब · भ · म",
    exampleHi: "पानी",
    exampleEn: "Paani",
    tongueHeight: 32,
    lipOpening: 85,
    airflowHi: "ओष्ठ संपीड़न व मुक्ति",
    airflowEn: "Bilabial Release",
    actionHi:
      "दोनों होंठों को आपस में पूरी तरह मिलाएँ, हवा का हल्का दबाव बनाएं और फिर तुरंत होंठ खोलकर ध्वनि निकालें।",
    actionEn:
      "Both lips seal completely, build gentle intra-oral pressure, and pop cleanly open.",
    accent: "#3f6f5c",
    tagHi: "ओष्ठ मिलन",
    tagEn: "Lip Seal",
  },
  {
    key: "palatal",
    titleHi: "तालव्य वर्ण (Palatal)",
    titleEn: "Palatal Phonemes",
    symbols: "च · छ · ज · झ · य · श",
    exampleHi: "चावल",
    exampleEn: "Chawal",
    tongueHeight: 76,
    lipOpening: 62,
    airflowHi: "तालू संकुचन",
    airflowEn: "Alveolar Flow",
    actionHi:
      "जीभ के बीच के हिस्से को ऊपर उठाकर कठोर तालू के पास लाएं और किनारों से हवा को बहने दें।",
    actionEn:
      "Middle blade of the tongue elevates towards the hard palate with lateral airflow.",
    accent: "#3d5f78",
    tagHi: "तालु संस्पर्श",
    tagEn: "Alveolar Arch",
  },
  {
    key: "velar",
    titleHi: "कण्ठ्य वर्ण (Velar)",
    titleEn: "Velar Phonemes",
    symbols: "क · ख · ग · घ",
    exampleHi: "कमल",
    exampleEn: "Kamal",
    tongueHeight: 45,
    lipOpening: 68,
    airflowHi: "कोमल तालू अवरोध",
    airflowEn: "Velar Release",
    actionHi:
      "जीभ के पिछले हिस्से को कोमल तालू (soft palate) से स्पर्श कराएं और कण्ठ से सुचारु वायु प्रवाह छोड़ें।",
    actionEn:
      "Back of the tongue contacts the soft palate before air is released cleanly from the pharynx.",
    accent: "#8a4634",
    tagHi: "कण्ठ नाद",
    tagEn: "Pharyngeal Flow",
  },
];

/* ============================================================
   EMPATHY & ANIMATED SPECIMEN ACCENTS
   ============================================================ */

function EmpathyCalmRipple() {
  return (
    <svg className="w-5 h-5 text-[#a24b38]" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <motion.circle
        cx="12"
        cy="12"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.8, 0.25, 0.8] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function EmpathyAcousticWave() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[4, 11, 7].map((h, i) => (
        <motion.span
          key={i}
          className="w-1 bg-[#3d5f78] rounded-full"
          animate={{ height: ["3px", `${h}px`, "3px"] }}
          transition={{
            duration: 1.2 + i * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function EmpathyGrowthPulse() {
  return (
    <svg className="w-5 h-5 text-[#3f6a4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <motion.path
        d="M12 21V11M12 11C12 7 8 5 4 5C4 9 7 12 12 12M12 11C12 7 16 5 20 5C20 9 17 12 12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ pathLength: [0.85, 1, 0.85], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

const VOCAL_TRACT_DATA: Record<
  string,
  {
    tonguePath: string;
    targetPoint: { cx: number; cy: number };
    labelEn: string;
    labelHi: string;
  }
> = {
  dental: {
    tonguePath: "M 20 48 C 24 38, 28 22, 38 21 C 52 24, 85 36, 120 40 L 155 48",
    targetPoint: { cx: 38, cy: 21 },
    labelEn: "Dental Touch (Teeth Contact)",
    labelHi: "दन्त स्पर्श (अग्र दन्त)",
  },
  retroflex: {
    tonguePath: "M 20 48 C 32 44, 48 34, 62 16 C 70 18, 86 34, 122 40 L 155 48",
    targetPoint: { cx: 62, cy: 16 },
    labelEn: "Retroflex Curling (Hard Palate)",
    labelHi: "मूर्धा संस्पर्श (कठोर तालू)",
  },
  bilabial: {
    tonguePath: "M 20 48 C 38 42, 68 40, 95 40 C 122 40, 140 44, 155 48",
    targetPoint: { cx: 16, cy: 26 },
    labelEn: "Bilabial Closure (Lips Sealed)",
    labelHi: "ओष्ठ संपीड़न (द्विओष्ठ)",
  },
  palatal: {
    tonguePath: "M 20 48 C 42 42, 64 24, 82 17 C 102 22, 126 36, 155 48",
    targetPoint: { cx: 82, cy: 17 },
    labelEn: "Palatal Arch (Roof Elevation)",
    labelHi: "तालु संस्पर्श (मध्य तालू)",
  },
  velar: {
    tonguePath: "M 20 48 C 42 45, 75 42, 95 34 C 112 26, 122 17, 142 22 L 155 48",
    targetPoint: { cx: 122, cy: 17 },
    labelEn: "Velar Closure (Soft Palate)",
    labelHi: "कण्ठ नाद (कोमल तालू)",
  },
};

function VocalTractIllustration({
  specimenKey,
  accent,
}: {
  specimenKey: string;
  accent: string;
}) {
  const { lang } = useLanguage();
  const data = VOCAL_TRACT_DATA[specimenKey] || VOCAL_TRACT_DATA.dental;

  return (
    <div className="rounded-2xl bg-stone-50 border border-stone-200/70 p-3.5 mb-4">
      <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 mb-2">
        <span className="uppercase tracking-wider">
          {lang === "hi"
            ? "गतिक मुख-विवर एवं जिह्वा स्थिति"
            : "Dynamic Vocal Tract Kinematics"}
        </span>
        <span className="font-bold font-hindi" style={{ color: accent }}>
          {lang === "hi" ? data.labelHi : data.labelEn}
        </span>
      </div>

      <div className="relative w-full h-22 sm:h-24 flex items-center justify-center overflow-hidden">
        <svg className="w-full max-w-xs h-full" viewBox="0 0 170 56" fill="none">
          {/* Static Anatomy: Hard Palate & Soft Palate Roof */}
          <path
            d="M 16 16 C 26 13, 50 11, 80 13 C 110 15, 134 21, 155 34"
            stroke="#a8a29e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Incisors / Teeth marker */}
          <path d="M 28 15 L 28 22" stroke="#78716c" strokeWidth="2.5" strokeLinecap="round" />

          {/* Morphing Dynamic Tongue Contour */}
          <motion.path
            d={data.tonguePath}
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            fill={accent}
            fillOpacity={0.16}
            animate={{ d: data.tonguePath }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Dynamic Articulatory Target Indicator */}
          <motion.circle
            cx={data.targetPoint.cx}
            cy={data.targetPoint.cy}
            r="4.5"
            fill={accent}
            animate={{
              cx: data.targetPoint.cx,
              cy: data.targetPoint.cy,
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <motion.circle
            cx={data.targetPoint.cx}
            cy={data.targetPoint.cy}
            r="8"
            stroke={accent}
            strokeWidth="1"
            strokeDasharray="2 2"
            animate={{
              cx: data.targetPoint.cx,
              cy: data.targetPoint.cy,
              scale: [0.9, 1.4, 0.9],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>
      </div>
    </div>
  );
}

/* ============================================================
   PILLAR & BENTO ANIMATED SVG DIAGRAMS
   ============================================================ */

function MotorMirroringDiagram() {
  return (
    <div className="h-10 w-full mb-3 rounded-xl bg-[#c45c3e]/5 border border-[#c45c3e]/15 flex items-center justify-center overflow-hidden px-3">
      <svg className="w-full h-8" viewBox="0 0 160 32" fill="none">
        <motion.path
          d="M 10 16 Q 40 4, 80 16 T 150 16"
          stroke="#c45c3e"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              "M 10 16 Q 40 4, 80 16 T 150 16",
              "M 10 16 Q 40 28, 80 16 T 150 16",
              "M 10 16 Q 40 4, 80 16 T 150 16",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 10 16 Q 40 28, 80 16 T 150 16"
          stroke="#c45c3e"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          strokeOpacity={0.6}
          fill="none"
          strokeLinecap="round"
          animate={{
            d: [
              "M 10 16 Q 40 28, 80 16 T 150 16",
              "M 10 16 Q 40 4, 80 16 T 150 16",
              "M 10 16 Q 40 28, 80 16 T 150 16",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

function NoiseFilterDiagram() {
  return (
    <div className="h-10 w-full mb-3 rounded-xl bg-[#3f6f5c]/5 border border-[#3f6f5c]/15 flex items-center justify-center overflow-hidden px-3">
      <svg className="w-full h-8" viewBox="0 0 160 32" fill="none">
        <path
          d="M 10 26 L 45 26 Q 80 2, 115 26 L 150 26"
          stroke="#3f6f5c"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <motion.line
          x1="80"
          y1="4"
          x2="80"
          y2="28"
          stroke="#3f6f5c"
          strokeWidth="1.5"
          strokeDasharray="2 2"
          animate={{ x1: [55, 105, 55], x2: [55, 105, 55] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <circle cx="80" cy="14" r="2.5" fill="#3f6f5c" />
      </svg>
    </div>
  );
}

function AnatomicalTargetDiagram() {
  return (
    <div className="h-10 w-full mb-3 rounded-xl bg-[#b8862a]/5 border border-[#b8862a]/15 flex items-center justify-center overflow-hidden px-3">
      <svg className="w-full h-8" viewBox="0 0 160 32" fill="none">
        <line x1="20" y1="16" x2="140" y2="16" stroke="#b8862a" strokeWidth="1" strokeOpacity={0.4} />
        <line x1="80" y1="4" x2="80" y2="28" stroke="#b8862a" strokeWidth="1" strokeOpacity={0.4} />
        <circle cx="80" cy="16" r="10" stroke="#b8862a" strokeWidth="1.2" strokeDasharray="3 3" />
        <motion.circle
          cx="80"
          cy="16"
          r="5"
          stroke="#b8862a"
          strokeWidth="1.8"
          fill="#b8862a"
          fillOpacity={0.2}
          animate={{ scale: [0.8, 1.25, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

function AnimatedLipSpreadContour() {
  return (
    <div className="flex items-center justify-center my-3 py-1.5 bg-stone-50/80 rounded-2xl border border-stone-200/50">
      <svg className="w-44 h-9" viewBox="0 0 160 36" fill="none">
        <motion.path
          d="M 25 18 C 50 14, 70 12, 80 14 C 90 12, 110 14, 135 18"
          stroke="#c45c3e"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            d: [
              "M 25 18 C 50 15, 70 13, 80 15 C 90 13, 110 15, 135 18",
              "M 15 18 C 45 11, 70 9, 80 11 C 90 9, 115 11, 145 18",
              "M 25 18 C 50 15, 70 13, 80 15 C 90 13, 110 15, 135 18",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 25 18 C 50 24, 70 26, 80 26 C 90 26, 110 24, 135 18"
          stroke="#c45c3e"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            d: [
              "M 25 18 C 50 22, 70 24, 80 24 C 90 24, 110 22, 135 18",
              "M 15 18 C 45 27, 70 29, 80 29 C 90 29, 115 27, 145 18",
              "M 25 18 C 50 22, 70 24, 80 24 C 90 24, 110 22, 135 18",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.ellipse
          cx="80"
          cy="19"
          rx="18"
          ry="3.5"
          fill="#c45c3e"
          fillOpacity={0.14}
          animate={{
            rx: [14, 24, 14],
            ry: [2.5, 5, 2.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   REAL THERAPY PIPELINE DEMO PANELS
   Authentic representations of SwarSaarthi's actual 3-stage flow
   ============================================================ */

function ObservationPipelineDemo({
  speed,
  onSpeedChange,
}: {
  speed: number;
  onSpeedChange: (s: number) => void;
}) {
  const { lang } = useLanguage();
  return (
    <div className="text-left space-y-4">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
            {lang === "hi"
              ? "3D ओष्ठ-संचालन व वाक् श्रवण दृश्य"
              : "3D Lip-Sync & Acoustic Viewport"}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-zinc-500 bg-white px-2.5 py-1 rounded-full border border-stone-200/80">
          Neural Voice: SwaraNeural
        </span>
      </div>

      {/* Target Specimen Preview */}
      <div className="rounded-2xl border border-stone-200/90 bg-white/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              {lang === "hi" ? "लक्ष्य अभ्यास वाक्य" : "Target Practice Phrase"}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-hindi text-zinc-900 mt-0.5">
              नमस्ते, आप कैसे हैं?
            </div>
            <div className="text-xs text-zinc-500 italic mt-0.5">
              Namaste, aap kaise hain?
            </div>
          </div>

          {/* Interactive Speed Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/70">
            {[0.5, 0.75, 1.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                  speed === s
                    ? "bg-[#c45c3e] text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Animated SVG lip-sync & soundwave graphic whose pulse rate responds to selected speed */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-[#c45c3e]" viewBox="0 0 28 28" fill="none">
              <motion.path
                d="M4 14 C 9 9, 19 9, 24 14 C 19 19, 9 19, 4 14 Z"
                fill="currentColor"
                fillOpacity={0.15}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={{
                  d: [
                    "M4 14 C 9 11, 19 11, 24 14 C 19 17, 9 17, 4 14 Z",
                    "M4 14 C 9 7, 19 7, 24 14 C 19 21, 9 21, 4 14 Z",
                    "M4 14 C 9 11, 19 11, 24 14 C 19 17, 9 17, 4 14 Z",
                  ],
                }}
                transition={{
                  duration: 1.2 / speed,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <motion.ellipse
                cx="14"
                cy="14"
                rx="4.5"
                ry="2"
                fill="#c45c3e"
                animate={{
                  ry: [1.5, 3.5, 1.5],
                }}
                transition={{
                  duration: 1.2 / speed,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </svg>
            <div className="flex items-center gap-1 h-6">
              {[0.3, 0.75, 1.0, 0.6, 0.85, 0.45, 0.9, 0.5].map((scale, i) => (
                <motion.span
                  key={i}
                  className="w-1 bg-[#c45c3e] rounded-full"
                  animate={{
                    height: ["3px", `${Math.round(scale * 20)}px`, "3px"],
                  }}
                  transition={{
                    duration: (1.2 / speed) * 0.75,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: [0.22, 1, 0.36, 1],
                    delay: ((i * 0.07) / speed) % 0.4,
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-zinc-600">
              {lang === "hi"
                ? `ओष्ठ समकालन (${speed}× गति)`
                : `Lip-Sync & Wave (${speed}× cadence)`}
            </span>
          </div>

          <div className="text-[10px] text-zinc-500 font-mono bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/50">
            Kinematic Frame Rate: 60fps
          </div>
        </div>

        {/* Live Gauges */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-[10px] text-zinc-500 block font-medium">
              {lang === "hi" ? "ओष्ठ विवर" : "Lip Parting"}
            </span>
            <span className="font-bold text-zinc-800 text-sm">84%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-[10px] text-zinc-500 block font-medium">
              {lang === "hi" ? "जिह्वा उत्थान" : "Tongue Elevation"}
            </span>
            <span className="font-bold text-zinc-800 text-sm">76%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-zinc-500 block font-medium">
              {lang === "hi" ? "दर्पण तंत्रिका प्रभाव" : "Mirror Neurons"}
            </span>
            <span className="font-bold text-[#c45c3e] text-sm">
              {lang === "hi" ? "सक्रिय" : "Engaged"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DspRecordingPipelineDemo() {
  const { lang } = useLanguage();
  const sinusoidalWaveBars = [10, 16, 26, 36, 44, 38, 28, 22, 34, 42, 30, 20, 14, 8];

  return (
    <div className="text-left space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#3f6f5c] animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
            {lang === "hi"
              ? "16,000 Hz DSP ऑडियो इनपुट बफर"
              : "Native 16,000 Hz DSP Acoustic Capture"}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Noise Floor Suppressed
        </span>
      </div>

      {/* Acoustic Waveform & Real-Time Recognition Match */}
      <div className="rounded-2xl border border-stone-200/90 bg-white/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#3f6f5c] text-white flex items-center justify-center">
              <MicrophoneStudioIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">
                {lang === "hi" ? "सक्रिय स्वर रिकॉर्डिंग" : "Recording Audio Stream"}
              </div>
              <div className="text-[10px] text-zinc-500">
                Acoustic Sampling • Web Audio API
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#3f6f5c]">-18.2 dBFS</span>
          </div>
        </div>

        {/* Calm Continuous Sinusoidal Wave Animation (No Frantic Math.random()) */}
        <div className="h-16 flex items-end justify-center gap-1.5 py-2.5 bg-stone-50 rounded-xl border border-stone-200/60 px-4">
          {sinusoidalWaveBars.map((baseH, i) => {
            const minH = Math.max(6, Math.round(baseH * 0.35));
            const maxH = Math.min(50, Math.round(baseH * 1.15));
            return (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-[#3f6f5c]"
                animate={{
                  height: [`${minH}px`, `${maxH}px`, `${minH}px`],
                  opacity: [0.75, 1, 0.75],
                }}
                transition={{
                  duration: 1.8 + Math.sin(i * 0.6) * 0.35,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.08,
                }}
              />
            );
          })}
        </div>

        <div className="mt-3.5 flex items-center justify-between text-xs text-zinc-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
          <span className="font-hindi font-medium">
            उच्चारित ध्वनि: <strong className="text-zinc-900">&quot;नमस्ते, आप कैसे हैं?&quot;</strong>
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
            100% संरेखित
          </span>
        </div>
      </div>
    </div>
  );
}

function MitraGuidancePipelineDemo() {
  const { lang } = useLanguage();
  const radius = 17;
  const circumference = 2 * Math.PI * radius;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <div className="text-left space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#b8862a]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
            {lang === "hi"
              ? "मित्र AI वाक् निदान एवं क्लिनिकल मार्गदर्शन"
              : "Mitra AI Clinical Articulation Diagnosis"}
          </span>
        </div>
        {/* Animated Circular SVG Accuracy Ring */}
        <div className="flex items-center gap-2.5 bg-amber-50/80 px-2.5 py-1 rounded-full border border-amber-200">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="#fef3c7"
                strokeWidth="3"
              />
              <motion.circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="#b8862a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - 0.96) }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <span className="absolute text-[9px] font-black text-amber-900">
              96%
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-900 pr-1">
            CER: 0.04 • 96% Match
          </span>
        </div>
      </div>

      {/* Authentic Clinical Mitra Card with Staggered Reveal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-stone-200/90 bg-white/95 p-4 sm:p-5 shadow-2xs space-y-3"
      >
        {/* Analysis Item */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#a24b38] mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c45c3e]" />
            <span>{lang === "hi" ? "विश्लेषण (Analysis)" : "Phonetic Analysis"}</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed pl-3 border-l-2 border-[#c45c3e]/30">
            {lang === "hi"
              ? "उत्कृष्ट! आपने 'त' और 'स' का उच्चारण सटीक जिह्वा-तालू समन्वय के साथ किया।"
              : "Excellent! Dental consonants articulated with precise phoneme clarity."}
          </p>
        </motion.div>

        {/* Tongue & Mouth Placement Item */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3f6f5c] mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3f6f5c]" />
            <span>
              {lang === "hi"
                ? "ओष्ठ व जिह्वा स्थिति (Tongue & Mouth Placement)"
                : "Physiological Placement"}
            </span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed pl-3 border-l-2 border-[#3f6f5c]/30">
            {lang === "hi"
              ? "जीभ के सिरे को ऊपरी दांतों के पिछले सिरे से स्पर्श करें और सांस का प्रवाह सुचारु रखें।"
              : "Rest the tongue tip against the upper incisors and maintain steady, unblocked airflow."}
          </p>
        </motion.div>

        {/* Practice Tip Item */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#b8862a] mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b8862a]" />
            <span>
              {lang === "hi"
                ? "अभ्यास सुझाव (Practice Recommendation)"
                : "Practice Prescription"}
            </span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed pl-3 border-l-2 border-[#b8862a]/30">
            {lang === "hi"
              ? "इसी गति में वाक्य को 3 बार दोहराकर प्राकृतिक प्रवाह और आत्मविश्वास बढ़ाएं।"
              : "Repeat this utterance 3 times at normal pace to solidify muscle memory."}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   "BEFORE YOU BEGIN." FAQ SECTION (EDITORIAL 2-COLUMN ACCORDION)
   ============================================================ */

function FaqSection() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqItems = [
    { num: "01", q: t.faq1Q, a: t.faq1A },
    { num: "02", q: t.faq2Q, a: t.faq2A },
    { num: "03", q: t.faq3Q, a: t.faq3A },
    { num: "04", q: t.faq4Q, a: t.faq4A },
  ];

  return (
    <section className="bg-[#f2efe9] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.35fr] lg:gap-20 items-start">
          {/* Left Column (Editorial Header) */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss mb-5 block">
              {t.faqEyebrow}
            </span>
            <h2 className="leading-[1.08] tracking-tight">
              <span className="block text-4xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-tight text-[#1e3329] leading-[1.08]">
                {t.faqTitleLine1}
              </span>
              <span className="block font-serif italic font-normal text-4xl sm:text-5xl lg:text-[3.5rem] text-[#1e3329] leading-[1.08] mt-1">
                {t.faqTitleLine2}
              </span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-[#6e7771] font-normal leading-relaxed">
              {t.faqSubtitle}
            </p>
          </div>

          {/* Right Column (Minimalist Hairline-Divided Accordion List — NO Boxed Cards) */}
          <div className="border-t border-b border-[#dcd6cc] divide-y divide-[#dcd6cc]">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.num} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-6 sm:py-7 flex items-center justify-between gap-6 text-left group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs font-normal text-[#8c948e] w-8 shrink-0 tabular-nums">
                      {item.num}
                    </span>
                    <span className="flex-1 text-base sm:text-[18px] font-normal text-[#1e3329] group-hover:text-[#c45c3e] transition-colors leading-snug">
                      {item.q}
                    </span>
                    <span className="shrink-0 text-[#1e3329] transition-transform duration-300 ease-out">
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="2" x2="8" y2="14" />
                        <line x1="2" y1="8" x2="14" y2="8" />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 pr-6 pb-7 pt-1">
                          <p className="text-sm sm:text-[15px] leading-7 text-[#656d68] max-w-2xl font-normal">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [stepHeld, setStepHeld] = useState(false);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotatingWords = useMemo(
    () => [
      {
        hi: "नमस्ते",
        subHi: "नमस्ते - अभिवादन (Hello)",
        subEn: "Namaste - Hello",
      },
      {
        hi: "शुक्रिया",
        subHi: "शुक्रिया - धन्यवाद (Thank you)",
        subEn: "Shukriya - Thank you",
      },
      {
        hi: "कृपया",
        subHi: "कृपया - विनम्र आग्रह (Please)",
        subEn: "Kripya - Please",
      },
      {
        hi: "अभिनंदन",
        subHi: "अभिनंदन - बधाई (Congratulations)",
        subEn: "Abhinandan - Congratulations",
      },
    ],
    [],
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [wordPulse, setWordPulse] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % rotatingWords.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [rotatingWords.length]);

  function goToWord(next: number) {
    setWordPulse(true);
    setWordIndex(next);
    window.setTimeout(() => setWordPulse(false), 260);
  }

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
    if (stepHeld) return;
    const id = window.setInterval(() => {
      setActiveStep((n) => (n + 1) % 3);
    }, 6200);
    return () => window.clearInterval(id);
  }, [stepHeld]);

  function selectStep(index: number) {
    setActiveStep(index);
    setStepHeld(true);
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    stepTimeoutRef.current = setTimeout(() => setStepHeld(false), 7000);
  }

  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, []);

  const [activeSpecimen, setActiveSpecimen] = useState(0);
  const [journeyPhase, setJourneyPhase] = useState<0 | 1 | 2>(0);
  const [journeyHeld, setJourneyHeld] = useState(false);
  const journeyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (journeyHeld) return;
    const id = window.setInterval(() => {
      setJourneyPhase((p) => ((p + 1) % 3) as 0 | 1 | 2);
    }, 6500);
    return () => window.clearInterval(id);
  }, [journeyHeld]);

  function selectJourneyPhase(idx: 0 | 1 | 2) {
    setJourneyPhase(idx);
    setJourneyHeld(true);
    if (journeyTimeoutRef.current) clearTimeout(journeyTimeoutRef.current);
    journeyTimeoutRef.current = setTimeout(() => setJourneyHeld(false), 9000);
  }

  useEffect(() => {
    return () => {
      if (journeyTimeoutRef.current) clearTimeout(journeyTimeoutRef.current);
    };
  }, []);

  const [journeySpeed, setJourneySpeed] = useState<number>(0.75);
  const [bentoWordMode, setBentoWordMode] = useState<"word" | "sentence">("word");

  return (
    <main className="relative overflow-hidden text-zinc-900">
      <ScrollRail />

      <section className="relative isolate overflow-hidden bg-[#fff7f1] px-4 py-20 sm:px-6 lg:px-8">
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
        {/* soft floating depth, quiet and slow — not attention-grabbing */}
        <div
          className="drift-blob pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#c45c3e]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="drift-blob-alt pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#3f6f5c]/10 blur-3xl"
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
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#c45c3e] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c45c3e]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a94c32] hover:shadow-xl hover:shadow-[#c45c3e]/30"
                >
                  <MicIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  {t.ctaPractice}
                </Link>

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/50 px-6 py-3 text-sm font-semibold text-zinc-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80"
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
                    {lang === "hi" ? "आज का शब्द" : "Today's word"}
                  </span>
                  <span className="rounded-full border border-white/70 bg-white/50 px-2.5 py-1 text-xs text-zinc-600">
                    {wordIndex + 1} / {rotatingWords.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    goToWord((wordIndex + 1) % rotatingWords.length)
                  }
                  className="w-full rounded-2xl bg-[#f6d9cc]/70 p-6 text-center backdrop-blur-sm transition-transform duration-200 active:scale-[0.98]"
                  aria-label="Show next word"
                >
                  <p
                    className="text-5xl font-black text-zinc-900 sm:text-6xl"
                    style={{
                      opacity: wordPulse ? 0 : 1,
                      transform: wordPulse
                        ? "translateY(-6px)"
                        : "translateY(0)",
                      transition: "opacity 0.22s ease, transform 0.22s ease",
                    }}
                  >
                    {rotatingWords[wordIndex].hi}
                  </p>
                  <p className="mt-2 text-sm italic text-zinc-600">
                    {lang === "hi"
                      ? rotatingWords[wordIndex].subHi
                      : rotatingWords[wordIndex].subEn}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {rotatingWords.map((_, dot) => (
                      <span
                        key={dot}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: dot === wordIndex ? 18 : 6,
                          background:
                            dot === wordIndex
                              ? "#c45c3e"
                              : "rgba(196,92,62,0.35)",
                        }}
                      />
                    ))}
                  </div>
                </button>

                <div className="my-6 h-px w-full bg-white/70" />

                <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3cfc4]">
                      <SoundWaveIcon className="h-3.5 w-3.5 text-[#c45c3e]" />
                    </span>
                    <span>{lang === "hi" ? "सुनें" : "Listen"}</span>
                  </span>
                  <span className="h-4 w-px bg-zinc-300" />
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7e8de]">
                      <MicIcon className="h-3.5 w-3.5 text-[#3f6f5c]" />
                    </span>
                    <span>{lang === "hi" ? "बोलें" : "Speak"}</span>
                  </span>
                  <span className="h-4 w-px bg-zinc-300" />
                  <span className="inline-flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7e8de]">
                      <ProgressIcon className="h-3.5 w-3.5 text-[#3f6f5c]" />
                    </span>
                    <span>{lang === "hi" ? "सुधारें" : "Improve"}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* a quiet strip of everyday phrases — shows breadth without a wall of copy */}
      <section className="border-y border-black/5 bg-[#fbeee4] px-0 py-3">
        <PhraseTicker />
      </section>

      <ColorBridge from="#fbeee4" to="#f6e4d6" />

      <section className="bg-[#f6e4d6] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <HomeWordTeaser />
        </Reveal>
      </section>

      {/* ── SECTION 1: Therapeutic Philosophy & Phonetic Articulation Architecture ── */}
      <ColorBridge from="#f6e4d6" to="#f3e4e0" />

      <section className="bg-[#f3e4e0] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a24b38] mb-3 px-3 py-1 rounded-full bg-white/70 border border-white/80 backdrop-blur-xs shadow-2xs">
              <ShieldPatientIcon className="h-3.5 w-3.5 text-[#c45c3e]" />
              <span>{t.empathyBadge}</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-12 items-end">
              <div className="lg:col-span-7">
                <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl leading-tight">
                  {t.empathyTitle}
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-base text-zinc-700 leading-relaxed">
                  {t.empathySubtitle}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Left Column: 3 Compassionate Core Values */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4 h-full">
              <AnimatedCard
                delay={40}
                className="flex-1 flex flex-col justify-between rounded-3xl border border-white/85 bg-white/75 p-6 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-[0_8px_30px_rgb(196,92,62,0.12)] hover:border-[#c45c3e]/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6d7c8] text-[#a24b38] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <SproutIcon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <EmpathyCalmRipple />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f6d7c8]/80 text-[#8a4634]">
                        {t.empathyCard1Tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1.5">
                    {t.empathyCard1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {t.empathyCard1Desc}
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard
                delay={90}
                className="flex-1 flex flex-col justify-between rounded-3xl border border-white/85 bg-white/75 p-6 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-[0_8px_30px_rgb(61,95,120,0.12)] hover:border-[#3d5f78]/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d5e4ef] text-[#3d5f78] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <HeadphonesAcousticIcon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <EmpathyAcousticWave />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d5e4ef]/80 text-[#3d5f78]">
                        {t.empathyCard2Tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1.5">
                    {t.empathyCard2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {t.empathyCard2Desc}
                  </p>
                </div>
              </AnimatedCard>

              <AnimatedCard
                delay={140}
                className="flex-1 flex flex-col justify-between rounded-3xl border border-white/85 bg-white/75 p-6 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-[0_8px_30px_rgb(63,111,92,0.12)] hover:border-[#3f6f5c]/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d8e6d6] text-[#3f6a4a] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <HeartHandIcon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <EmpathyGrowthPulse />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d8e6d6]/80 text-[#3f6a4a]">
                        {t.empathyCard3Tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1.5">
                    {t.empathyCard3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    {t.empathyCard3Desc}
                  </p>
                </div>
              </AnimatedCard>
            </div>

            {/* Right Column: Interactive Phonetic Articulation Specimen */}
            <div className="lg:col-span-7 h-full flex flex-col">
              <AnimatedCard
                delay={80}
                hoverLift={false}
                className="h-full flex flex-col justify-between rounded-3xl border border-white/90 bg-white/85 p-6 sm:p-8 backdrop-blur-md shadow-sm"
              >
                <div>
                  {/* Specimen Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 mb-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                        Devanagari Articulation Biomechanics
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-zinc-900">
                        {lang === "hi"
                          ? "उच्चारण स्थान एवं मुख-विवर मॉडल"
                          : "Phonetic Articulation & Vocal Tract Model"}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-zinc-600 border border-stone-200">
                      {lang === "hi" ? "5 उच्चारण क्षेत्र" : "5 Articulation Zones"}
                    </span>
                  </div>

                  {/* Specimen Tabs with Framer Motion layoutId sliding pill */}
                  <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/70 mb-5 relative">
                    {PHONETIC_SPECIMENS.map((specimen, idx) => {
                      const isSelected = activeSpecimen === idx;
                      return (
                        <button
                          key={specimen.key}
                          type="button"
                          onClick={() => setActiveSpecimen(idx)}
                          className={`relative flex-1 min-w-17.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-colors z-10 ${
                            isSelected
                              ? "text-zinc-900 font-bold"
                              : "text-zinc-600 hover:text-zinc-900 hover:bg-white/40"
                          }`}
                        >
                          {isSelected && (
                            <motion.div
                              layoutId="specimenTab"
                              className="absolute inset-0 rounded-xl bg-white shadow-xs border border-stone-200/60 -z-10"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}
                          <span className="relative z-10">
                            {lang === "hi" ? specimen.tagHi : specimen.tagEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Specimen Details */}
                  {(() => {
                    const sp = PHONETIC_SPECIMENS[activeSpecimen];
                    return (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                          <div>
                            <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                              <span>{lang === "hi" ? sp.titleHi : sp.titleEn}</span>
                              <span className="text-[10px] text-zinc-400 font-normal">
                                ({lang === "hi" ? sp.titleEn : sp.symbols})
                              </span>
                            </div>
                            <div className="text-lg font-bold font-hindi text-[#c45c3e] mt-1 tracking-wider">
                              {sp.symbols}
                            </div>
                          </div>
                          <div className="sm:text-right">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                              {lang === "hi" ? "उदाहरण शब्द" : "Example Word"}
                            </span>
                            <span className="text-base font-bold font-hindi text-zinc-900">
                              {sp.exampleHi}
                            </span>
                            <span className="text-xs text-zinc-500 italic ml-1.5">
                              ({sp.exampleEn})
                            </span>
                          </div>
                        </div>

                        {/* Animated Vocal-Tract / Lip-Contour Morphing SVG */}
                        <VocalTractIllustration
                          specimenKey={sp.key}
                          accent={sp.accent}
                        />

                        {/* Physiological Sliders with Framer Motion animated progress bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
                            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                              <span className="text-zinc-600">
                                {lang === "hi"
                                  ? "जिह्वा उत्थान (Tongue Height)"
                                  : "Tongue Elevation"}
                              </span>
                              <span className="font-bold text-zinc-900">
                                {sp.tongueHeight}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: sp.accent,
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${sp.tongueHeight}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-white border border-stone-200/70 shadow-2xs">
                            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                              <span className="text-zinc-600">
                                {lang === "hi"
                                  ? "ओष्ठ विवर (Lip Opening)"
                                  : "Lip Opening"}
                              </span>
                              <span className="font-bold text-zinc-900">
                                {sp.lipOpening}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{
                                  background: sp.accent,
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${sp.lipOpening}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Clinical Instruction Note */}
                        <div className="p-4 rounded-2xl border border-stone-200/80 bg-white/60">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                            <BulbLightIcon className="h-3.5 w-3.5 text-amber-600" />
                            <span>
                              {lang === "hi"
                                ? "क्लिनिकल वाक् निर्देश (Therapeutic Placement)"
                                : "Clinical Articulation Guidance"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-hindi">
                            {lang === "hi" ? sp.actionHi : sp.actionEn}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: The Mitra Speech Articulation Journey (Pipeline) ── */}
      <ColorBridge from="#f3e4e0" to="#e4eee8" />

      <section className="bg-[#e4eee8] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3f6f5c] mb-3 px-3 py-1 rounded-full bg-white/70 border border-white/80 backdrop-blur-xs shadow-2xs">
              <TargetPrecisionIcon className="h-3.5 w-3.5 text-[#3f6f5c]" />
              <span>{t.howItWorksBadge}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">
              {t.howItWorksTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-700 leading-relaxed">
              {t.howItWorksSubtitle}
            </p>
          </Reveal>

          {/* Interactive 3-Stage Pipeline Ribbon */}
          <div
            onMouseEnter={() => setJourneyHeld(true)}
            onMouseLeave={() => setJourneyHeld(false)}
          >
            <AnimatedCard
              delay={50}
              hoverLift={false}
              className="glass-card overflow-hidden rounded-3xl p-5 sm:p-8 mb-8 shadow-sm border border-white/90"
            >
              {/* Pipeline Ribbon Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200/80 mb-6 relative">
                {[
                  {
                    idx: 0 as const,
                    n: "01",
                    titleHi: "देखें और सुनें",
                    titleEn: "Observe & Listen",
                    subHi: "3D ओष्ठ-निरीक्षण",
                    subEn: "3D Lip Observation",
                    accent: "#c45c3e",
                  },
                  {
                    idx: 1 as const,
                    n: "02",
                    titleHi: "बोलें और रिकॉर्ड करें",
                    titleEn: "Articulate & Record",
                    subHi: "16kHz DSP ग्रहण",
                    subEn: "16kHz DSP Capture",
                    accent: "#3f6f5c",
                  },
                  {
                    idx: 2 as const,
                    n: "03",
                    titleHi: "मित्र वाक् परामर्श",
                    titleEn: "Mitra Guidance",
                    subHi: "क्लिनिकल विश्लेषण",
                    subEn: "Clinical Analysis",
                    accent: "#b8862a",
                  },
                ].map((item) => {
                  const on = journeyPhase === item.idx;
                  return (
                    <button
                      key={item.n}
                      type="button"
                      onClick={() => selectJourneyPhase(item.idx)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl text-left transition-colors overflow-hidden ${
                        on
                          ? "text-zinc-900 font-bold"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-white/40"
                      }`}
                    >
                      {on && (
                        <motion.div
                          layoutId="pipelineStageTab"
                          className="absolute inset-0 bg-white rounded-xl shadow-xs border border-stone-200/80"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span
                        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs transition-colors"
                        style={{
                          background: on ? item.accent : "rgba(0,0,0,0.06)",
                          color: on ? "#fff" : "#71717a",
                        }}
                      >
                        {item.n}
                      </span>
                      <div className="min-w-0 relative z-10">
                        <div className="text-xs sm:text-sm font-bold truncate">
                          {lang === "hi" ? item.titleHi : item.titleEn}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-medium truncate">
                          {lang === "hi" ? item.subHi : item.subEn}
                        </div>
                      </div>

                      {/* Smooth animated progress line underneath active stage tab */}
                      {on && !journeyHeld && (
                        <motion.div
                          key={`progress-${item.idx}`}
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full z-20"
                          style={{ background: item.accent }}
                          initial={{ scaleX: 0, transformOrigin: "left" }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 6.5, ease: "linear" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Stage Viewport */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={journeyPhase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/80 bg-white/40 p-5 sm:p-6 min-h-95 flex flex-col justify-center"
                >
                  {journeyPhase === 0 && (
                    <ObservationPipelineDemo
                      speed={journeySpeed}
                      onSpeedChange={setJourneySpeed}
                    />
                  )}
                  {journeyPhase === 1 && <DspRecordingPipelineDemo />}
                  {journeyPhase === 2 && <MitraGuidancePipelineDemo />}
                </motion.div>
              </AnimatePresence>
            </AnimatedCard>
          </div>

          {/* 3 Clinical Methodology Pillars */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {[
              {
                tag:
                  lang === "hi"
                    ? "01 • मोटर मिररिंग"
                    : "01 • Motor Mirroring",
                title:
                  lang === "hi"
                    ? "दृश्यात्मक तंत्रिका संबलन"
                    : "Visual Neurological Priming",
                desc:
                  lang === "hi"
                    ? "3D ओष्ठ व जिह्वा संचालन का अवलोकन बोलने से पहले मस्तिष्क के मोटर कॉर्टेक्स को सक्रिय करता है, जिससे उच्चारण की शारीरिक तैयारी सहज हो जाती है।"
                    : "Observing 3D lip and tongue kinematics primes the motor cortex before vocalization, establishing natural physical readiness for accurate speech.",
                accent: "#c45c3e",
                delay: 70,
                Diagram: MotorMirroringDiagram,
              },
              {
                tag:
                  lang === "hi"
                    ? "02 • एकॉस्टिक DSP"
                    : "02 • Acoustic DSP",
                title:
                  lang === "hi"
                    ? "16kHz शुद्ध ध्वनि ग्रहण"
                    : "16kHz Studio Audio Capture",
                desc:
                  lang === "hi"
                    ? "कमरे के शोर और गूंज को फिल्टर कर केवल शुद्ध स्वर और व्यंजन वर्णों का स्पेक्ट्रल विश्लेषण किया जाता है, जिससे सटीक ध्वन्यात्मक परिणाम प्राप्त होते हैं।"
                    : "Background room noise and reverberation are filtered out to perform spectral analysis purely on vowels and consonants, ensuring precise phoneme evaluation.",
                accent: "#3f6f5c",
                delay: 120,
                Diagram: NoiseFilterDiagram,
              },
              {
                tag:
                  lang === "hi"
                    ? "03 • शारीरिक सुधार मार्गदर्शन"
                    : "03 • Physical Prescription",
                title:
                  lang === "hi"
                    ? "शारीरिक सुधार मार्गदर्शन"
                    : "Actionable Articulation Directives",
                desc:
                  lang === "hi"
                    ? "अमूर्त अंकों के स्थान पर मित्र AI जीभ के स्थान, होंठों के आकार और सांस छोड़ने के तरीके पर स्पष्ट और व्यावहारिक शारीरिक निर्देश प्रदान करता है।"
                    : "Instead of abstract error scores, Mitra AI provides concrete anatomical directives on tongue placement, lip rounding, and breath flow regulation.",
                accent: "#b8862a",
                delay: 170,
                Diagram: AnatomicalTargetDiagram,
              },
            ].map((pillar) => {
              const DiagramComponent = pillar.Diagram;
              return (
                <AnimatedCard
                  key={pillar.tag}
                  delay={pillar.delay}
                  className="h-full flex flex-col justify-between rounded-3xl border border-white/85 bg-white/75 p-6 sm:p-7 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Minimal Animated SVG Diagram Header */}
                    <DiagramComponent />

                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: pillar.accent }}
                      >
                        {pillar.tag}
                      </span>
                      <span
                        className="h-2 w-2 rounded-full group-hover:scale-125 transition-transform duration-300"
                        style={{ background: pillar.accent }}
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Clinical Capabilities Bento Suite ── */}
      <ColorBridge from="#e4eee8" to="#e6eef3" />

      <section className="bg-[#e6eef3] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#3d5f78] mb-3 px-3 py-1 rounded-full bg-white/70 border border-white/80 backdrop-blur-xs shadow-2xs">
              <MicroscopeIcon className="h-3.5 w-3.5 text-[#3d5f78]" />
              <span>{t.featuresBadge}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-5xl">
              {t.featuresTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-700 leading-relaxed">
              {t.featuresSubtitle}
            </p>
          </Reveal>

          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Tile 1: 3D Biomechanical Avatar (7 cols on lg) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col">
              <AnimatedCard
                delay={50}
                className="h-full rounded-3xl border border-white/85 bg-white/75 p-7 sm:p-8 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c45c3e]/15 text-[#c45c3e] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <LipBiomechanicsIcon className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#c45c3e]/10 text-[#c45c3e]">
                      WebGL 60 FPS • Biomechanics
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                    {t.feature1Desc}
                  </p>
                </div>

                {/* Animated Lip-Spread Contour */}
                <AnimatedLipSpreadContour />

                {/* Micro Visualizer */}
                <div className="mt-4 pt-4 border-t border-stone-200/60 grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/50">
                    <span className="text-[11px] text-zinc-600 block font-medium">
                      {lang === "hi" ? "जबड़ा (Jaw)" : "Jaw Motion"}
                    </span>
                    <span className="font-bold text-zinc-800">0.18 rad</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/50">
                    <span className="text-[11px] text-zinc-600 block font-medium">
                      {lang === "hi" ? "ओष्ठ (Lip Width)" : "Lip Spread"}
                    </span>
                    <span className="font-bold text-zinc-800">
                      1.15× spread
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/50">
                    <span className="text-[11px] text-zinc-600 block font-medium">
                      {lang === "hi" ? "जिह्वा (Palate)" : "Tongue Lift"}
                    </span>
                    <span className="font-bold text-zinc-800">0.72 height</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Tile 2: Dual Modality Practice: Words & Sentences (5 cols on lg) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col">
              <AnimatedCard
                delay={90}
                className="h-full rounded-3xl border border-white/85 bg-white/75 p-7 sm:p-8 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3f6f5c]/15 text-[#3f6f5c] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <VocabularyLayersIcon className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#3f6f5c]/10 text-[#3f6f5c]">
                      Basic • Intermediate • Advanced
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 mb-2">
                    {t.feature2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                    {t.feature2Desc}
                  </p>
                </div>

                {/* Interactive Tab Switcher in Card with Smooth AnimatePresence */}
                <div className="mt-6 pt-5 border-t border-stone-200/60">
                  <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200/70 mb-3">
                    <button
                      type="button"
                      onClick={() => setBentoWordMode("word")}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bentoWordMode === "word"
                          ? "bg-zinc-900 text-white shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <DocumentWordIcon className="h-3.5 w-3.5" />
                      <span>
                        {lang === "hi" ? "शब्द (500+)" : "Words (500+)"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBentoWordMode("sentence")}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        bentoWordMode === "sentence"
                          ? "bg-zinc-900 text-white shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      <ChatBubbleIcon className="h-3.5 w-3.5" />
                      <span>
                        {lang === "hi" ? "वाक्य (40+)" : "Sentences (40+)"}
                      </span>
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={bentoWordMode}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="text-xs text-zinc-700 font-hindi font-medium bg-stone-50 p-2.5 rounded-xl border border-stone-200/50 flex items-center justify-between"
                    >
                      <span>
                        {bentoWordMode === "word"
                          ? (lang === "hi"
                              ? "उदा: 'नमस्ते', 'स्वास्थ्य', 'प्रतियोगिता'"
                              : "Ex: 'नमस्ते' (Namaste), 'स्वास्थ्य' (Health)")
                          : (lang === "hi"
                              ? "उदा: 'प्रतिदिन सुबह योग करने से मन शांत रहता है।'"
                              : "Ex: 'प्रतिदिन सुबह योग करने से मन शांत रहता है।'")}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans">
                        {bentoWordMode === "word"
                          ? "Single Phoneme"
                          : "Continuous Flow"}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </AnimatedCard>
            </div>

            {/* Tile 3: Character Error Rate (CER) Analytics (4 cols) */}
            <div className="col-span-12 md:col-span-4 flex flex-col">
              <AnimatedCard
                delay={130}
                className="h-full rounded-3xl border border-white/85 bg-white/75 p-6 sm:p-7 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#b8862a]/15 text-[#b8862a] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <TargetPrecisionIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#b8862a]/10 text-[#b8862a]">
                      Levenshtein Distance
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1.5">
                    {t.feature3Title}
                  </h3>
                  <p className="text-[13px] text-zinc-700 leading-relaxed">
                    {t.feature3Desc}
                  </p>
                </div>

                {/* Animated Character Alignment Pills */}
                <div className="mt-4 pt-3 border-t border-stone-200/60">
                  <div className="flex items-center gap-1 p-1.5 bg-stone-50 rounded-xl border border-stone-200/50 mb-3">
                    {[
                      { char: "न", status: "match" },
                      { char: "म", status: "match" },
                      { char: "स", status: "match" },
                      { char: "्", status: "match" },
                      { char: "त", status: "match" },
                      { char: "े", status: "match" },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 py-1 text-center font-hindi text-xs font-bold rounded-lg bg-white border border-emerald-200/70 text-emerald-800 shadow-2xs"
                        animate={{ opacity: [0.85, 1, 0.85] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          delay: i * 0.16,
                          ease: "easeInOut",
                        }}
                      >
                        {c.char}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-zinc-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      CER = (S+D+I)/N
                    </span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                      96% Precision
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Tile 4: Mitra AI Clinical Articulation Coach (4 cols) */}
            <div className="col-span-12 md:col-span-4 flex flex-col">
              <AnimatedCard
                delay={170}
                className="h-full rounded-3xl border border-white/85 bg-white/75 p-6 sm:p-7 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3d5f78]/15 text-[#3d5f78] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <BrainCircuitIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3d5f78]/10 text-[#3d5f78]">
                      Bilingual (Hi / En)
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1.5">
                    {t.feature4Title}
                  </h3>
                  <p className="text-[13px] text-zinc-700 leading-relaxed">
                    {t.feature4Desc}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-zinc-600">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <motion.span
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-stone-100/90 px-1.5 py-0.5 rounded-md border border-stone-200/60"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TonguePlacementIcon className="h-3 w-3 text-[#3d5f78]" />
                      <span>{lang === "hi" ? "जिह्वा" : "Tongue"}</span>
                    </motion.span>
                    <motion.span
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-stone-100/90 px-1.5 py-0.5 rounded-md border border-stone-200/60"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <AirflowBreezeIcon className="h-3 w-3 text-[#3d5f78]" />
                      <span>{lang === "hi" ? "श्वास" : "Breath"}</span>
                    </motion.span>
                    <motion.span
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-stone-100/90 px-1.5 py-0.5 rounded-md border border-stone-200/60"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <LipsContourIcon className="h-3 w-3 text-[#3d5f78]" />
                      <span>{lang === "hi" ? "ओष्ठ" : "Lips"}</span>
                    </motion.span>
                  </div>
                  <span className="font-semibold text-[#3d5f78] shrink-0 ml-1">
                    Instant
                  </span>
                </div>
              </AnimatedCard>
            </div>

            {/* Tile 5: Natural Indian Female Voice (4 cols) */}
            <div className="col-span-12 md:col-span-4 flex flex-col">
              <AnimatedCard
                delay={210}
                className="h-full rounded-3xl border border-white/85 bg-white/75 p-6 sm:p-7 backdrop-blur-md shadow-2xs hover:bg-white/95 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c45c3e]/15 text-[#c45c3e] group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                      <MicrophoneStudioIcon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#c45c3e]/10 text-[#c45c3e]">
                      0.5× – 1.25× Speed
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1.5">
                    {t.feature5Title}
                  </h3>
                  <p className="text-[13px] text-zinc-700 leading-relaxed">
                    {t.feature5Desc}
                  </p>
                </div>

                {/* Animated Multi-Speed Waveform */}
                <div className="h-8 flex items-center justify-center gap-1 bg-stone-50 rounded-xl border border-stone-200/60 px-3 mt-4 mb-2">
                  {[6, 13, 22, 10, 16, 22, 15, 9, 18, 24, 14, 7].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-1 rounded-full bg-[#c45c3e]"
                      animate={{
                        height: [`${Math.round(h * 0.35)}px`, `${h}px`, `${Math.round(h * 0.35)}px`],
                      }}
                      transition={{
                        duration: 1.4 + (i % 3) * 0.2,
                        repeat: Infinity,
                        ease: [0.22, 1, 0.36, 1],
                        delay: (i * 0.08) % 0.3,
                      }}
                    />
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 font-medium">
                    hi-IN-SwaraNeural
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                    Studio Quality
                  </span>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      <ColorBridge from="#e6eef3" to="#f2efe9" />

      <FaqSection />

      <ColorBridge from="#f2efe9" to="#f4eee4" />

      <section className="bg-[#f4eee4] px-4 pb-10 sm:px-6 lg:px-8 relative">
        <Image
          src="/progressBar.png"
          alt="Progress bar"
          fill
          className="absolute inset-0 -my-10 object-contain opacity-60"
          priority
        />
        <div className="mx-auto w-full max-w-3xl text-center">
          <div className="relative mx-auto w-full h-48 sm:h-56 md:h-72">
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
              <WordReveal
                text="हर शब्द एक कदम है, हर कदम एक उपलब्धि है"
                className="text-2xl font-black leading-relaxed text-zinc-900 sm:text-4xl"
              />
              <WordReveal
                text="Every word is a step, every step is an achievement."
                className="mt-4 text-base text-zinc-800"
                baseDelay={500}
                step={35}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes driftA {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(18px, -14px);
          }
        }
        @keyframes driftB {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-16px, 12px);
          }
        }
        @keyframes tickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes stepRingDrain {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 113;
          }
        }
        @keyframes pulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.55;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        .drift-blob {
          animation: driftA 9s ease-in-out infinite;
        }
        .drift-blob-alt {
          animation: driftB 11s ease-in-out infinite;
        }
        .step-ring {
          animation: stepRingDrain 6.2s linear forwards;
        }
        .pulse-ring {
          animation: pulseRing 1.7s ease-out infinite;
        }
        .pulse-ring-delay {
          animation-delay: 0.85s;
        }

        @media (prefers-reduced-motion: reduce) {
          .drift-blob,
          .drift-blob-alt,
          .step-ring,
          .pulse-ring {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
