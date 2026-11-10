"use client";

import { useEffect, useState, useRef, memo } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface MitraPipelineProgressProps {
  isEvaluating: boolean;
  targetWord?: string;
  feedbackLanguage?: "hi" | "en";
  className?: string;
  isCompleted?: boolean;
}

interface PipelineStage {
  id: number;
  code: string;
  codeHi: string;
  nameEn: string;
  nameHi: string;
  moduleEn: string;
  moduleHi: string;
  descEn: string;
  descHi: string;
  telemetryEn: { label: string; value: string }[];
  telemetryHi: { label: string; value: string }[];
}

const STAGES: PipelineStage[] = [
  {
    id: 1,
    code: "STANDARDIZE",
    codeHi: "मानकीकरण",
    nameEn: "Audio Standardizing & Noise Filter",
    nameHi: "ऑडियो मानकीकरण व शोर नियंत्रण",
    moduleEn: "16 kHz Voice Normalization",
    moduleHi: "16 kHz स्पष्ट आवाज़ सामान्यीकरण",
    descEn: "Cleaning your recording, removing background noise, and standardizing volume to 16 kHz clear mono sound.",
    descHi: "आपकी रिकॉर्डिंग को साफ़ करना, बैकग्राउंड शोर हटाना और 16 kHz स्पष्ट आवाज़ में बदलना।",
    telemetryEn: [
      { label: "Sample Rate", value: "16,000 Hz" },
      { label: "Channel", value: "1 (Mono)" },
      { label: "Noise Filter", value: "Active (-42dB)" },
      { label: "Format", value: "Clear WAV" },
    ],
    telemetryHi: [
      { label: "सेंपल दर", value: "16,000 Hz" },
      { label: "चैनल", value: "1 (मोनो)" },
      { label: "शोर फ़िल्टर", value: "सक्रिय (-42dB)" },
      { label: "फॉर्मेट", value: "स्वच्छ WAV" },
    ],
  },
  {
    id: 2,
    code: "SPEECH AI",
    codeHi: "वाक् पहचान",
    nameEn: "Hindi Speech Recognition (AI)",
    nameHi: "हिन्दी वाक् पहचान (AI मॉडल)",
    moduleEn: "IndicWav2Vec Neural Model",
    moduleHi: "IndicWav2Vec न्यूरल वाक् मॉडल",
    descEn: "AI model listening to your voice and recognizing each spoken Hindi letter, vowel, and syllable.",
    descHi: "एआई मॉडल आपकी आवाज़ को सुनकर बोले गए प्रत्येक हिन्दी अक्षर, मात्रा और शब्दांश की पहचान कर रहा है।",
    telemetryEn: [
      { label: "Model", value: "IndicWav2Vec" },
      { label: "Language", value: "Hindi (Devanagari)" },
      { label: "Analysis", value: "Letter-by-Letter" },
      { label: "Frames", value: "20ms Audio Bins" },
    ],
    telemetryHi: [
      { label: "मॉडल", value: "IndicWav2Vec" },
      { label: "भाषा", value: "हिन्दी (देवनागरी)" },
      { label: "विश्लेषण", value: "अक्षर-दर-अक्षर" },
      { label: "फ़्रेम", value: "20ms ऑडियो अंतराल" },
    ],
  },
  {
    id: 3,
    code: "CER CHECK",
    codeHi: "सटीकता व CER",
    nameEn: "Pronunciation Accuracy & Error Rate (CER)",
    nameHi: "उच्चारण शुद्धता व त्रुटि दर (CER मूल्यांकन)",
    moduleEn: "Character Error Rate (CER) Calculator",
    moduleHi: "कैरेक्टर एरर रेट (CER) गणना इंजन",
    descEn: "Comparing your spoken letters with the correct target word. Calculating CER (Character Error Rate) to pinpoint exact mistakes.",
    descHi: "आपके बोले गए अक्षरों की सही शब्द से तुलना। CER (कैरेक्टर एरर रेट) मापकर उच्चारण की सटीक गलतियों की पहचान।",
    telemetryEn: [
      { label: "Metric", value: "CER Calculation" },
      { label: "Target Match", value: "Letter-Level" },
      { label: "Error Detection", value: "Missing / Extra" },
      { label: "Status", value: "Computing Score" },
    ],
    telemetryHi: [
      { label: "मीट्रिक", value: "CER गणना" },
      { label: "शब्द मिलान", value: "वर्ण-स्तरीय" },
      { label: "त्रुटि पहचान", value: "लोप / अतिरिक्त" },
      { label: "स्थिति", value: "गणना जारी" },
    ],
  },
  {
    id: 4,
    code: "MITRA TIPS",
    codeHi: "मित्र सलाह",
    nameEn: "Mitra Articulation Guidance",
    nameHi: "मित्र वाक् थेरेपी मार्गदर्शन",
    moduleEn: "Mitra Speech Therapy Coach",
    moduleHi: "मित्र वाक् थेरेपी कोच",
    descEn: "Creating personalized tips on tongue position, lip movement, and breath flow to help you speak with clarity.",
    descHi: "व्यक्तिगत सलाह तैयार करना: जीभ की सही स्थिति, होंठों का फैलाव और सांस के प्रवाह से सही बोलना सिखाना।",
    telemetryEn: [
      { label: "Coach Engine", value: "Mitra Clinical AI" },
      { label: "Key Focus", value: "Tongue & Lip Placement" },
      { label: "Advice Type", value: "Speech Bio-mechanics" },
      { label: "Audio Prep", value: "Pre-synthesizing" },
    ],
    telemetryHi: [
      { label: "कोच इंजन", value: "मित्र क्लिनिकल AI" },
      { label: "मुख्य ध्यान", value: "जीभ व होंठों की स्थिति" },
      { label: "सलाह प्रकार", value: "ओष्ठ-संचालन गाइड" },
      { label: "ऑडियो तैयारी", value: "संश्लेषण जारी" },
    ],
  },
];

function MitraPipelineProgressInner({
  isEvaluating,
  targetWord = "",
  feedbackLanguage,
  className = "",
  isCompleted = false,
}: MitraPipelineProgressProps) {
  const { lang } = useLanguage();
  const currentLang = feedbackLanguage || lang;

  const [activeStepIndex, setActiveStepIndex] = useState(isCompleted ? 4 : 0);
  const [selectedInspectStep, setSelectedInspectStep] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [overallProgress, setOverallProgress] = useState(isCompleted ? 100 : 10);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active or user-selected stage
  const displayedStepIndex =
    selectedInspectStep !== null
      ? selectedInspectStep
      : isCompleted
      ? 3
      : Math.min(3, activeStepIndex);

  const currentStage = STAGES[displayedStepIndex];

  // Pipeline simulation timings
  useEffect(() => {
    if (!isEvaluating) {
      if (isCompleted) {
        const t = setTimeout(() => {
          setActiveStepIndex(4);
          setOverallProgress(100);
        }, 0);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setActiveStepIndex(0);
        setElapsedMs(0);
        setOverallProgress(10);
        setSelectedInspectStep(null);
      }, 0);
      return () => clearTimeout(t);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedMs(elapsed);

      if (elapsed < 380) {
        setActiveStepIndex(0);
        setOverallProgress(Math.min(25, 10 + (elapsed / 380) * 15));
      } else if (elapsed < 1150) {
        setActiveStepIndex(1);
        setOverallProgress(Math.min(55, 25 + ((elapsed - 380) / 770) * 30));
      } else if (elapsed < 1850) {
        setActiveStepIndex(2);
        setOverallProgress(Math.min(80, 55 + ((elapsed - 1150) / 700) * 25));
      } else {
        setActiveStepIndex(3);
        const extra = Math.min(18, ((elapsed - 1850) / 1600) * 18);
        setOverallProgress(Math.min(98, 80 + extra));
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isEvaluating, isCompleted]);

  // Keep latest state in ref for 60FPS canvas loop without dependency cycling
  const canvasStateRef = useRef({
    displayedStepIndex,
    isCompleted,
    targetWord,
    currentLang,
  });

  useEffect(() => {
    canvasStateRef.current = {
      displayedStepIndex,
      isCompleted,
      targetWord,
      currentLang,
    };
  }, [displayedStepIndex, isCompleted, targetWord, currentLang]);

  // Canvas RAF Render Loop (Warm SwarSaarthi Clay & Paper Theme)
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const {
        displayedStepIndex: stepIdx,
        isCompleted: completed,
        targetWord: word,
        currentLang: cLang,
      } = canvasStateRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const time = performance.now() * 0.003;

      // 1. Warm Clean Canvas Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Faint subtle warm grid lines
      ctx.strokeStyle = "rgba(185, 74, 42, 0.04)";
      ctx.lineWidth = 1;

      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Baseline (Warm Sand / Clay Tint)
      ctx.strokeStyle = "rgba(185, 74, 42, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const stageId = completed ? 4 : stepIdx + 1;

      // 2. Stage-Specific Clean Warm Visualizations
      if (stageId === 1) {
        // -------------------------------------------------------------
        // STAGE 1: Standardizing (Warm Clay Oscilloscope & VU Meter)
        // -------------------------------------------------------------
        const centerY = height / 2;
        const numPoints = 80;
        const stepX = width / (numPoints - 1);

        // Primary Wave in SwarSaarthi Clay (#b94a2a)
        ctx.beginPath();
        ctx.strokeStyle = "#b94a2a";
        ctx.lineWidth = 2.2;

        for (let i = 0; i < numPoints; i++) {
          const x = i * stepX;
          const envelope = Math.sin((i / numPoints) * Math.PI);
          const y =
            centerY +
            Math.sin(i * 0.28 + time * 4) * 20 * envelope +
            Math.cos(i * 0.55 - time * 2) * 10 * envelope;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary Harmonic Wave in soft clay tint
        ctx.beginPath();
        ctx.strokeStyle = "rgba(185, 74, 42, 0.22)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < numPoints; i++) {
          const x = i * stepX;
          const envelope = Math.sin((i / numPoints) * Math.PI);
          const y = centerY + Math.sin(i * 0.65 - time * 5) * 12 * envelope;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Right-side Volume Level VU Meter (Warm theme)
        const meterX = width - 36;
        const meterW = 16;
        const meterH = height - 24;
        const meterY = 12;

        ctx.fillStyle = "#f5ede4"; // warm mist
        ctx.fillRect(meterX, meterY, meterW, meterH);

        const level = 0.4 + 0.45 * Math.abs(Math.sin(time * 3));
        const fillH = meterH * level;

        const grad = ctx.createLinearGradient(meterX, meterY + meterH, meterX, meterY);
        grad.addColorStop(0, "#059669"); // Emerald
        grad.addColorStop(0.7, "#d97706"); // Amber
        grad.addColorStop(1, "#b94a2a"); // Clay

        ctx.fillStyle = grad;
        ctx.fillRect(meterX, meterY + meterH - fillH, meterW, fillH);

        // Meter labels
        ctx.fillStyle = "#8a8885";
        ctx.font = "8px sans-serif";
        ctx.fillText("Max", meterX - 18, meterY + 8);
        ctx.fillText("Mid", meterX - 18, meterY + meterH / 2);
        ctx.fillText("Min", meterX - 18, meterY + meterH);
      } else if (stageId === 2) {
        // -------------------------------------------------------------
        // STAGE 2: Speech AI Recognition (Frequency Spectrum & Hindi Letters)
        // -------------------------------------------------------------
        const barCount = 34;
        const barW = (width - 40) / barCount;

        for (let i = 0; i < barCount; i++) {
          const x = 12 + i * barW;
          const seed = Math.sin(i * 0.45 + time * 3.5) * 0.5 + 0.5;
          const barH = 8 + seed * (height - 38);
          const y = height - 12 - barH;

          const colGrad = ctx.createLinearGradient(x, height - 12, x, y);
          colGrad.addColorStop(0, "rgba(185, 74, 42, 0.12)");
          colGrad.addColorStop(1, "#b94a2a");

          ctx.fillStyle = colGrad;
          ctx.fillRect(x + 1, y, barW - 2, barH);
        }

        // Recognized Hindi Phoneme Token Slots
        const tokens = word ? word.split("").slice(0, 5) : ["आ", "वा", "ज़"];
        const slotW = Math.min(46, (width - 32) / Math.max(3, tokens.length));

        tokens.forEach((char, idx) => {
          const tx = 18 + idx * (slotW + 8);
          const ty = 12;

          // Slot background (warm clay soft)
          ctx.fillStyle = "#fdf0e8";
          ctx.strokeStyle = "#f3d5c6";
          ctx.lineWidth = 1.2;
          ctx.strokeRect(tx, ty, slotW, 26);
          ctx.fillRect(tx, ty, slotW, 26);

          ctx.fillStyle = "#b94a2a";
          ctx.font = "bold 13px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(char, tx + slotW / 2, ty + 18);

          // Active pulse dot
          ctx.fillStyle = "#b94a2a";
          ctx.beginPath();
          ctx.arc(tx + slotW - 6, ty + 6, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.textAlign = "start";
      } else if (stageId === 3) {
        // -------------------------------------------------------------
        // STAGE 3: Accuracy & CER (Clear Gold Target vs Spoken Comparison)
        // -------------------------------------------------------------
        const tokens = word ? word.split("").slice(0, 6) : ["स", "म", "ा", "क", "ल", "न"];
        const startX = 16;
        const cellW = Math.min(42, (width - 120) / Math.max(3, tokens.length));

        ctx.fillStyle = "#57534e";
        ctx.font = "bold 9px sans-serif";
        ctx.fillText(cLang === "hi" ? "सही शब्द" : "CORRECT", startX, 22);
        ctx.fillText(cLang === "hi" ? "आपकी आवाज़" : "SPOKEN", startX, 60);

        tokens.forEach((char, idx) => {
          const cx = startX + 64 + idx * (cellW + 6);

          // Target Reference Box (Emerald Green)
          ctx.fillStyle = "#e8f5f0";
          ctx.strokeStyle = "#5a8f7b";
          ctx.lineWidth = 1;
          ctx.strokeRect(cx, 10, cellW, 22);
          ctx.fillRect(cx, 10, cellW, 22);

          ctx.fillStyle = "#2e4439";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(char, cx + cellW / 2, 25);

          // Spoken Box (Clay Soft)
          ctx.fillStyle = "#fdf0e8";
          ctx.strokeStyle = "#f3d5c6";
          ctx.strokeRect(cx, 48, cellW, 22);
          ctx.fillRect(cx, 48, cellW, 22);

          ctx.fillStyle = "#b94a2a";
          ctx.fillText(char, cx + cellW / 2, 63);

          // Connecting Alignment Vector
          const progressMod = (Math.sin(time * 3 + idx * 0.8) + 1) / 2;
          ctx.strokeStyle = `rgba(90, 143, 123, ${0.4 + progressMod * 0.5})`;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(cx + cellW / 2, 32);
          ctx.lineTo(cx + cellW / 2, 48);
          ctx.stroke();
          ctx.setLineDash([]);
        });
        ctx.textAlign = "start";

        // Prominent, clear CER Result Box on Right
        const cerCardX = width - 78;
        ctx.fillStyle = "#e8f5f0";
        ctx.strokeStyle = "#5a8f7b";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(cerCardX, 12, 66, 56);
        ctx.fillRect(cerCardX, 12, 66, 56);

        ctx.fillStyle = "#2e4439";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("CER 0.0%", cerCardX + 33, 32);

        ctx.font = "bold 8.5px sans-serif";
        ctx.fillStyle = "#5a8f7b";
        ctx.fillText(cLang === "hi" ? "शुद्ध उच्चारण" : "100% MATCH", cerCardX + 33, 46);
        ctx.fillText(cLang === "hi" ? "सटीक संरेखण" : "VERIFIED", cerCardX + 33, 58);
        ctx.textAlign = "start";
      } else {
        // -------------------------------------------------------------
        // STAGE 4 / COMPLETED: Mitra Articulation Guidance Vectors
        // -------------------------------------------------------------
        const vectorCount = 4;
        const vSpacing = (width - 32) / vectorCount;
        const labels = [
          { en: "Tongue", hi: "जीभ स्थिति" },
          { en: "Lips", hi: "होंठ फैलाव" },
          { en: "Palate", hi: "तालु नियंत्रण" },
          { en: "Airflow", hi: "सांस प्रवाह" },
        ];

        for (let i = 0; i < vectorCount; i++) {
          const vx = 16 + i * vSpacing;
          const val = 0.55 + 0.35 * Math.sin(time * 2.8 + i * 1.2);

          // Card Background
          ctx.fillStyle = "#fdfbf7";
          ctx.strokeStyle = "#e9e2d8";
          ctx.lineWidth = 1;
          ctx.fillRect(vx, 18, vSpacing - 10, 48);
          ctx.strokeRect(vx, 18, vSpacing - 10, 48);

          // Fill bar in warm clay gradient
          const fillW = (vSpacing - 10) * val;
          const grad = ctx.createLinearGradient(vx, 0, vx + fillW, 0);
          grad.addColorStop(0, "#fdf0e8");
          grad.addColorStop(1, "#b94a2a");

          ctx.fillStyle = grad;
          ctx.fillRect(vx + 1, 19, fillW - 2, 46);

          // Label
          ctx.fillStyle = "#1a1a18";
          ctx.font = "bold 10px sans-serif";
          ctx.fillText(cLang === "hi" ? labels[i].hi : labels[i].en, vx + 5, 36);

          // Percentage
          ctx.font = "bold 11px monospace";
          ctx.fillStyle = "#b94a2a";
          ctx.fillText(`${Math.round(val * 100)}%`, vx + 5, 54);
        }

        // Bottom gentle sine wave
        ctx.beginPath();
        ctx.strokeStyle = "rgba(185, 74, 42, 0.35)";
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += 4) {
          const y = height - 8 + Math.sin(x * 0.08 + time * 3) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className={`rounded-3xl border border-stone-200/90 bg-linear-to-b from-white via-stone-50/50 to-warm-sand/20 shadow-xs overflow-hidden transition-all ${className}`}
      role="region"
      aria-label="Mitra Backend Pipeline Execution View"
    >
      {/* ================================================================= */}
      {/* COMPONENT HEADER: Warm SwarSaarthi Header Bar                     */}
      {/* ================================================================= */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          {/* Status Dot */}
          <span className="relative flex h-2.5 w-2.5">
            {!isCompleted ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-clay" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            )}
          </span>

          <span className="text-xs font-bold uppercase tracking-wider text-ink">
            {currentLang === "hi"
              ? "मित्र वाक् विश्लेषण पाइपलाइन"
              : "Mitra Speech Articulation Pipeline"}
          </span>
        </div>

        {/* Right Info Badges */}
        <div className="flex items-center gap-2">
          {targetWord && (
            <span className="px-2.5 py-0.5 rounded-full bg-warm-sand/80 text-ink font-hindi font-bold text-xs border border-stone-200/70">
              {targetWord}
            </span>
          )}
          <span className="text-[11px] font-mono font-bold text-zinc-700 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 shadow-2xs">
            {isCompleted ? "VERIFIED" : `${(elapsedMs / 1000).toFixed(1)}s`}
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PART 1: TOP DIV - VISUAL FLOW (Warm Clay / Sand Theme)           */}
      {/* ================================================================= */}
      <div className="p-4 bg-linear-to-b from-stone-50/70 via-warm-sand/20 to-stone-100/40 border-b border-stone-200/80">
        {/* Stage Node Bus Bar (Interactive Pipeline Nodes) */}
        <div className="relative mb-3.5">
          {/* Connecting Track Line */}
          <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-stone-200" />

          {/* Active Animated Progress Beam */}
          <div
            className="absolute top-3.5 left-4 h-0.5 bg-linear-to-r from-clay via-clay-hover to-emerald-600 transition-all duration-300"
            style={{
              width: isCompleted
                ? "calc(100% - 32px)"
                : `${Math.max(4, Math.min(100, (activeStepIndex / 3) * 100))}%`,
            }}
          />

          {/* 4 Interactive Nodes */}
          <div className="relative flex items-center justify-between">
            {STAGES.map((stg, idx) => {
              const isDone = isCompleted || activeStepIndex > idx;
              const isCurrent = !isCompleted && activeStepIndex === idx;
              const isInspected = displayedStepIndex === idx;

              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setSelectedInspectStep(idx)}
                  className={`group flex flex-col items-center focus:outline-none transition-all duration-150 ${
                    isInspected ? "scale-105" : "hover:opacity-90"
                  }`}
                  title={`${stg.nameEn} (Click to inspect)`}
                >
                  {/* Node Circle Badge */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ${
                      isDone
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-200"
                        : isCurrent
                        ? "bg-clay text-white ring-4 ring-clay-ring animate-pulse"
                        : "bg-white text-zinc-400 border border-stone-300"
                    }`}
                  >
                    {isDone ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3.5 h-3.5">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      `0${stg.id}`
                    )}
                  </div>

                  {/* Clean Simple Label Below */}
                  <span
                    className={`mt-1 text-[9.5px] uppercase tracking-wider font-bold transition-colors ${
                      isInspected
                        ? "text-ink"
                        : isCurrent
                        ? "text-clay"
                        : isDone
                        ? "text-emerald-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {currentLang === "hi" ? stg.codeHi : stg.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Warm Scope Canvas Viewport */}
        <div className="relative w-full h-24 rounded-2xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

          {/* Top Left Live Scope Badge */}
          <div className="absolute top-2 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 border border-stone-200/80 shadow-2xs pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider font-bold text-ink">
              {currentLang === "hi" ? currentStage.codeHi : currentStage.code}
            </span>
          </div>

          {/* Bottom Right Module Indicator */}
          <div className="absolute bottom-1.5 right-2.5 text-[9px] font-medium text-zinc-500 pointer-events-none">
            {currentLang === "hi" ? currentStage.moduleHi : currentStage.moduleEn}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* PART 2: BOTTOM DIV - CURRENT PROCESS & TELEMETRY INSPECTOR         */}
      {/* ================================================================= */}
      <div className="p-4 bg-white">
        {/* Step Context Details */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-clay-soft text-clay border border-clay-ring/60">
                {currentLang === "hi"
                  ? `चरण 0${currentStage.id} / 04`
                  : `STAGE 0${currentStage.id} / 04`}
              </span>
              <span className="text-[10.5px] text-zinc-500 font-medium truncate">
                {currentLang === "hi" ? currentStage.moduleHi : currentStage.moduleEn}
              </span>
            </div>

            {/* Stage Title */}
            <h4 className="text-sm font-bold text-ink leading-snug">
              {currentLang === "hi" ? currentStage.nameHi : currentStage.nameEn}
            </h4>

            {/* Clear, Simple Non-Jargon Description */}
            <p className="text-xs text-ink-soft mt-1 leading-relaxed">
              {currentLang === "hi" ? currentStage.descHi : currentStage.descEn}
            </p>
          </div>

          {/* Progress Micro-Meter */}
          <div className="shrink-0 text-right">
            <span className="text-xs font-mono font-bold text-clay">
              {Math.round(overallProgress)}%
            </span>
            <div className="w-16 h-1.5 rounded-full bg-stone-100 overflow-hidden mt-1 border border-stone-200">
              <div
                className="h-full bg-clay transition-all duration-150"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Clean Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2.5 border-t border-stone-100">
          {(currentLang === "hi"
            ? currentStage.telemetryHi
            : currentStage.telemetryEn
          ).map((item, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1.5 rounded-xl bg-warm-sand/20 border border-stone-200/70"
            >
              <div className="text-[9px] uppercase text-zinc-500 font-semibold truncate">
                {item.label}
              </div>
              <div className="text-[11px] font-bold text-ink truncate mt-0.5">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>
              {isCompleted
                ? currentLang === "hi"
                  ? "सभी 4 चरण पूर्ण • विश्लेषण समाप्त"
                  : "All 4 Stages Complete • Ready"
                : currentLang === "hi"
                ? "वाक् विश्लेषण प्रक्रिया जारी है..."
                : "Speech analysis in progress..."}
            </span>
          </span>

          <span className="font-semibold text-clay">
            SwarSaarthi AI
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(MitraPipelineProgressInner);
