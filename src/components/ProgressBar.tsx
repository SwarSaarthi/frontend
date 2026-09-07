/**
 * SwarSaarthi — ProgressBar Component
 *
 * Shows the user's progress through the current word list.
 * Displays: "शब्द 3 / 10" or "Word 3 of 10"
 * Visual progress bar fills proportionally.
 */

"use client";

import { useLanguage } from "@/components/LanguageProvider";

interface ProgressBarProps {
  /** Current word index (0-based) */
  current: number;
  /** Total number of words */
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useLanguage();
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full">
      {/* Text indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-secondary">
          {t.wordLabel} {current + 1} {t.ofLabel} {total}
        </span>
        <span className="text-xs text-text-muted">{Math.round(progress)}%</span>
      </div>

      {/* Visual bar */}
      <div className="w-full h-2.5 bg-primary-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-primary to-primary-light rounded-full progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
