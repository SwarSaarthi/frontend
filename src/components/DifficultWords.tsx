/**
 * SwarSaarthi — DifficultWords Component
 *
 * Displays a list of words the user struggles with most.
 * Each word shows:
 *  - The Hindi word
 *  - Number of attempts & best score
 *  - A "Practice" button to jump back to that word
 *
 * TODO: When backend is connected:
 *  - Fetch difficult words: GET /api/progress?filter=difficult
 *  - "Practice" button should navigate to /practice?wordId=<id>
 */

"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { WordProgress } from "@/types";

interface DifficultWordsProps {
  words: WordProgress[];
}

export default function DifficultWords({ words }: DifficultWordsProps) {
  const { t } = useLanguage();

  if (words.length === 0) {
    return (
      <div className="card-warm p-8 text-center">
        <span className="text-4xl mb-3 block">🌟</span>
        <p className="text-text-secondary">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {words.map((wp) => {
        const accuracyPercent =
          wp.totalAttempts > 0
            ? Math.round((wp.correctAttempts / wp.totalAttempts) * 100)
            : 0;

        return (
          <div
            key={wp.word.id}
            className="card-warm p-4 flex items-center gap-4"
          >
            {/* Word display */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-hindi font-bold text-text-primary">
                  {wp.word.word}
                </span>
                <span className="text-xs text-text-muted italic">
                  {wp.word.transliteration}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-text-muted">
                  {wp.totalAttempts} {t.attempts}
                </span>
                <span className="text-xs text-text-muted">•</span>
                <span className="text-xs text-text-muted">
                  {t.bestScore}: {wp.bestScore}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-primary-100 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full progress-fill ${
                    accuracyPercent >= 60
                      ? "bg-success"
                      : accuracyPercent >= 30
                        ? "bg-accent"
                        : "bg-error"
                  }`}
                  style={{ width: `${accuracyPercent}%` }}
                />
              </div>
            </div>

            {/* Practice button */}
            <button
              className="shrink-0 px-4 py-2 rounded-full text-xs font-medium bg-primary-50 text-primary hover:bg-primary-100 active:scale-95 transition-all"
              /**
               * TODO: Navigate to practice room with this specific word:
               *   router.push(`/practice?wordId=${wp.word.id}`)
               */
              onClick={() => {
                // TODO: Navigate to /practice?wordId=${wp.word.id}
                window.location.href = `/practice`;
              }}
            >
              {t.practiceAgain}
            </button>
          </div>
        );
      })}
    </div>
  );
}
