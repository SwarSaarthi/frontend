"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { FeedbackState } from "@/types";

interface FeedbackPanelProps {
  feedback: FeedbackState;
  expectedWord: string;
  onTryAgain: () => void;
  onNextWord: () => void;
}

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

export default function FeedbackPanel({ feedback, expectedWord, onTryAgain, onNextWord }: FeedbackPanelProps) {
  const { t } = useLanguage();
  if (!feedback.isVisible) return null;
  const isSuccess = feedback.type === "success";
  const isTryAgain = feedback.type === "tryAgain";

  return (
    <div
      className={`card p-5 sm:p-6 animate-slide-up ${
        isSuccess ? "border-moss bg-moss-soft/40" : isTryAgain ? "bg-error-light border-error/20" : ""
      }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isSuccess ? "bg-moss text-white border-moss" : "bg-white border-line text-ink-soft"}`}>
          {isSuccess ? <CheckIcon className="w-4 h-4" /> : <RetryIcon className="w-4 h-4" />}
        </span>
        <p className={`text-sm font-medium leading-6 ${isSuccess ? "text-moss" : isTryAgain ? "text-error" : "text-ink-soft"}`}>
          {feedback.message}
        </p>
      </div>

      {feedback.attempt && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-line bg-white p-3 text-center">
            <p className="text-[11px] tracking-wide uppercase text-ink-faint mb-1">{t.yourPronunciation}</p>
            <p className="text-base font-hindi font-semibold text-ink">{feedback.attempt.recognizedText}</p>
          </div>
          <div className="rounded-xl border border-line bg-mist p-3 text-center">
            <p className="text-[11px] tracking-wide uppercase text-ink-faint mb-1">{t.expectedPronunciation}</p>
            <p className="text-base font-hindi font-semibold text-ink">{expectedWord}</p>
          </div>
        </div>
      )}

      {feedback.attempt && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-ink-faint">{t.scoreLabel}</span>
            <span className="font-semibold tabular-nums text-ink">{feedback.attempt.score}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full progress-fill ${feedback.attempt.score >= 75 ? "bg-moss" : feedback.attempt.score >= 50 ? "bg-ink" : "bg-error"}`}
              style={{ width: `${feedback.attempt.score}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        {isTryAgain && (
          <button onClick={onTryAgain} className="px-5 py-2 rounded-full text-sm font-medium bg-ink text-white hover:bg-black transition-colors duration-150">
            {t.tryAgain}
          </button>
        )}
        {isSuccess && (
          <button onClick={onNextWord} className="px-5 py-2 rounded-full text-sm font-medium bg-moss text-white hover:bg-[#1e2e26] transition-colors duration-150 inline-flex items-center gap-1.5">
            {t.nextWord} <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
