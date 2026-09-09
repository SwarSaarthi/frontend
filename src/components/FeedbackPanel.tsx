"use client";

import { memo, useCallback, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { speakHindi } from "@/lib/audioRecorder";
import type { FeedbackState } from "@/types";

interface FeedbackPanelProps {
  feedback: FeedbackState;
  expectedWord: string;
  onTryAgain: () => void;
  onNextWord: () => void;
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
function PlaybackButton({ label, onClick, isPlaying }: { label: string; onClick: () => void; isPlaying: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
        isPlaying
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-stone-200 text-zinc-600 hover:border-stone-300 hover:bg-stone-50"
      }`}
      aria-label={label}
    >
      <SpeakerIcon className="w-3.5 h-3.5" />
      <span>{isPlaying ? "Playing…" : "Play"}</span>
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────────
function FeedbackPanelInner({ feedback, expectedWord, onTryAgain, onNextWord }: FeedbackPanelProps) {
  const { t } = useLanguage();
  const [playingUser, setPlayingUser] = useState(false);
  const [playingCorrect, setPlayingCorrect] = useState(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const userAudioUrlRef = useRef<string | null>(null);

  // Play user's recorded audio
  const handlePlayUserAudio = useCallback(() => {
    if (!feedback.attempt?.audioBlob) return;

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
  }, [feedback.attempt?.audioBlob]);

  // Play correct pronunciation via TTS
  const handlePlayCorrect = useCallback(async () => {
    setPlayingCorrect(true);
    try {
      await speakHindi(expectedWord, 0.8);
    } catch {
      // TTS not supported or failed
    } finally {
      setPlayingCorrect(false);
    }
  }, [expectedWord]);

  if (!feedback.isVisible) return null;

  const isSuccess = feedback.type === "success";
  const isTryAgain = feedback.type === "tryAgain";
  const score = feedback.attempt?.score ?? 0;
  const cer = feedback.attempt?.cer ?? 0;
  const predictionText = feedback.attempt?.predictionText || feedback.attempt?.recognizedText || "—";
  const feedbackMessage = feedback.attempt?.feedbackMessage || feedback.message;

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 transition-all ${
      isSuccess
        ? "border-emerald-200 bg-linear-to-br from-emerald-50/60 to-green-50/40"
        : isTryAgain
        ? "border-red-200/60 bg-linear-to-br from-red-50/50 to-orange-50/30"
        : "border-stone-200 bg-white"
    }`}>
      {/* Status Header */}
      <div className="flex items-start gap-3 mb-5">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
          isSuccess
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-white border-stone-200 text-zinc-400"
        }`}>
          {isSuccess ? <CheckIcon className="w-4 h-4" /> : <RetryIcon className="w-4 h-4" />}
        </span>
        <div>
          <p className={`text-sm font-semibold leading-5 ${
            isSuccess ? "text-emerald-700" : isTryAgain ? "text-red-600" : "text-zinc-500"
          }`}>
            {isSuccess ? (t.feedbackCorrect || "Correct!") : (t.feedbackTryAgain || "Try Again")}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{feedbackMessage}</p>
        </div>
      </div>

      {feedback.attempt && (
        <>
          {/* Score Ring + CER */}
          <div className="flex items-center justify-center gap-6 mb-5">
            <ScoreRing score={score} />
            <div className="flex flex-col gap-2">
              <div className="rounded-xl bg-white border border-stone-200 px-4 py-2.5 text-center shadow-xs">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium mb-0.5">CER</p>
                <p className={`text-lg font-bold tabular-nums ${
                  cer <= 0.15 ? "text-emerald-600" : cer <= 0.4 ? "text-amber-600" : "text-red-600"
                }`}>{(cer * 100).toFixed(1)}%</p>
              </div>
              <p className="text-[10px] text-zinc-400 text-center leading-tight">
                Character<br/>Error Rate
              </p>
            </div>
          </div>

          {/* Pronunciation Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* User's pronunciation */}
            <div className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                  {t.yourPronunciation || "You Said"}
                </p>
                {feedback.attempt.audioBlob && (
                  <PlaybackButton
                    label="Play your recording"
                    onClick={handlePlayUserAudio}
                    isPlaying={playingUser}
                  />
                )}
              </div>
              <p className="text-lg font-hindi font-semibold text-zinc-800 leading-relaxed break-all">
                {predictionText}
              </p>
            </div>

            {/* Correct pronunciation */}
            <div className={`rounded-xl border p-4 ${
              isSuccess ? "border-emerald-200 bg-emerald-50/50" : "border-blue-200 bg-blue-50/40"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                  {t.expectedPronunciation || "Correct"}
                </p>
                <PlaybackButton
                  label="Listen to correct pronunciation"
                  onClick={handlePlayCorrect}
                  isPlaying={playingCorrect}
                />
              </div>
              <p className="text-lg font-hindi font-semibold text-zinc-800 leading-relaxed">
                {expectedWord}
              </p>
            </div>
          </div>

          {/* Score Progress Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">{t.scoreLabel || "Accuracy Score"}</span>
              <span className="font-bold tabular-nums text-zinc-700">{score}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2.5 justify-center pt-1">
        {isTryAgain && (
          <button
            onClick={onTryAgain}
            className="px-6 py-2.5 rounded-full text-sm font-semibold bg-zinc-900 text-white hover:bg-black active:scale-[0.98] transition-all duration-150 shadow-sm inline-flex items-center gap-1.5"
          >
            <RetryIcon className="w-4 h-4" />
            {t.tryAgain || "Try Again"}
          </button>
        )}
        <button
          onClick={onNextWord}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 shadow-sm inline-flex items-center gap-1.5 active:scale-[0.98] ${
            isSuccess
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
