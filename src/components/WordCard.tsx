/**
 * SwarSaarthi — WordCard Component
 *
 * Displays the current Hindi word prominently in the practice room.
 * Features:
 *  - Large Devanagari text display
 *  - Romanized transliteration hint below
 *  - Meaning in English/Hindi (based on UI language)
 *  - "Listen" button to hear correct pronunciation via TTS
 *
 * TODO: When backend TTS is ready, replace speakHindi() with:
 *   const audio = new Audio(`/api/tts/${word.id}`);
 *   audio.play();
 */

"use client";

import { useState } from "react";
import { speakHindi } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import type { Word } from "@/types";

interface WordCardProps {
  word: Word;
  /** Whether the word was just pronounced correctly (triggers success glow) */
  isCorrect?: boolean;
}

export default function WordCard({ word, isCorrect }: WordCardProps) {
  const { t, lang } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      /**
       * TODO: Replace with backend TTS when available:
       *   const audioUrl = await fetch(`/api/tts/${word.id}`).then(r => r.blob());
       *   const audio = new Audio(URL.createObjectURL(audioUrl));
       *   await audio.play();
       */
      await speakHindi(word.word);
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div
      className={`card-warm p-8 sm:p-10 text-center transition-all duration-500 ${
        isCorrect ? "glow-success border-success" : ""
      }`}
    >
      {/* Difficulty indicator — small dots */}
      <div className="flex justify-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < word.difficulty ? "bg-accent" : "bg-primary-100"
            }`}
            title={`Difficulty: ${word.difficulty}/5`}
          />
        ))}
      </div>

      {/* Main Hindi word — large and prominent */}
      <h2 className="text-5xl sm:text-7xl font-bold font-hindi text-text-primary mb-4 animate-fade-in">
        {word.word}
      </h2>

      {/* Transliteration */}
      <p className="text-lg text-text-secondary italic mb-2">
        {word.transliteration}
      </p>

      {/* Meaning */}
      <p className="text-sm text-text-muted mb-6">
        <span className="font-medium text-text-secondary">
          {t.meaningLabel}:
        </span>{" "}
        {lang === "hi" ? word.meaningHi : word.meaningEn}
      </p>

      {/* Listen button — plays TTS pronunciation */}
      <button
        onClick={handleListen}
        disabled={isSpeaking}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
          isSpeaking
            ? "bg-primary-100 text-primary cursor-wait"
            : "bg-primary-50 text-primary hover:bg-primary-100 hover:shadow-sm active:scale-95"
        }`}
        aria-label={t.listenCorrect}
      >
        <span
          className={`text-lg ${isSpeaking ? "animate-bounce-gentle" : ""}`}
        >
          🔊
        </span>
        {t.listenCorrect}
      </button>
    </div>
  );
}
