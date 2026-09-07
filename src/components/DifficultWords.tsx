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
      <div className="card p-8 text-center">
        <div className="w-8 h-8 rounded-full border border-line bg-mist flex items-center justify-center mx-auto mb-3">
          <svg className="w-4 h-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <p className="text-sm text-ink-soft">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {words.map((wp) => {
        const accuracyPercent = wp.totalAttempts > 0 ? Math.round((wp.correctAttempts / wp.totalAttempts) * 100) : 0;
        return (
          <div key={wp.word.id} className="card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-hindi font-bold text-ink">{wp.word.word}</span>
                <span className="text-xs text-ink-faint italic">{wp.word.transliteration}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-ink-faint">
                <span>{wp.totalAttempts} {t.attempts}</span>
                <span className="w-px h-3 bg-line" />
                <span>{t.bestScore}: {wp.bestScore}%</span>
              </div>
              <div className="w-full h-1 bg-stone rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full progress-fill ${accuracyPercent >= 60 ? "bg-moss" : accuracyPercent >= 30 ? "bg-ink-soft" : "bg-error"}`}
                  style={{ width: `${accuracyPercent}%` }}
                />
              </div>
            </div>
            <button
              className="shrink-0 px-4 py-2 rounded-full text-xs font-medium bg-white border border-line text-ink hover:border-stone-strong hover:bg-mist transition-colors duration-150"
              onClick={() => { window.location.href = `/practice`; }}
            >
              {t.practiceAgain}
            </button>
          </div>
        );
      })}
    </div>
  );
}
