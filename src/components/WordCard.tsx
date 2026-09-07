"use client";

import { useState } from "react";
import { speakHindi } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
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

export default function WordCard({ word, isCorrect }: WordCardProps) {
  const { t, lang } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      await speakHindi(word.word);
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div
      className={`card p-7 sm:p-8 text-center transition-colors duration-150 ${
        isCorrect ? "border-moss bg-moss-soft" : ""
      }`}
    >
      <div className="flex justify-center gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i < word.difficulty ? "bg-ink" : "bg-stone"}`}
            title={`Difficulty: ${word.difficulty}/5`}
          />
        ))}
      </div>

      <h2 className="text-5xl sm:text-6xl font-bold font-hindi text-ink leading-none tracking-tight">
        {word.word}
      </h2>

      <p className="text-sm text-ink-soft italic mt-3">{word.transliteration}</p>

      <p className="text-xs text-ink-faint mt-2">
        <span className="font-medium text-ink-soft">{t.meaningLabel}:</span>{" "}
        {lang === "hi" ? word.meaningHi : word.meaningEn}
      </p>

      <div className="rule my-6" />

      <button
        onClick={handleListen}
        disabled={isSpeaking}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-colors duration-150 ${
          isSpeaking
            ? "bg-mist border-line text-ink-soft cursor-wait"
            : "bg-white border-line text-ink hover:border-stone-strong hover:bg-mist"
        }`}
        aria-label={t.listenCorrect}
      >
        <SpeakerIcon className={`w-4 h-4 ${isSpeaking ? "opacity-60" : "text-ink-soft"}`} />
        {isSpeaking ? "..." : t.listenCorrect}
      </button>
    </div>
  );
}
