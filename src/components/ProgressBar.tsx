"use client";

import { useLanguage } from "@/components/LanguageProvider";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useLanguage();
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-wide text-ink-soft">
          {t.wordLabel} {current + 1} <span className="text-ink-faint">/</span> {total}
        </span>
        <span className="text-xs tabular-nums text-ink-faint">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-1.5 bg-stone rounded-full overflow-hidden">
        <div
          className="h-full bg-ink rounded-full progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
