"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { speakHindi } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import TtsSpeedControl, { useTtsSpeed } from "@/components/TtsSpeedControl";
import type { Word } from "@/types";

interface WordCardProps {
  word: Word;
  isCorrect?: boolean;
}

function SpeakerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M11 5L7 9H3v6h4l4 4V5Z" strokeLinejoin="round" />
      <path d="M14 9a4 4 0 0 1 0 6M17 7a7 7 0 0 1 0 10" strokeLinecap="round" />
    </svg>
  );
}

function WordCardInner({ word, isCorrect }: WordCardProps) {
  const { t, lang } = useLanguage();
  const [speed, setSpeed] = useTtsSpeed();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListenAtSpeed = useCallback(
    async (playbackSpeed: number) => {
      if (isSpeaking) return;
      setIsSpeaking(true);
      try {
        await speakHindi(word.word, playbackSpeed);
      } catch (error) {
        console.error("TTS error:", error);
      } finally {
        setIsSpeaking(false);
      }
    },
    [isSpeaking, word.word]
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

  // meaning is derived — memo to avoid string concat on every parent re-render
  const meaning = useMemo(
    () => (lang === "hi" ? word.meaningHi : word.meaningEn),
    [lang, word.meaningHi, word.meaningEn]
  );

  return (
    <div
      className={`card p-7 sm:p-8 text-center transition-colors duration-150 ${
        isCorrect ? "border-moss bg-moss-soft" : ""
      }`}
    >
      <div className="flex justify-center gap-1 mb-5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i < word.difficulty ? "bg-ink" : "bg-stone"}`}
          />
        ))}
      </div>

      <h2 className="text-5xl sm:text-6xl font-bold font-hindi text-ink leading-none tracking-tight">
        {word.word}
      </h2>
      <p className="text-sm text-ink-soft italic mt-3">{word.transliteration}</p>
      <p className="text-xs text-ink-faint mt-2">
        <span className="font-medium text-ink-soft">{t.meaningLabel}:</span> {meaning}
      </p>

      <div className="rule my-6" />

      {/* Playback Controls & Speed Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleListen}
          disabled={isSpeaking}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border transition-all duration-150 shadow-2xs ${
            isSpeaking
              ? "bg-mist border-line text-ink-soft cursor-wait scale-[0.98]"
              : "bg-white border-line text-ink hover:border-stone-strong hover:bg-mist active:scale-95"
          }`}
          aria-label={t.listenCorrect}
        >
          <SpeakerIcon
            className={`w-4 h-4 transition-transform ${
              isSpeaking ? "opacity-70 text-clay animate-pulse scale-110" : "text-ink-soft"
            }`}
          />
          <span>{isSpeaking ? "..." : t.listenCorrect}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone/60 text-ink-soft border border-line">
            {speed}×
          </span>
        </button>

        <TtsSpeedControl
          speed={speed}
          onSpeedSelect={handleSpeedSelect}
        />
      </div>
    </div>
  );
}

export default memo(WordCardInner);

