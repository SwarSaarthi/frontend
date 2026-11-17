"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import WordCard from "@/components/WordCard";
import FeedbackPanel from "@/components/FeedbackPanel";
import SpeechAvatar from "@/components/SpeechAvatar";
import MitraPipelineProgress from "@/components/MitraPipelineProgress";
import ProgressBar from "@/components/ProgressBar";
import { practiceWords as defaultMockWords, practiceSentences as defaultMockSentences } from "@/lib/mockData";
import { wordsApi, practiceApi, asrApi, getAuthToken, type WordItem } from "@/lib/api";
import type { FeedbackState, FeedbackTier, FeedbackType, PronunciationAttempt, Word } from "@/types";
import AuthGuard from "@/components/AuthGuard";

const MicRecorder = dynamic(() => import("@/components/MicRecorder"), {
  ssr: false,
  loading: () => (
    <div className="h-24 flex items-center justify-center text-xs text-ink-faint">
      Loading microphone…
    </div>
  ),
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
  const [feedbackLang, setFeedbackLang] = useState<"en" | "hi">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("swarsaarthi_coach_lang");
        if (saved === "hi" || saved === "en") return saved;
      } catch {}
    }
    return "hi";
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleFeedbackLangChange = useCallback((newLang: "en" | "hi") => {
    setFeedbackLang(newLang);
    try {
      localStorage.setItem("swarsaarthi_coach_lang", newLang);
    } catch {}
  }, []);

  const [practiceMode, setPracticeMode] = useState<"word" | "sentence">("word");
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

  const activeMockList = useMemo(() => {
    return practiceMode === "sentence" ? defaultMockSentences : defaultMockWords;
  }, [practiceMode]);

  // Fetch words or sentences from backend API based on practice mode and difficulty filter
  useEffect(() => {
    let isMounted = true;
    async function fetchWords() {
      setIsLoadingWords(true);
      try {
        let targetWordObj: Word | null = null;

        // 1. If target focus word was specified via query parameters (only applies to word mode)
        if (practiceMode === "word" && (targetWordId || targetWordText)) {
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
                  itemType: (item.item_type as "word" | "sentence") || "word",
                };
              }
            } catch {
              // Word ID might be from mock data or backend offline
            }
          }

          if (!targetWordObj) {
            const foundMock = defaultMockWords.find(
              (w) => (targetWordId && w.id === targetWordId) || (targetWordText && w.word === targetWordText)
            );
            if (foundMock) {
              targetWordObj = { ...foundMock };
            }
          }

          if (!targetWordObj && targetWordText) {
            targetWordObj = {
              id: targetWordId || "focus-word",
              word: targetWordText,
              transliteration: "",
              meaningEn: "",
              meaningHi: targetWordText,
              difficulty: 2,
              category: "Focus Word",
              itemType: "word",
            };
          }
        }

        const diffParam = difficulty === "all" ? undefined : difficulty;
        let queue: Word[] = [];

        try {
          const apiWords = await wordsApi.getRandom(30, diffParam, practiceMode);
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
              itemType: (w.item_type as "word" | "sentence") || practiceMode,
            }));
          }
        } catch {
          if (difficulty === "all") {
            queue = [...activeMockList];
          } else {
            const mappedDiff = difficulty === "basic" ? 1 : difficulty === "intermediate" ? 2 : 3;
            const filtered = activeMockList.filter((w) => w.difficulty === mappedDiff);
            queue = filtered.length > 0 ? filtered : [...activeMockList];
          }
        }

        if (isMounted) {
          if (targetWordObj) {
            const filteredQueue = queue.filter(
              (w) => w.id !== targetWordObj!.id && w.word !== targetWordObj!.word
            );
            setWords([targetWordObj, ...filteredQueue]);
          } else {
            setWords(queue.length > 0 ? queue : activeMockList);
          }
          setCurrentIndex(0);
        }
      } catch {
        if (isMounted) {
          setWords(activeMockList);
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
  }, [difficulty, practiceMode, targetWordId, targetWordText, activeMockList]);

  const currentWord = useMemo(() => {
    return words[currentIndex] || activeMockList[0] || defaultMockWords[0];
  }, [words, currentIndex, activeMockList]);

  const totalWords = words.length;
  const isSuccess = feedback.type === "success";

  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      setIsEvaluating(true);
      const token = getAuthToken();
      let recognized = "";
      let prediction = "";
      let score = 0;
      let isCorrect = false;
      let cerValue = 1.0;
      let feedbackMsg = "Unable to process your recording.";
      let tier: FeedbackTier = "needs_improvement";
      let geminiSuggestion: string | undefined = undefined;
      let feedbackAudio: string | undefined = undefined;

      try {
        if (token && currentWord.id) {
          // Primary: send audio to ASR + Gemini endpoint
          const res = await asrApi.predict(blob, currentWord.id, feedbackLang);
          recognized = res.prediction_text;
          prediction = res.prediction_text;
          score = Math.round(res.accuracy_score);
          isCorrect = res.is_correct;
          cerValue = res.cer;
          feedbackMsg = res.feedback;
          tier = res.feedback_tier || (isCorrect ? "excellent" : score >= 50 ? "almost_there" : "needs_improvement");
          geminiSuggestion = res.gemini_suggestion;
          feedbackAudio = res.feedback_audio;
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
          const isSentence = practiceMode === "sentence";
          geminiSuggestion =
            feedbackLang === "hi"
              ? isCorrect
                ? isSentence
                  ? `विश्लेषण: बहुत बढ़िया! आपने इस पूरे वाक्य '${currentWord.word}' का उच्चारण बहुत स्पष्ट और प्राकृतिक प्रवाह के साथ किया।\n\nजीभ और मुख की स्थिति: शब्दों के बीच विराम और ओष्ठ-संचालन बहुत संतुलित रहा।\n\nअभ्यास सुझाव: इसी तरह अन्य वाक्यों को भी स्वाभाविक गति में बोलने का अभ्यास करते रहें!`
                  : `विश्लेषण: बहुत बढ़िया! आपने '${currentWord.word}' का उच्चारण बहुत स्पष्ट रूप से किया।\n\nजीभ और मुख की स्थिति: आपकी जीभ और होंठों का तालमेल बिल्कुल सही रहा।\n\nअभ्यास सुझाव: इस शब्द को दिनचर्या के वाक्यों में दोहराते रहें!`
                : isSentence
                ? `विश्लेषण: सटीकता ${score}% है। लक्ष्य वाक्य '${currentWord.word}' के स्थान पर '${prediction}' सुनाई दिया।\n\nजीभ और मुख की स्थिति: प्रत्येक शब्द को अलग-अलग स्पष्टता से बोलें और सांस का प्रवाह नियंत्रित रखें।\n\nअभ्यास सुझाव: वाक्य को दो भागों में बांटकर बोलें, फिर पूरे वाक्य का एक साथ अभ्यास करें।`
                : `विश्लेषण: सटीकता ${score}% है। लक्ष्य '${currentWord.word}' के स्थान पर '${prediction}' सुनाई दिया।\n\nजीभ और मुख की स्थिति: जीभ को तालू के पास रखें और सांस का प्रवाह नियंत्रित रखें।\n\nअभ्यास सुझाव: सही उच्चारण 0.5× गति पर सुनें और प्रत्येक अक्षर को अलग-अलग बोलें।`
              : isCorrect
              ? isSentence
                ? `Analysis: Excellent! You articulated the full sentence '${currentWord.word}' with natural fluency and phonetic clarity.\n\nTongue & Mouth Placement: Smooth transitions between words and steady airflow control were maintained.\n\nPractice Recommendation: Continue practicing conversational Hindi sentences at this steady pace!`
                : `Analysis: Excellent! You articulated '${currentWord.word}' with clear phoneme accuracy.\n\nTongue & Mouth Placement: Natural airflow and precise tongue coordination were maintained.\n\nPractice Recommendation: Keep repeating this word smoothly in conversational sentences!`
              : isSentence
              ? `Analysis: Accuracy is ${score}%. We heard '${prediction}' for target sentence '${currentWord.word}'.\n\nTongue & Mouth Placement: Pace your breath evenly across syllables and enunciate dental and retroflex sounds clearly.\n\nPractice Recommendation: Break the sentence into shorter phrases, practice each, then articulate the whole sentence.`
              : `Analysis: Accuracy is ${score}%. We heard '${prediction}' for target '${currentWord.word}'.\n\nTongue & Mouth Placement: Focus on resting the tongue tip against the upper palate and releasing air smoothly.\n\nPractice Recommendation: Listen to the correct pronunciation at 0.5× speed, then say each syllable separately.`;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message.toLowerCase() : "";
        const isAuthError =
          errMsg.includes("unauthorized") ||
          errMsg.includes("invalid or expired token");

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
        feedbackAudio,
        timestamp: new Date(),
        audioBlob: blob,
      };

      const feedbackType: FeedbackType =
        tier === "excellent"
          ? "success"
          : tier === "almost_there"
          ? "almostThere"
          : "needsImprovement";

      const headerMsg =
        tier === "excellent"
          ? t.feedbackCorrect || "Excellent!"
          : tier === "almost_there"
          ? t.feedbackAlmostThere || "Almost there"
          : t.feedbackNeedsImprovement || "Needs improvement";

      setIsEvaluating(false);
      setFeedback({
        isVisible: true,
        attempt,
        message: headerMsg,
        type: feedbackType,
      });
    },
    [currentWord, feedbackLang, lang, practiceMode, t]
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

  const handlePracticeModeChange = useCallback(
    (newMode: "word" | "sentence") => {
      if (newMode === practiceMode) return;
      setPracticeMode(newMode);
      setCurrentIndex(0);
      setFeedback({
        isVisible: false,
        attempt: null,
        message: t.feedbackNeutral,
        type: "neutral",
      });
      if (targetWordId || targetWordText) {
        router.replace("/practice");
      }
    },
    [practiceMode, router, t, targetWordId, targetWordText]
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] pt-3 sm:pt-4 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header with Title, Mode Switcher beside it, and Progress Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex items-center flex-wrap gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink shrink-0">
              {t.practiceTitle}
            </h1>

            {/* Practice Mode Switcher: Words vs Sentences right beside Title */}
            <div className="inline-flex items-center p-1 bg-stone-100/90 border border-stone-200/90 rounded-2xl shadow-2xs">
              <button
                type="button"
                onClick={() => handlePracticeModeChange("word")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  practiceMode === "word"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
                }`}
              >
                <span>📖 {lang === "hi" ? "शब्द अभ्यास" : "Words"}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    practiceMode === "word" ? "bg-white/20 text-white" : "bg-stone-200/80 text-zinc-600"
                  }`}
                >
                  500+
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePracticeModeChange("sentence")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  practiceMode === "sentence"
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
                }`}
              >
                <span>💬 {lang === "hi" ? "वाक्य अभ्यास" : "Sentences"}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    practiceMode === "sentence" ? "bg-white/20 text-white" : "bg-stone-200/80 text-zinc-600"
                  }`}
                >
                  40+
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-soft border border-line rounded-full px-3.5 py-1.5 bg-white shadow-xs">
              {currentIndex + 1} / {totalWords}
            </span>
          </div>
        </div>

        {/* Focus Word from Profile Banner */}
        {(targetWordId || targetWordText) && words[0] && currentIndex === 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 mb-6 rounded-2xl bg-amber-50/90 border border-amber-200/70 text-amber-900 shadow-2xs animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base">🎯</span>
              <div className="text-xs">
                <span className="text-amber-800/90">
                  {lang === "hi"
                    ? "ध्यान देने योग्य शब्द (प्रोफ़ाइल से):"
                    : "Word to Focus On (from profile):"}{" "}
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

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT SIDE: Word Display, Navigation, Mic & Evaluation     */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Difficulty Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-stone-100/80 border border-stone-200/80 rounded-2xl shadow-xs">
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
            <div className="px-1">
              <ProgressBar current={currentIndex} total={totalWords} />
            </div>

            {/* Word Display Card (Listen controls moved to right side under Avatar) */}
            {isLoadingWords ? (
              <div className="h-64 rounded-3xl border border-line bg-white flex flex-col items-center justify-center gap-3 animate-pulse">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-zinc-900 rounded-full animate-spin" />
                <span className="text-xs text-zinc-500">
                  {practiceMode === "sentence"
                    ? lang === "hi"
                      ? "वाक्य लोड हो रहे हैं…"
                      : "Loading sentences dataset…"
                    : lang === "hi"
                    ? "शब्द लोड हो रहे हैं…"
                    : "Loading words dataset…"}
                </span>
              </div>
            ) : (
              <WordCard
                word={currentWord}
                isCorrect={isSuccess}
                showListenControls={false}
              />
            )}

            {/* Microphone Component with Live Audio Visualizer & Processing State */}
            <div className="py-2">
              <MicRecorder
                onRecordingComplete={handleRecordingComplete}
                disabled={feedback.isVisible || isLoadingWords || isEvaluating}
                isProcessing={isEvaluating}
              />
            </div>

            {/* Left Side Navigation Controls */}
            <div className="flex justify-between items-center border-t border-line pt-4 mt-2">
              <button
                onClick={handlePrevWord}
                disabled={totalWords <= 1}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150 disabled:opacity-50"
              >
                <span aria-hidden>←</span>{" "}
                {practiceMode === "sentence"
                  ? lang === "hi"
                    ? "पिछला वाक्य"
                    : "Prev Sentence"
                  : t.prevWord}
              </button>
              <button
                onClick={handleNextWord}
                disabled={totalWords <= 1}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-ink-soft border border-line bg-white hover:border-stone-strong hover:text-ink transition-colors duration-150 disabled:opacity-50"
              >
                {practiceMode === "sentence"
                  ? lang === "hi"
                    ? "अगला वाक्य"
                    : "Next Sentence"
                  : t.skipWord}{" "}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: 3D Face Model, Pipeline Flow View & Feedback  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {isEvaluating ? (
              /* State A: Processing / Evaluating (Face Model Removed -> Task Box Flow View Shown) */
              <div className="animate-fade-in">
                <MitraPipelineProgress
                  isEvaluating={isEvaluating}
                  targetWord={currentWord.word}
                  feedbackLanguage={feedbackLang}
                />
              </div>
            ) : !feedback.isVisible ? (
              /* State B: Default / Idle (Face at Top, Mitra Lang Separated at Bottom) */
              <>
                {/* 3D Lip-Sync Model Face + "Listen to correct pronunciation" */}
                <SpeechAvatar word={currentWord.word} />

                {/* Separated Bottom Card: Mitra AI Coach Language Preference */}
                <div className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                        {lang === "hi" ? "मित्र AI वाक् कोच भाषा" : "Mitra AI Coach Language"}
                      </h4>
                      <p className="text-[10px] text-ink-faint font-medium">
                        {lang === "hi"
                          ? "उच्चारण और ओष्ठ-संचालन सलाह की भाषा"
                          : "Language for speech articulation tips"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => handleFeedbackLangChange("hi")}
                        className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                          feedbackLang === "hi"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        हिन्दी
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedbackLangChange("en")}
                        className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                          feedbackLang === "en"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {lang === "hi"
                      ? "मित्र AI वाक् कोच आपकी आवाज़ का विश्लेषण कर जीभ, होंठों और सांस के प्रवाह के बारे में चुने गए माध्यम में सुझाव प्रदान करता है।"
                      : "Mitra AI Articulation Coach will analyze phonemes and deliver tongue placement and airflow guidance in this language."}
                  </p>
                </div>
              </>
            ) : (
              /* State C: Evaluated / Feedback Visible (Face Model Removed -> Feedback Panel Shown) */
              <>
                {/* Feedback Panel (Scores, CER, Comparison, Mitra Articulation Advice & Try Again) */}
                <div className="animate-fade-in">
                  <FeedbackPanel
                    feedback={feedback}
                    expectedWord={currentWord.word}
                    onTryAgain={handleTryAgain}
                    onNextWord={handleNextWord}
                    feedbackLanguage={feedbackLang}
                    onFeedbackLanguageChange={handleFeedbackLangChange}
                  />
                </div>

                {/* Separated Card: Mitra AI Coach Language Preference */}
                <div className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-xs transition-all">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-ink">
                        {lang === "hi" ? "मित्र AI कोच भाषा:" : "Mitra AI Coach Language:"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => handleFeedbackLangChange("hi")}
                        className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                          feedbackLang === "hi"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        हिन्दी
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedbackLangChange("en")}
                        className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                          feedbackLang === "en"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
