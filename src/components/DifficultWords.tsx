"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { WordProgress } from "@/types";

interface DifficultWordsProps {
  words: WordProgress[];
}

const WordRow = memo(function WordRow({
  wp,
  attemptsLabel,
  bestLabel,
  practiceLabel,
  onPractice,
}: {
  wp: WordProgress;
  attemptsLabel: string;
  bestLabel: string;
  practiceLabel: string;
  onPractice: () => void;
}) {
  const accuracyPercent =
    wp.totalAttempts > 0 ? Math.round((wp.correctAttempts / wp.totalAttempts) * 100) : 0;

  return (
    <div
      onClick={onPractice}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPractice();
        }
      }}
      className="card p-4 flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer group hover:shadow-xs active:scale-[0.99]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-hindi font-bold text-ink group-hover:text-primary transition-colors">
            {wp.word.word}
          </span>
          <span className="text-xs text-ink-faint italic">{wp.word.transliteration}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-ink-faint">
          <span>
            {wp.totalAttempts} {attemptsLabel}
          </span>
          <span className="w-px h-3 bg-line" />
          <span>
            {bestLabel}: {wp.bestScore}%
          </span>
        </div>
        <div className="w-full h-1 bg-stone rounded-full mt-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full progress-fill ${accuracyPercent >= 60 ? "bg-moss" : accuracyPercent >= 30 ? "bg-ink-soft" : "bg-error"}`}
            style={{ width: `${accuracyPercent}%` }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPractice();
        }}
        className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-line text-ink group-hover:border-primary group-hover:text-primary hover:bg-mist transition-all duration-150 active:scale-95 shadow-2xs"
      >
        {practiceLabel} →
      </button>
    </div>
  );
});

function DifficultWords({ words }: DifficultWordsProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handlePractice = useCallback(
    (wordId: string, wordText: string) => {
      router.push(`/practice?wordId=${encodeURIComponent(wordId)}&word=${encodeURIComponent(wordText)}`);
    },
    [router]
  );

  if (words.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="w-8 h-8 rounded-full border border-line bg-mist flex items-center justify-center mx-auto mb-3">
          <svg className="w-4 h-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
            <circle cx="12" cy="9" r="9" />
          </svg>
        </div>
        <p className="text-sm text-ink-soft">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {words.map((wp) => (
        <WordRow
          key={wp.word.id}
          wp={wp}
          attemptsLabel={t.attempts}
          bestLabel={t.bestScore}
          practiceLabel={t.practiceAgain}
          onPractice={() => handlePractice(wp.word.id, wp.word.word)}
        />
      ))}
    </div>
  );
}

export default memo(DifficultWords);
