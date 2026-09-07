/**
 * SwarSaarthi — Practice Room Page
 *
 * The core page where users practice Hindi pronunciation.
 *
 * Flow:
 *  1. Display a Hindi word from the dataset
 *  2. User can click "Listen" to hear correct pronunciation (TTS)
 *  3. User clicks the mic button to record their pronunciation
 *  4. After recording, show feedback (mock for now)
 *  5. If correct → auto-advance to next word
 *  6. If incorrect → show "try again" option
 *
 * FUTURE BACKEND INTEGRATION:
 *  - Words: Replace practiceWords import with GET /api/words
 *  - ASR: Send audio blob to POST /api/asr
 *  - Comparison: Send recognized text to POST /api/compare
 *  - TTS: Replace speakHindi() with GET /api/tts/:wordId
 *  - Progress: Save results via POST /api/progress
 */

"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import WordCard from "@/components/WordCard";
import MicRecorder from "@/components/MicRecorder";
import FeedbackPanel from "@/components/FeedbackPanel";
import ProgressBar from "@/components/ProgressBar";
import { practiceWords } from "@/lib/mockData";
import type { FeedbackState, PronunciationAttempt } from "@/types";

export default function PracticePage() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({
    isVisible: false,
    attempt: null,
    message: t.feedbackNeutral,
    type: "neutral",
  });

  const currentWord = practiceWords[currentIndex];
  const totalWords = practiceWords.length;

  /**
   * Handle recording completion.
   *
   * Currently generates MOCK feedback since there's no backend ASR.
   * The audio blob is received but not sent anywhere yet.
   *
   * TODO: When backend is ready, replace this with:
   *   1. Send blob to POST /api/asr → get transcribedText
   *   2. Send { transcribedText, expectedText } to POST /api/compare → get score
   *   3. Display real feedback based on comparison result
   *   4. Save result via POST /api/progress
   */
  const handleRecordingComplete = useCallback(
    (blob: Blob) => {
      console.log("Audio blob received:", blob.size, "bytes", blob.type);
      // TODO: Send blob to backend ASR endpoint
      // const formData = new FormData();
      // formData.append("audio", blob, "recording.webm");
      // const res = await fetch("/api/asr", { method: "POST", body: formData });
      // const { transcribedText } = await res.json();

      // ============================================================
      // MOCK FEEDBACK — Simulates ASR + NLP comparison
      // Remove this block when backend is connected
      // ============================================================
      const mockScore = Math.floor(Math.random() * 60) + 40; // 40-100
      const isCorrect = mockScore >= 75;

      // Simulate some "recognized" text variations
      const mockRecognized = isCorrect
        ? currentWord.word
        : currentWord.word.slice(0, -1) + "...";

      const attempt: PronunciationAttempt = {
        wordId: currentWord.id,
        recognizedText: mockRecognized,
        expectedText: currentWord.word,
        score: mockScore,
        isCorrect,
        timestamp: new Date(),
        audioBlob: blob,
      };

      setFeedback({
        isVisible: true,
        attempt,
        message: isCorrect ? t.feedbackCorrect : t.feedbackTryAgain,
        type: isCorrect ? "success" : "tryAgain",
      });
      // ============================================================
    },
    [currentWord, t],
  );

  /** Reset feedback and allow re-recording */
  const handleTryAgain = useCallback(() => {
    setFeedback({
      isVisible: false,
      attempt: null,
      message: t.feedbackNeutral,
      type: "neutral",
    });
  }, [t]);

  /** Advance to the next word */
  const handleNextWord = useCallback(() => {
    setFeedback({
      isVisible: false,
      attempt: null,
      message: t.feedbackNeutral,
      type: "neutral",
    });
    setCurrentIndex((prev) => (prev + 1) % totalWords);
  }, [t, totalWords]);

  /** Go to previous word */
  const handlePrevWord = useCallback(() => {
    setFeedback({
      isVisible: false,
      attempt: null,
      message: t.feedbackNeutral,
      type: "neutral",
    });
    setCurrentIndex((prev) => (prev - 1 + totalWords) % totalWords);
  }, [t, totalWords]);

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">{t.practiceTitle}</h1>
          <span className="h-px flex-1 bg-line hidden sm:block" />
          <span className="text-xs text-ink-faint border border-line rounded-full px-2.5 py-1 bg-white">
            {currentIndex + 1} / {totalWords}
          </span>
        </div>

        <div className="mb-6">
          <ProgressBar current={currentIndex} total={totalWords} />
        </div>

        <div className="mb-6">
          <WordCard word={currentWord} isCorrect={feedback.type === "success"} />
        </div>

        <div className="mb-6">
          <MicRecorder onRecordingComplete={handleRecordingComplete} disabled={feedback.isVisible} />
        </div>

        <div className="mb-6">
          <FeedbackPanel
            feedback={feedback}
            expectedWord={currentWord.word}
            onTryAgain={handleTryAgain}
            onNextWord={handleNextWord}
          />
        </div>

        <div className="flex justify-between items-center border-t border-line pt-4">
          <button
            onClick={handlePrevWord}
            className="px-4 py-2 rounded-full text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150"
          >
            <span aria-hidden>←</span> {t.prevWord}
          </button>
          <button
            onClick={handleNextWord}
            className="px-4 py-2 rounded-full text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150"
          >
            {t.skipWord} <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
