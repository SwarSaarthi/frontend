"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export const TTS_SPEED_STORAGE_KEY = "swarsaarthi_tts_speed";
export const DEFAULT_TTS_SPEED = 0.75;

export interface SpeedOption {
  value: number;
  label: string;
  hintKey: "speedSlow" | "speedRelaxed" | "speedNormal" | "speedFast";
}

export const SPEED_OPTIONS: SpeedOption[] = [
  { value: 0.5, label: "0.5×", hintKey: "speedSlow" },
  { value: 0.75, label: "0.75×", hintKey: "speedRelaxed" },
  { value: 1.0, label: "1.0×", hintKey: "speedNormal" },
];

/**
 * Hook to read and write the global TTS playback speed preference.
 * Synchronizes with localStorage and dispatches window events across components.
 */
export function useTtsSpeed(initialSpeed = DEFAULT_TTS_SPEED) {
  const [speed, setSpeedState] = useState<number>(() => {
    if (typeof window === "undefined") return initialSpeed;
    try {
      const stored = localStorage.getItem(TTS_SPEED_STORAGE_KEY);
      if (stored) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return initialSpeed;
  });

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    try {
      localStorage.setItem(TTS_SPEED_STORAGE_KEY, String(newSpeed));
      window.dispatchEvent(
        new CustomEvent("swarsaarthi-speed-changed", { detail: newSpeed })
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (customEvent.detail && typeof customEvent.detail === "number") {
        setSpeedState(customEvent.detail);
      }
    };

    window.addEventListener("swarsaarthi-speed-changed", handleSync);
    return () => {
      window.removeEventListener("swarsaarthi-speed-changed", handleSync);
    };
  }, []);

  return [speed, setSpeed] as const;
}

interface TtsSpeedControlProps {
  speed: number;
  onSpeedSelect: (speed: number) => void;
  size?: "sm" | "md";
  className?: string;
  showLabel?: boolean;
}

export default function TtsSpeedControl({
  speed,
  onSpeedSelect,
  size = "md",
  className = "",
  showLabel = true,
}: TtsSpeedControlProps) {
  const { t, lang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-full bg-stone-100/90 p-1 border border-stone-200/90 shadow-2xs ${className}`}
      role="group"
      aria-label={t.playbackSpeed}
    >
      {showLabel && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 select-none">
          {lang === "hi" ? "गति" : "Speed"}
        </span>
      )}

      <div className="flex items-center gap-0.5">
        {SPEED_OPTIONS.map((opt) => {
          const isActive = Math.abs(speed - opt.value) < 0.05;
          const hint = t[opt.hintKey] || opt.label;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSpeedSelect(opt.value)}
              className={`rounded-full font-bold transition-all duration-150 select-none ${
                size === "sm"
                  ? "px-2 py-0.5 text-[11px]"
                  : "px-2.5 py-1 text-xs"
              } ${
                isActive
                  ? "bg-white text-zinc-900 shadow-xs border border-stone-200/80 scale-[1.02]"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-white/60"
              }`}
              title={`${hint} (${opt.label})`}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
