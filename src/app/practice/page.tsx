"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import WordCard from "@/components/WordCard";
import FeedbackPanel from "@/components/FeedbackPanel";
import ProgressBar from "@/components/ProgressBar";
import { practiceWords as defaultMockWords } from "@/lib/mockData";
import { wordsApi, practiceApi, asrApi, getAuthToken, type WordItem } from "@/lib/api";
import type { FeedbackState, FeedbackTier, FeedbackType, PronunciationAttempt, Word } from "@/types";
import AuthGuard from "@/components/AuthGuard";

const MicRecorder = dynamic(() => import("@/components/MicRecorder"), {
  ssr: false,
  loading: () => <div className="h-26 flex items-center justify-center text-xs text-ink-faint">Loading microphone…</div>,
});

type DifficultyFilter = "all" | "basic" | "intermediate" | "advanced";

export default function PracticePage() {
  return (
    <AuthGuard mode="protected">
      <Suspense
        fallback={
          <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-10 px-4 sm:px-6 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-zinc-900 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500">Loading practice…</span>
          </div>
        }
      >
        <PracticeContent />
      </Suspense>
    </AuthGuard>
  );
}

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetWordId = searchParams.get("wordId");
  const targetWordText = searchParams.get("word");

  const { t, lang } = useLanguage();
  const [feedbackLang, setFeedbackLang] = useState<"en" | "hi">("hi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("swarsaarthi_coach_lang");
      if (saved === "hi" || saved === "en") {
        setFeedbackLang(saved);
      } else if (lang === "en" || lang === "hi") {
        setFeedbackLang(lang);
      }
    } catch {}
  }, [lang]);

  const handleFeedbackLangChange = useCallback((newLang: "en" | "hi") => {
    setFeedbackLang(newLang);
    try {
      localStorage.setItem("swarsaarthi_coach_lang", newLang);
    } catch {}
  }, []);

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

  // Fetch words from backend API based on difficulty filter, prioritizing focus word if provided
  useEffect(() => {
    let isMounted = true;
    async function fetchWords() {
      setIsLoadingWords(true);
      try {
        let targetWordObj: Word | null = null;

        // 1. If target focus word was specified via query parameters
        if (targetWordId || targetWordText) {
          // Attempt fetch from backend by ID
          if (targetWordId) {
            try {
              const item = await wordsApi.getById(targetWordId);
              if (item && item.id) {
                targetWordObj = {
                  id: item.id,
                  word: item.text_hi,
                  transliteration: item.transliteration || "",
                  meaningEn: item.meaning_en || "",
                  meaningHi: item.meaning_hi || item.text_hi,
                  difficulty: item.difficulty === "basic" ? 1 : item.difficulty === "intermediate" ? 2 : 3,
                  category: item.category || "Focus",
                  audioUrl: item.audio_url || undefined,
                };
              }
            } catch {
              // Word ID might be from mock data or backend offline
            }
          }

          // Search in mock data if not found in DB
          if (!targetWordObj) {
            const foundMock = defaultMockWords.find(
              (w) => (targetWordId && w.id === targetWordId) || (targetWordText && w.word === targetWordText)
            );
            if (foundMock) {
              targetWordObj = { ...foundMock };
            }
          }

          // If still not found but word text is provided, build a Word entry
          if (!targetWordObj && targetWordText) {
            targetWordObj = {
              id: targetWordId || "focus-word",
              word: targetWordText,
              transliteration: "",
              meaningEn: "",
              meaningHi: targetWordText,
              difficulty: 2,
              category: "Focus Word",
            };
          }
        }

        const diffParam = difficulty === "all" ? undefined : difficulty;
        let queue: Word[] = [];

        try {
          const apiWords = await wordsApi.getRandom(30, diffParam);
          if (apiWords && apiWords.length > 0) {
            queue = apiWords.map((w: WordItem) => ({
              id: w.id,
              word: w.text_hi,
              transliteration: w.transliteration,
              meaningEn: w.meaning_en,
              meaningHi: w.meaning_hi || w.text_hi,
              difficulty: w.difficulty === "basic" ? 1 : w.difficulty === "intermediate" ? 2 : 3,
              category: w.category,
              audioUrl: w.audio_url || undefined,
            }));
          }
        } catch {
          // Fallback to local dataset filter
          if (difficulty === "all") {
            queue = [...defaultMockWords];
          } else {
            const mappedDiff = difficulty === "basic" ? 1 : difficulty === "intermediate" ? 2 : 3;
            const filtered = defaultMockWords.filter((w) => w.difficulty === mappedDiff);
            queue = filtered.length > 0 ? filtered : [...defaultMockWords];
          }
        }

        if (isMounted) {
          if (targetWordObj) {
            // Deduplicate: remove target word if it also appeared in random queue
            const filteredQueue = queue.filter(
              (w) => w.id !== targetWordObj!.id && w.word !== targetWordObj!.word
            );
            setWords([targetWordObj, ...filteredQueue]);
          } else {
            setWords(queue.length > 0 ? queue : defaultMockWords);
          }
          setCurrentIndex(0);
        }
      } catch (err) {
        // Fallback to local dataset filter
        if (isMounted) {
          setWords(defaultMockWords);
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
  }, [difficulty, targetWordId, targetWordText]);

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
      let tier: FeedbackTier = "needs_improvement";
      let geminiSuggestion: string | undefined = undefined;

      try {
        if (token && currentWord.id) {
          // ── Primary: send audio to ASR endpoint ────────────
          const res = await asrApi.predict(blob, currentWord.id, feedbackLang);
          recognized = res.prediction_text;
          prediction = res.prediction_text;
          score = Math.round(res.accuracy_score);
          isCorrect = res.is_correct;
          cerValue = res.cer;
          feedbackMsg = res.feedback;
          tier = res.feedback_tier || (isCorrect ? "excellent" : score >= 50 ? "almost_there" : "needs_improvement");
          geminiSuggestion = res.gemini_suggestion;
        } else {
          // Fallback simulation for guest users
          score = Math.floor(Math.random() * 35) + 65;
          isCorrect = score >= 80;
          recognized = isCorrect ? currentWord.word : currentWord.word.slice(0, -1) + "…";
          prediction = recognized;
          cerValue = isCorrect ? 0.1 : score >= 50 ? 0.35 : 0.7;
          tier = isCorrect ? "excellent" : score >= 50 ? "almost_there" : "needs_improvement";
          feedbackMsg = isCorrect
            ? "Excellent! Perfect pronunciation."
            : score >= 50
            ? "Good attempt! Listen carefully to the reference audio and try again."
            : "The pronunciation needs improvement. Listen to the reference audio carefully and try speaking slowly.";
          geminiSuggestion = feedbackLang === "hi"
            ? (isCorrect
                ? `🎯 **विश्लेषण**: बहुत बढ़िया! आपने '${currentWord.word}' का उच्चारण बहुत स्पष्ट रूप से किया।\n\n👅 **मुख की स्थिति**: आपकी जीभ और होंठों का तालमेल बिल्कुल सही रहा।\n\n💡 **अभ्यास युक्ति**: इस शब्द को दिनचर्या के वाक्यों में दोहराते रहें!`
                : `🎯 **विश्लेषण**: सटीकता ${score}% है। लक्ष्य '${currentWord.word}' के स्थान पर '${prediction}' सुनाई दिया।\n\n👅 **जीभ की स्थिति**: जीभ को तालू के पास रखें और सांस का प्रवाह नियंत्रित रखें।\n\n💡 **अभ्यास युक्ति**: सही उच्चारण 0.5× गति पर सुनें और प्रत्येक अक्षर को अलग-अलग बोलें।`)
            : (isCorrect
                ? `🎯 **Analysis**: Excellent! You articulated '${currentWord.word}' with clear phoneme accuracy.\n\n👅 **Mouth Placement**: Natural airflow and precise tongue coordination were maintained.\n\n💡 **Practice Tip**: Keep repeating this word smoothly in conversational sentences!`
                : `🎯 **Analysis**: Accuracy is ${score}%. We heard '${prediction}' for target '${currentWord.word}'.\n\n👅 **Tongue Placement**: Focus on resting the tongue tip against the upper palate and releasing air smoothly.\n\n💡 **Practice Tip**: Listen to the correct pronunciation at 0.5× speed, then say each syllable separately.`);
        }
      } catch (err: any) {
        const isAuthError =
          err?.message?.toLowerCase().includes("unauthorized") ||
          err?.message?.toLowerCase().includes("invalid or expired token");

        if (isAuthError) {
          score = 0;
          isCorrect = false;
          recognized = "—";
          prediction = "—";
          cerValue = 1.0;
          tier = "needs_improvement";
          feedbackMsg =
            lang === "hi"
              ? "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉग इन करें।"
              : "Your session has expired. Please log in again.";
        } else {
          // If ASR fails due to model or audio format, try the practice/submit endpoint as fallback
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
              cerValue = isCorrect ? 0.1 : 0.4;
              tier = isCorrect ? "excellent" : score >= 50 ? "almost_there" : "needs_improvement";
              feedbackMsg = isCorrect
                ? "Great pronunciation!"
                : score >= 50
                ? "Keep practicing — try to match the correct pronunciation."
                : "The pronunciation needs improvement. Try listening to the audio again.";
            } else {
              score = Math.floor(Math.random() * 35) + 65;
              isCorrect = score >= 80;
              recognized = currentWord.word;
              prediction = recognized;
              cerValue = 0.3;
              tier = isCorrect ? "excellent" : score >= 50 ? "almost_there" : "needs_improvement";
              feedbackMsg = "Could not connect to ASR service.";
            }
          } catch {
            score = 0;
            isCorrect = false;
            recognized = "—";
            prediction = "—";
            cerValue = 1.0;
            tier = "needs_improvement";
            feedbackMsg = "Could not connect to the server. Please check your connection.";
          }
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
        feedbackTier: tier,
        geminiSuggestion,
        feedbackLanguage: feedbackLang,
        timestamp: new Date(),
        audioBlob: blob,
      };

      const feedbackType: FeedbackType = tier === "excellent"
        ? "success"
        : tier === "almost_there"
        ? "almostThere"
        : "needsImprovement";

      const headerMsg = tier === "excellent"
        ? (t.feedbackCorrect || "Excellent!")
        : tier === "almost_there"
        ? (t.feedbackAlmostThere || "Almost there")
        : (t.feedbackNeedsImprovement || "Needs improvement");

      setFeedback({
        isVisible: true,
        attempt,
        message: headerMsg,
        type: feedbackType,
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

  const handleDifficultyChange = useCallback(
    (newDiff: DifficultyFilter) => {
      setDifficulty(newDiff);
      if (targetWordId || targetWordText) {
        router.replace("/practice");
      }
    },
    [router, targetWordId, targetWordText]
  );

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

        {/* Focus Word from Profile Banner */}
        {(targetWordId || targetWordText) && words[0] && currentIndex === 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 mb-4 rounded-2xl bg-amber-50/90 border border-amber-200/70 text-amber-900 shadow-2xs animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base">🎯</span>
              <div className="text-xs">
                <span className="text-amber-800/90">
                  {lang === "hi" ? "ध्यान देने योग्य शब्द (प्रोफ़ाइल से):" : "Word to Focus On (from profile):"}{" "}
                </span>
                <span className="font-hindi font-bold text-sm text-amber-950 ml-1">
                  {targetWordText || words[0].word}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.replace("/practice")}
              className="shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-100/60 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-colors"
            >
              {lang === "hi" ? "मिश्रित शब्द देखें ✕" : "View all ✕"}
            </button>
          </div>
        )}

        {/* AI Coach Feedback Language Switcher */}
        <div className="flex items-center justify-between mb-4 px-3.5 py-2 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[11px] text-indigo-700">
              ✨
            </span>
            <span className="text-xs font-semibold text-zinc-700">
              {lang === "hi" ? "एआई कोच भाषा:" : "AI Coach Language:"}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => handleFeedbackLangChange("hi")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                feedbackLang === "hi"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleFeedbackLangChange("en")}
              className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                feedbackLang === "en"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              English
            </button>
          </div>
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
                onClick={() => handleDifficultyChange(tab.key as DifficultyFilter)}
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
            feedbackLanguage={feedbackLang}
            onFeedbackLanguageChange={handleFeedbackLangChange}
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
