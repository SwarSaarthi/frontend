"use client";

import { memo, useCallback, useRef, useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { speakHindi, speakFeedback, stopSpeaking, playDirectAudio } from "@/lib/audioRecorder";
import TtsSpeedControl, { useTtsSpeed } from "@/components/TtsSpeedControl";
import MitraPipelineProgress from "@/components/MitraPipelineProgress";
import type { FeedbackState } from "@/types";

interface FeedbackPanelProps {
  feedback: FeedbackState;
  expectedWord: string;
  onTryAgain: () => void;
  onNextWord: () => void;
  feedbackLanguage?: "en" | "hi";
  onFeedbackLanguageChange?: (lang: "en" | "hi") => void;
}

// ── Icons ────────────────────────────────────────────────────────
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...props}>
      <path d="M6 12l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RetryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" strokeLinecap="round" />
      <path d="M20 4v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SpeakerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Score Ring ────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const radius = 36;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "stroke-emerald-500" :
    score >= 50 ? "stroke-amber-500" :
    "stroke-red-500";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40" cy="40" r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-stone-200"
        />
        <circle
          cx="40" cy="40" r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none ${color} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums text-zinc-900">{score}%</span>
        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Match</span>
      </div>
    </div>
  );
}

// ── Playback Button ──────────────────────────────────────────────
function PlaybackButton({
  label,
  onClick,
  isPlaying,
  className = "",
}: {
  label: string;
  onClick: () => void;
  isPlaying: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-150 shrink-0 select-none ${
        isPlaying
          ? "bg-clay-soft border-clay-ring text-clay shadow-2xs"
          : "bg-white border-stone-200 text-zinc-600 hover:border-stone-300 hover:bg-stone-50 active:scale-95"
      } ${className}`}
      aria-label={label}
    >
      <SpeakerIcon
        className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? "animate-pulse text-clay" : ""}`}
      />
      <span>{isPlaying ? "Playing…" : "Play"}</span>
    </button>
  );
}

// ── Structured Speech Articulation Guidance Renderer ───────────
function renderMarkdownInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function renderSectionBody(bodyText: string) {
  const lines = bodyText.trim().split("\n");
  const isList = lines.some((l) => {
    const t = l.trim();
    return t.startsWith("- ") || t.startsWith("* ") || t.startsWith("• ");
  });

  if (isList) {
    return (
      <ul className="space-y-2 mt-1.5">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          const bulletMatch = trimmed.match(/^[-*•]\s*(.*)$/);
          const content = bulletMatch ? bulletMatch[1] : trimmed;
          return (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-ink-soft leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-clay mt-2 shrink-0" />
              <span>{renderMarkdownInline(content)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="space-y-1.5 mt-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        return (
          <p key={i} className="text-xs sm:text-[13px] text-ink-soft leading-relaxed">
            {renderMarkdownInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function SpeechGuidanceDisplay({ text, lang }: { text: string; lang: string }) {
  // Strip emojis, pictographs and bullets
  const clean = text
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🎯👅💡✨👉→•]/gu, "")
    .trim();

  // Split into paragraphs / blocks
  const rawBlocks = clean.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
  const sections: { title: string; content: string }[] = [];

  for (const block of rawBlocks) {
    // Check if block matches Analysis / विश्लेषण
    const analysisMatch = block.match(/^(?:\*\*)?(?:Analysis|विश्लेषण)(?:\*\*)?[:\s-]*([\s\S]*)$/i);
    if (analysisMatch) {
      sections.push({
        title: lang === "hi" ? "विश्लेषण" : "Analysis",
        content: analysisMatch[1] || block,
      });
      continue;
    }

    // Check if block matches Tongue & Mouth / जीभ और मुख
    const tongueMatch = block.match(
      /^(?:\*\*)?(?:Tongue\s*(?:&|and)?\s*Mouth(?:\s*Placement)?|Tongue\s*Placement|Mouth\s*Placement|जीभ\s*(?:और|व)?\s*मुख(?:\s*की\s*स्थिति)?|जीभ\s*की\s*स्थिति|मुख\s*की\s*स्थिति)(?:\*\*)?[:\s-]*([\s\S]*)$/i
    );
    if (tongueMatch) {
      sections.push({
        title: lang === "hi" ? "जीभ एवं मुख की स्थिति" : "Tongue & Mouth Placement",
        content: tongueMatch[1] || block,
      });
      continue;
    }

    // Check if block matches Practice Recommendation / अभ्यास सुझाव
    const tipMatch = block.match(
      /^(?:\*\*)?(?:Practice\s*Recommendation|Practice\s*Tip|Practice|अभ्यास\s*सुझाव|अभ्यास\s*युक्ति|अभ्यास)(?:\*\*)?[:\s-]*([\s\S]*)$/i
    );
    if (tipMatch) {
      sections.push({
        title: lang === "hi" ? "अभ्यास सुझाव" : "Practice Recommendation",
        content: tipMatch[1] || block,
      });
      continue;
    }

    // Fallback: regular paragraph
    sections.push({
      title: "",
      content: block,
    });
  }

  return (
    <div className="space-y-4 pt-1">
      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-1">
          {sec.title && (
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                {sec.title}
              </h5>
            </div>
          )}
          <div className="pl-3.5">
            {renderSectionBody(sec.content)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
function FeedbackPanelInner({
  feedback,
  expectedWord,
  onTryAgain,
  onNextWord,
  feedbackLanguage = "hi",
  onFeedbackLanguageChange,
}: FeedbackPanelProps) {
  const { t, lang } = useLanguage();
  const [speed, setSpeed] = useTtsSpeed();
  const [playingUser, setPlayingUser] = useState(false);
  const [playingCorrect, setPlayingCorrect] = useState(false);
  const [playingCoach, setPlayingCoach] = useState(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioUrlRef = useRef<string | null>(null);
  const lastSpokenAttemptRef = useRef<string | null>(null);
  const [showPipeline, setShowPipeline] = useState(false);

  // Core function to speak AI Coach guidance audio (with zero-latency pre-synthesized audio support)
  const playCoachAudio = useCallback(
    async (textToSpeak: string, langToUse?: string, directAudio?: string) => {
      if (!textToSpeak && !directAudio) return;

      stopSpeaking();
      setPlayingUser(false);
      setPlayingCorrect(false);
      setPlayingCoach(true);

      const voiceLang =
        langToUse ||
        feedback.attempt?.feedbackLanguage ||
        feedbackLanguage ||
        (textToSpeak && /[\u0900-\u097F]{4,}/.test(textToSpeak) ? "hi" : "en");

      try {
        const audioSource = directAudio || feedback.attempt?.feedbackAudio;
        if (audioSource) {
          // Zero-latency instant playback: audio was already pre-synthesized by the backend!
          await playDirectAudio(audioSource);
        } else {
          // Fallback to fast backend TTS endpoint or browser synthesis
          await speakFeedback(textToSpeak, voiceLang);
        }
      } catch (err) {
        console.warn("Direct audio playback failed, falling back to speech synthesis:", err);
        try {
          await speakFeedback(textToSpeak, voiceLang);
        } catch {}
      } finally {
        setPlayingCoach(false);
      }
    },
    [feedback.attempt, feedbackLanguage]
  );

  // Keep latest playCoachAudio in a ref to avoid effect dependency invalidations
  const playCoachAudioRef = useRef(playCoachAudio);
  useEffect(() => {
    playCoachAudioRef.current = playCoachAudio;
  });

  // Stop speech when user dismisses the feedback panel
  useEffect(() => {
    if (!feedback.isVisible) {
      stopSpeaking();
      lastSpokenAttemptRef.current = null;
    }
  }, [feedback.isVisible]);

  // Auto-play AI Coach feedback as soon as it reaches the frontend
  useEffect(() => {
    if (!feedback.isVisible || !feedback.attempt) {
      lastSpokenAttemptRef.current = null;
      return;
    }

    const coachText =
      feedback.attempt.geminiSuggestion ||
      feedback.attempt.feedbackMessage ||
      feedback.message;

    if (!coachText || !coachText.trim()) return;

    const attemptTime = feedback.attempt.timestamp
      ? new Date(feedback.attempt.timestamp).getTime()
      : 0;
    const attemptId = `${feedback.attempt.wordId}_${attemptTime}`;

    // Prevent duplicate triggers for the exact same attempt
    if (lastSpokenAttemptRef.current === attemptId) {
      return;
    }

    // Schedule playback with a tiny 60ms delay for smooth UI paint
    const timer = setTimeout(() => {
      lastSpokenAttemptRef.current = attemptId;
      playCoachAudioRef.current(
        coachText,
        feedback.attempt?.feedbackLanguage,
        feedback.attempt?.feedbackAudio
      );
    }, 60);

    return () => {
      clearTimeout(timer);
    };
  }, [feedback.isVisible, feedback.attempt, feedback.message]);

  // Play user's recorded audio
  const handlePlayUserAudio = useCallback(() => {
    if (!feedback.attempt?.audioBlob) return;

    stopSpeaking();
    setPlayingCoach(false);
    setPlayingCorrect(false);

    // Revoke old URL if exists
    if (userAudioUrlRef.current) {
      URL.revokeObjectURL(userAudioUrlRef.current);
    }

    const url = URL.createObjectURL(feedback.attempt.audioBlob);
    userAudioUrlRef.current = url;

    const audio = new Audio(url);
    userAudioRef.current = audio;
    setPlayingUser(true);

    audio.onended = () => {
      setPlayingUser(false);
      URL.revokeObjectURL(url);
      userAudioUrlRef.current = null;
    };
    audio.onerror = () => {
      setPlayingUser(false);
    };
    audio.play().catch(() => setPlayingUser(false));
  }, [feedback.attempt]);

  // Play correct pronunciation via TTS
  const handlePlayCorrect = useCallback(
    async (playbackSpeed?: number) => {
      stopSpeaking();
      setPlayingCoach(false);
      setPlayingUser(false);

      const rate = playbackSpeed ?? speed;
      setPlayingCorrect(true);
      try {
        await speakHindi(expectedWord, rate);
      } catch {
        // TTS not supported or failed
      } finally {
        setPlayingCorrect(false);
      }
    },
    [expectedWord, speed]
  );

  const handleSpeedSelect = useCallback(
    (newSpeed: number) => {
      setSpeed(newSpeed);
      handlePlayCorrect(newSpeed);
    },
    [setSpeed, handlePlayCorrect]
  );

  // Toggle AI Speech Coach suggestion audio on button click
  const handlePlayCoachAudio = useCallback(async () => {
    if (playingCoach) {
      stopSpeaking();
      setPlayingCoach(false);
      return;
    }

    const coachText = feedback.attempt?.geminiSuggestion;
    if (coachText) {
      await playCoachAudio(
        coachText,
        feedback.attempt?.feedbackLanguage,
        feedback.attempt?.feedbackAudio
      );
    }
  }, [playingCoach, feedback.attempt, playCoachAudio]);

  if (!feedback.isVisible) return null;

  const isSuccess = feedback.type === "success";
  const isAlmostThere = feedback.type === "almostThere";

  const score = feedback.attempt?.score ?? 0;
  const cer = feedback.attempt?.cer ?? 0;
  const predictionText = feedback.attempt?.predictionText || feedback.attempt?.recognizedText || "—";
  const geminiSuggestion = feedback.attempt?.geminiSuggestion;

  const tier = feedback.attempt?.feedbackTier || (
    isSuccess ? "excellent" : isAlmostThere ? "almost_there" : "needs_improvement"
  );

  const titleHeader = tier === "excellent"
    ? (t.feedbackCorrect || "Excellent!")
    : tier === "almost_there"
    ? (t.feedbackAlmostThere || "Almost there")
    : (t.feedbackNeedsImprovement || "Needs improvement");

  const feedbackMessage = feedback.attempt?.feedbackMessage || feedback.message;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all ${
        isSuccess
          ? "border-emerald-200 bg-linear-to-br from-emerald-50/60 to-green-50/40"
          : isAlmostThere
            ? "border-amber-200/80 bg-linear-to-br from-amber-50/60 to-yellow-50/30"
            : "border-red-200/80 bg-linear-to-br from-red-50/60 to-rose-50/30"
      }`}
    >
      {/* Status Header */}
      <div className="flex items-start gap-3 mb-5">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs ${
            isSuccess
              ? "bg-emerald-500 text-white border-emerald-500"
              : isAlmostThere
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-red-500 text-white border-red-500"
          }`}
        >
          {isSuccess ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <RetryIcon className="w-4 h-4" />
          )}
        </span>
        <div>
          <p
            className={`text-sm font-semibold leading-5 ${
              isSuccess
                ? "text-emerald-700"
                : isAlmostThere
                  ? "text-amber-800"
                  : "text-red-700"
            }`}
          >
            {titleHeader}
          </p>
          {feedbackMessage && feedbackMessage !== titleHeader && (
            <p className="text-xs text-zinc-600 mt-0.5 leading-snug">
              {feedbackMessage}
            </p>
          )}
        </div>
      </div>

      {feedback.attempt && (
        <>
          {/* Score Ring + CER */}
          <div className="flex items-center justify-center gap-6 mb-5">
            <ScoreRing score={score} />
            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-white border border-stone-200 px-4 py-2.5 text-center shadow-xs">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">
                  CER
                </p>
                <p
                  className={`text-lg font-bold tabular-nums ${
                    cer <= 0.2
                      ? "text-emerald-600"
                      : cer <= 0.5
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {(cer * 100).toFixed(1)}%
                </p>
              </div>
              <p className="text-[10px] text-zinc-400 text-center leading-tight">
                Character
                <br />
                Error Rate
              </p>
            </div>
          </div>

          {/* Pronunciation Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* User's pronunciation */}
            <div className="rounded-xl border border-stone-200 bg-white p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                  {t.yourPronunciation || "You Said"}
                </p>
                {feedback.attempt.audioBlob && (
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {lang === "hi" ? "आपकी आवाज़" : "Your Audio"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xl sm:text-2xl font-hindi font-bold text-zinc-800 leading-tight min-w-0 flex-1 wrap-break-word">
                  {predictionText}
                </p>
                {feedback.attempt.audioBlob && (
                  <PlaybackButton
                    label="Play your recording"
                    onClick={handlePlayUserAudio}
                    isPlaying={playingUser}
                  />
                )}
              </div>
              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-[10px] text-zinc-400">
                <span>{lang === "hi" ? "ध्वनि इनपुट" : "Voice Input"}</span>
                <span className="font-medium text-zinc-500">
                  {tier === "excellent"
                    ? "✓ Accurate"
                    : tier === "almost_there"
                      ? "Close"
                      : "Needs Practice"}
                </span>
              </div>
            </div>

            {/* Correct pronunciation */}
            <div
              className={`rounded-xl border p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden ${
                isSuccess
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-stone-300/80 bg-warm-sand/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                  {t.expectedPronunciation || "Expected"}
                </p>
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {lang === "hi" ? "सही उच्चारण" : "Reference"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xl sm:text-2xl font-hindi font-bold text-zinc-800 leading-tight min-w-0 flex-1 wrap-break-word">
                  {expectedWord}
                </p>
                <PlaybackButton
                  label="Listen to correct pronunciation"
                  onClick={() => handlePlayCorrect(speed)}
                  isPlaying={playingCorrect}
                />
              </div>
              {/* Dedicated Speed Selector Row with Zero Overflow */}
              <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {lang === "hi" ? "गति" : "Speed"}
                </span>
                <TtsSpeedControl
                  speed={speed}
                  onSpeedSelect={handleSpeedSelect}
                  size="sm"
                  showLabel={false}
                />
              </div>
            </div>
          </div>

          {/* Speech Articulation Guidance */}
          {geminiSuggestion && (
            <div className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 mb-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200/80">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold tracking-wider text-ink uppercase">
                    {lang === "hi"
                      ? "मित्र AI वाक् उच्चारण मार्गदर्शन"
                      : "Mitra AI Articulation Guidance"}
                  </h4>
                  <p className="text-[11px] text-ink-faint font-medium mt-0.5">
                    {lang === "hi"
                      ? "जीभ, होंठ एवं वायु-प्रवाह निर्देश"
                      : "Tongue placement, airflow & vocal tract guide"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {onFeedbackLanguageChange && (
                    <div className="inline-flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200/80 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => onFeedbackLanguageChange("hi")}
                        className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold transition-all ${
                          feedbackLanguage === "hi"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                        title="हिंदी में सलाह प्राप्त करें"
                      >
                        हिन्दी
                      </button>
                      <button
                        type="button"
                        onClick={() => onFeedbackLanguageChange("en")}
                        className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold transition-all ${
                          feedbackLanguage === "en"
                            ? "bg-ink text-white shadow-xs"
                            : "text-ink-soft hover:text-ink"
                        }`}
                        title="Get advice in English"
                      >
                        EN
                      </button>
                    </div>
                  )}

                  {/* Listen to Coach Guidance via Fast TTS */}
                  <button
                    type="button"
                    onClick={handlePlayCoachAudio}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 shrink-0 ${
                      playingCoach
                        ? "bg-clay border-clay text-white shadow-xs scale-102"
                        : "bg-white border-line text-ink hover:bg-mist hover:border-stone-strong active:scale-95 shadow-2xs"
                    }`}
                    aria-label="Listen to articulation guidance"
                  >
                    <SpeakerIcon
                      className={`w-3.5 h-3.5 shrink-0 ${playingCoach ? "animate-pulse" : "text-clay"}`}
                    />
                    <span>
                      {playingCoach
                        ? lang === "hi"
                          ? "सुन रहे हैं…"
                          : "Speaking…"
                        : lang === "hi"
                          ? "सलाह सुनें"
                          : "Listen"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Clean Structured Guidance Sections */}
              <SpeechGuidanceDisplay text={geminiSuggestion} lang={lang} />
            </div>
          )}

          {/* Score Progress Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">
                {t.scoreLabel || "Accuracy Score"}
              </span>
              <span className="font-bold tabular-nums text-zinc-700">
                {score}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  score >= 80
                    ? "bg-emerald-500"
                    : score >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Collapsible Backend Pipeline Execution Log (Mitra Engine Flow) */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowPipeline((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-stone-100/80 hover:bg-stone-100 border border-stone-200/80 text-[11px] font-bold text-zinc-600 transition-all select-none active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  {lang === "hi"
                    ? "मित्र न्यूरल बैकएंड विश्लेषण पाइपलाइन विवरण देखें"
                    : "View Mitra Backend Pipeline Execution Flow Log"}
                </span>
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {showPipeline ? "▲ Hide" : "▼ 4 Stages Completed"}
              </span>
            </button>

            {showPipeline && (
              <div className="mt-3 animate-fade-in">
                <MitraPipelineProgress
                  isEvaluating={false}
                  isCompleted={true}
                  targetWord={expectedWord}
                  feedbackLanguage={feedbackLanguage}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5 justify-center pt-2">
        <button
          onClick={onTryAgain}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 shadow-sm inline-flex items-center gap-1.5 active:scale-[0.98] ${
            isSuccess
              ? "bg-white text-zinc-800 border border-stone-300 hover:bg-stone-50"
              : "bg-zinc-900 text-white hover:bg-black"
          }`}
        >
          <RetryIcon className="w-4 h-4" />
          {isSuccess
            ? lang === "hi"
              ? "पुनः अभ्यास करें"
              : "Practice Again"
            : t.tryAgain || "Try Again"}
        </button>
        <button
          onClick={onNextWord}
          className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 shadow-sm inline-flex items-center gap-1.5 active:scale-[0.98] ${
            isSuccess
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50"
              : "bg-white text-zinc-700 border border-stone-200 hover:bg-stone-50"
          }`}
        >
          {t.nextWord || "Next Word"} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

export default memo(FeedbackPanelInner);
