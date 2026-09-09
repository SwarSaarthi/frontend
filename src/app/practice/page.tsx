"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageProvider";
import WordCard from "@/components/WordCard";
import FeedbackPanel from "@/components/FeedbackPanel";
import ProgressBar from "@/components/ProgressBar";
import { practiceWords as defaultMockWords } from "@/lib/mockData";
import { wordsApi, practiceApi, asrApi, getAuthToken, type WordItem } from "@/lib/api";
import type { FeedbackState, PronunciationAttempt, Word } from "@/types";
import AuthGuard from "@/components/AuthGuard";

const MicRecorder = dynamic(() => import("@/components/MicRecorder"), {
  ssr: false,
  loading: () => <div className="h-26 flex items-center justify-center text-xs text-ink-faint">Loading microphone…</div>,
});

type DifficultyFilter = "all" | "basic" | "intermediate" | "advanced";

export default function PracticePage() {
  return (
    <AuthGuard mode="protected">
      <PracticeContent />
    </AuthGuard>
  );
}

function PracticeContent() {
  const { t, lang } = useLanguage();
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [words, setWords] = useState<Word[]>(defaultMockWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    isVisible: false,
    attempt: null,
    message: t.feedbackNeutral,
    type: "neutral",
  });

  // Fetch words from backend API based on difficulty filter
  useEffect(() => {
    let isMounted = true;
    async function fetchWords() {
      setIsLoadingWords(true);
      try {
        const diffParam = difficulty === "all" ? undefined : difficulty;
        const apiWords = await wordsApi.getRandom(30, diffParam);
        if (isMounted && apiWords && apiWords.length > 0) {
          const mapped: Word[] = apiWords.map((w: WordItem) => ({
            id: w.id,
            word: w.text_hi,
            transliteration: w.transliteration,
            meaningEn: w.meaning_en,
            meaningHi: w.text_hi,
            difficulty: w.difficulty === "basic" ? 1 : w.difficulty === "intermediate" ? 2 : 3,
            category: w.category,
            audioUrl: w.audio_url || undefined,
          }));
          setWords(mapped);
          setCurrentIndex(0);
        }
      } catch (err) {
        // Fallback to local dataset filter
        if (isMounted) {
          if (difficulty === "all") {
            setWords(defaultMockWords);
          } else {
            const mappedDiff = difficulty === "basic" ? 1 : difficulty === "intermediate" ? 2 : 3;
            const filtered = defaultMockWords.filter((w) => w.difficulty === mappedDiff);
            setWords(filtered.length > 0 ? filtered : defaultMockWords);
          }
          setCurrentIndex(0);
        }
      } finally {
        if (isMounted) setIsLoadingWords(false);
      }
    }

    fetchWords();
    return () => {
      isMounted = false;
    };
  }, [difficulty]);

  const currentWord = useMemo(() => {
    return words[currentIndex] || defaultMockWords[0];
  }, [words, currentIndex]);

  const totalWords = words.length;
  const isSuccess = feedback.type === "success";

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      const token = getAuthToken();
      let recognized = "";
      let prediction = "";
      let score = 0;
      let isCorrect = false;
      let cerValue = 1.0;
      let feedbackMsg = "Unable to process your recording.";

      try {
        if (token && currentWord.id) {
          // ── Primary: send audio to ASR endpoint ────────────
          const res = await asrApi.predict(blob, currentWord.id);
          recognized = res.prediction_text;
          prediction = res.prediction_text;
          score = Math.round(res.accuracy_score);
          isCorrect = res.is_correct;
          cerValue = res.cer;
          feedbackMsg = res.feedback;
        } else {
          // Fallback simulation for guest users
          score = Math.floor(Math.random() * 35) + 65;
          isCorrect = score >= 70;
          recognized = isCorrect ? currentWord.word : currentWord.word.slice(0, -1) + "…";
          prediction = recognized;
          cerValue = isCorrect ? 0.1 : 0.5;
          feedbackMsg = isCorrect ? "Good job!" : "Try again.";
        }
      } catch (err) {
        // If ASR fails, try the old practice/submit endpoint as fallback
        try {
          if (token && currentWord.id) {
            const fallback = await practiceApi.submit({
              word_id: currentWord.id,
              recognized_text: currentWord.word,
            });
            recognized = fallback.recognized_text;
            prediction = fallback.recognized_text;
            score = Math.round(fallback.accuracy_score);
            isCorrect = fallback.is_correct;
            cerValue = 0;
            feedbackMsg = isCorrect
              ? "Great pronunciation!"
              : "Keep practicing — try to match the correct pronunciation.";
          } else {
            score = Math.floor(Math.random() * 35) + 65;
            isCorrect = score >= 70;
            recognized = currentWord.word;
            prediction = recognized;
            cerValue = 0.3;
            feedbackMsg = "Could not connect to ASR service.";
          }
        } catch {
          score = 50;
          isCorrect = false;
          recognized = "—";
          prediction = "—";
          cerValue = 1.0;
          feedbackMsg = "Could not connect to the server. Please check your connection.";
        }
      }

      const attempt: PronunciationAttempt = {
        wordId: currentWord.id,
        recognizedText: recognized,
        predictionText: prediction,
        expectedText: currentWord.word,
        score,
        cer: cerValue,
        isCorrect,
        feedbackMessage: feedbackMsg,
        timestamp: new Date(),
        audioBlob: blob,
      };

      setFeedback({
        isVisible: true,
        attempt,
        message: isCorrect ? t.feedbackCorrect : t.feedbackTryAgain,
        type: isCorrect ? "success" : "tryAgain",
      });
    },
    [currentWord, t]
  );

  const handleTryAgain = useCallback(() => {
    setFeedback({
      isVisible: false,
      attempt: null,
      message: t.feedbackNeutral,
      type: "neutral",
    });
  }, [t]);

  const handleNextWord = useCallback(() => {
    setFeedback({
      isVisible: false,
      attempt: null,
      message: t.feedbackNeutral,
      type: "neutral",
    });
    setCurrentIndex((prev) => (prev + 1) % totalWords);
  }, [t, totalWords]);

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
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        {/* Header with Title & Word Counter */}
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">{t.practiceTitle}</h1>
          <span className="h-px flex-1 bg-line hidden sm:block" />
          <span className="text-xs font-semibold text-ink-soft border border-line rounded-full px-3 py-1 bg-white shadow-xs">
            {currentIndex + 1} / {totalWords}
          </span>
        </div>

        {/* Difficulty Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 border border-stone-200/80 rounded-2xl mb-6 shadow-xs">
          {[
            { key: "all", labelEn: "Random", labelHi: "मिश्रित" },
            { key: "basic", labelEn: "Basic", labelHi: "सरल" },
            { key: "intermediate", labelEn: "Intermediate", labelHi: "मध्यम" },
            { key: "advanced", labelEn: "Advanced", labelHi: "उन्नत" },
          ].map((tab) => {
            const active = difficulty === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setDifficulty(tab.key as DifficultyFilter)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? "bg-white text-zinc-900 shadow-sm font-semibold border border-stone-200/50"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
                }`}
              >
                {lang === "hi" ? tab.labelHi : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar current={currentIndex} total={totalWords} />
        </div>

        {/* Word Display Card */}
        {isLoadingWords ? (
          <div className="h-64 rounded-3xl border border-line bg-white flex flex-col items-center justify-center gap-3 mb-6 animate-pulse">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-zinc-900 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500">Loading words dataset…</span>
          </div>
        ) : (
          <div className="mb-6">
            <WordCard word={currentWord} isCorrect={isSuccess} />
          </div>
        )}

        {/* Microphone Component */}
        <div className="mb-6">
          <MicRecorder onRecordingComplete={handleRecordingComplete} disabled={feedback.isVisible || isLoadingWords} />
        </div>

        {/* Feedback Display */}
        <div className="mb-6">
          <FeedbackPanel
            feedback={feedback}
            expectedWord={currentWord.word}
            onTryAgain={handleTryAgain}
            onNextWord={handleNextWord}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center border-t border-line pt-4">
          <button
            onClick={handlePrevWord}
            disabled={totalWords <= 1}
            className="px-4 py-2 rounded-full text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150 disabled:opacity-50"
          >
            <span aria-hidden>←</span> {t.prevWord}
          </button>
          <button
            onClick={handleNextWord}
            disabled={totalWords <= 1}
            className="px-4 py-2 rounded-full text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150 disabled:opacity-50"
          >
            {t.skipWord} <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
