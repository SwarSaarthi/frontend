"use client";

import { memo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { speakHindi, stopSpeaking } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import TtsSpeedControl, { useTtsSpeed } from "@/components/TtsSpeedControl";

// Dynamic import with ssr: false for client-side Three.js WebGL canvas
const ThreeSpeechFace = dynamic(() => import("@/components/ThreeSpeechFace"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center rounded-2xl bg-stone-100/50 animate-pulse text-xs text-stone-400 font-medium">
      <div className="w-20 h-20 rounded-full bg-stone-200/70 mb-3" />
      <span>Loading 3D Articulation Model...</span>
    </div>
  ),
});

interface SpeechAvatarProps {
  word: string;
  disabled?: boolean;
  className?: string;
}

function SpeakerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <path d="M11 5L7 9H3v6h4l4 4V5Z" strokeLinejoin="round" />
      <path d="M14 9a4 4 0 0 1 0 6M17 7a7 7 0 0 1 0 10" strokeLinecap="round" />
    </svg>
  );
}

function SpeechAvatarInner({ word, disabled = false, className = "" }: SpeechAvatarProps) {
  const { t, lang } = useLanguage();
  const [speed, setSpeed] = useTtsSpeed();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListenAtSpeed = useCallback(
    async (playbackSpeed: number) => {
      if (isSpeaking || disabled || !word) return;
      setIsSpeaking(true);
      try {
        await speakHindi(word, playbackSpeed);
      } catch (error) {
        console.error("Speech avatar TTS error:", error);
      } finally {
        setIsSpeaking(false);
      }
    },
    [isSpeaking, disabled, word]
  );

  const handleListen = useCallback(() => {
    handleListenAtSpeed(speed);
  }, [handleListenAtSpeed, speed]);

  const handleSpeedSelect = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed);
      handleListenAtSpeed(newSpeed);
    },
    [setSpeed, handleListenAtSpeed]
  );

  return (
    <div
      className={`rounded-3xl border border-stone-200/90 bg-linear-to-b from-white via-stone-50/50 to-warm-sand/30 p-6 sm:p-7 shadow-xs text-center transition-all ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
            {lang === "hi" ? "3D वाक् व मुखाकृति मॉडल" : "3D Speech & Lip-Sync"}
          </h3>
          <p className="text-[10px] text-ink-faint font-medium">
            {lang === "hi"
              ? "सटीक ओष्ठ-संचालन गाइड"
              : "Precise Lip Articulation Guide"}
          </p>
        </div>

        {/* Live Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            isSpeaking
              ? "bg-clay/10 text-clay border-clay/30 shadow-2xs"
              : "bg-white text-zinc-500 border-stone-200/80"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSpeaking ? "bg-clay animate-ping" : "bg-stone-300"
            }`}
          />
          <span>
            {isSpeaking
              ? lang === "hi"
                ? `उच्चारण जारी (${speed}×)…`
                : `Speaking (${speed}×)…`
              : lang === "hi"
                ? "तैयार"
                : "Ready"}
          </span>
        </div>
      </div>

      {/* 3D Articulation Model Stage */}
      <div className="relative mx-auto my-2 w-full max-w-85 rounded-2xl bg-linear-to-b from-stone-50 via-warm-sand/20 to-stone-100/40 border border-stone-200/80 shadow-inner overflow-hidden transition-all duration-300">
        {/* Subtle accent glow while articulating */}
        {isSpeaking && (
          <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-clay/30 shadow-[inset_0_0_24px_rgba(198,93,62,0.12)] z-10 transition-all duration-300" />
        )}

        <ThreeSpeechFace
          word={word}
          isSpeaking={isSpeaking}
          speed={speed}
          className="w-full h-72 sm:h-80"
        />
      </div>

      {/* Target Word Subtitle */}
      <div className="mt-3 mb-4">
        <p className="text-[11px] uppercase tracking-wider text-ink-faint font-semibold">
          {lang === "hi" ? "लक्ष्य शब्द" : "Target Word"}
        </p>
        <p className="text-2xl sm:text-3xl font-bold font-hindi text-ink leading-tight">
          {word}
        </p>
      </div>

      {/* "Listen to correct pronunciation" & Speed Selector */}
      <div className="flex flex-col items-center justify-center gap-3 pt-3 border-t border-stone-200/80">
        <button
          onClick={handleListen}
          disabled={isSpeaking || disabled}
          className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold border transition-all duration-150 shadow-xs active:scale-[0.98] ${
            isSpeaking
              ? "bg-clay text-white border-clay shadow-clay-ring/60 cursor-wait"
              : disabled
                ? "bg-stone-100 text-zinc-400 border-stone-200 cursor-not-allowed"
                : "bg-clay text-white border-clay hover:bg-clay-hover shadow-xs"
          }`}
          aria-label={t.listenCorrect}
        >
          <SpeakerIcon
            className={`w-4 h-4 shrink-0 transition-transform ${
              isSpeaking ? "animate-pulse scale-110" : "text-white"
            }`}
          />
          <span>
            {isSpeaking
              ? lang === "hi"
                ? "सुन रहे हैं..."
                : "Playing..."
              : t.listenCorrect}
          </span>
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${
              isSpeaking
                ? "bg-clay-hover text-white border-white/20"
                : "bg-white/20 text-white border-white/30"
            }`}
          >
            {speed}×
          </span>
        </button>

        {/* Speed Selector Tabs (0.5×, 0.75×, 1.0×) */}
        <TtsSpeedControl
          speed={speed}
          onSpeedSelect={handleSpeedSelect}
          size="sm"
          showLabel={true}
        />
      </div>
    </div>
  );
}

export default memo(SpeechAvatarInner);
