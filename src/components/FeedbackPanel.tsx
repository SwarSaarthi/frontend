/**
 * SwarSaarthi — FeedbackPanel Component
 *
 * Shows pronunciation feedback after a recording attempt.
 * Displays:
 *  - Success/retry status with appropriate styling
 *  - What the user said vs what was expected (mock for now)
 *  - Score indicator
 *  - Action buttons (Try Again / Next Word)
 *
 * FUTURE BACKEND INTEGRATION:
 *  The feedback data will come from the NLP comparison endpoint:
 *    POST /api/compare → { score, isCorrect, feedback, recognizedText }
 *  Currently using mock random results for UI demonstration.
 */

"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { FeedbackState } from "@/types";

interface FeedbackPanelProps {
  feedback: FeedbackState;
  expectedWord: string;
  onTryAgain: () => void;
  onNextWord: () => void;
}

export default function FeedbackPanel({
  feedback,
  expectedWord,
  onTryAgain,
  onNextWord,
}: FeedbackPanelProps) {
  const { t } = useLanguage();

  if (!feedback.isVisible) return null;

  const isSuccess = feedback.type === "success";
  const isTryAgain = feedback.type === "tryAgain";

  return (
    <div
      className={`card-warm p-6 animate-slide-up ${
        isSuccess
          ? "border-success bg-success-light/30"
          : isTryAgain
            ? "border-error bg-error-light/30"
            : ""
      }`}
    >
      {/* Feedback icon & message */}
      <div className="text-center mb-4">
        <span className="text-4xl mb-2 block">
          {isSuccess ? "🎉" : isTryAgain ? "💪" : "🎤"}
        </span>
        <p
          className={`text-base font-medium ${
            isSuccess
              ? "text-success"
              : isTryAgain
                ? "text-error"
                : "text-text-secondary"
          }`}
        >
          {feedback.message}
        </p>
      </div>

      {/* Comparison: What user said vs expected */}
      {feedback.attempt && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* User's pronunciation */}
          <div
            className={`flex-1 p-3 rounded-xl text-center ${
              isSuccess ? "bg-success/10" : "bg-error/10"
            }`}
          >
            <p className="text-xs text-text-muted mb-1">
              {t.yourPronunciation}
            </p>
            <p className="text-lg font-hindi font-semibold text-text-primary">
              {feedback.attempt.recognizedText}
            </p>
          </div>

          {/* Expected pronunciation */}
          <div className="flex-1 p-3 rounded-xl text-center bg-primary-50">
            <p className="text-xs text-text-muted mb-1">
              {t.expectedPronunciation}
            </p>
            <p className="text-lg font-hindi font-semibold text-primary">
              {expectedWord}
            </p>
          </div>
        </div>
      )}

      {/* Score indicator */}
      {feedback.attempt && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
            <span>{t.scoreLabel}</span>
            <span className="font-semibold text-text-primary">
              {feedback.attempt.score}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-primary-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full progress-fill ${
                feedback.attempt.score >= 80
                  ? "bg-success"
                  : feedback.attempt.score >= 50
                    ? "bg-accent"
                    : "bg-error"
              }`}
              style={{ width: `${feedback.attempt.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        {isTryAgain && (
          <button
            onClick={onTryAgain}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-dark active:scale-95 transition-all shadow-sm"
          >
            {t.tryAgain}
          </button>
        )}
        {isSuccess && (
          <button
            onClick={onNextWord}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-success text-white hover:bg-secondary-dark active:scale-95 transition-all shadow-sm"
          >
            {t.nextWord} →
          </button>
        )}
      </div>
    </div>
  );
}
