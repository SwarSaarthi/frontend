"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { AudioRecorder } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import type { RecordingState } from "@/types";

interface MicRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

function MicRecorderInner({ onRecordingComplete, disabled = false }: MicRecorderProps) {
  const { t, lang } = useLanguage();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const [hasDetectedSound, setHasDetectedSound] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      recorderRef.current?.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    if (disabled) return;
    setDuration(0);
    setVolume(0);
    setHasDetectedSound(false);
    setRecordingState("recording");

    const recorder = new AudioRecorder({
      onStatusChange: (status) => {
        if (status === "error") {
          setRecordingState("idle");
          if (timerRef.current) clearInterval(timerRef.current);
        }
      },
      onVolumeChange: (vol) => {
        setVolume(vol);
        if (vol > 0.04) {
          setHasDetectedSound(true);
        }
      },
      onDataAvailable: (blob) => {
        setRecordingState("processing");
        onRecordingComplete(blob);
        setTimeout(() => setRecordingState("done"), 500);
      },
      onError: (error) => {
        console.error("Recording error:", error);
        setRecordingState("idle");
      },
    });
    recorderRef.current = recorder;
    await recorder.startRecording();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }, [disabled, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stopRecording();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMicClick = useCallback(() => {
    if (recordingState === "recording") stopRecording();
    else if (recordingState === "idle" || recordingState === "done") startRecording();
  }, [recordingState, startRecording, stopRecording]);

  const formatDuration = useCallback((s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`, []);

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full border border-clay/30 animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full border border-clay/20" style={{ animation: "pulse-soft 1.4s ease-out infinite" }} />
          </>
        )}
        <button
          onClick={handleMicClick}
          disabled={disabled || isProcessing}
          className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-150 border shadow-xs ${
            isRecording
              ? "bg-error text-white border-error scale-105"
              : isProcessing
                ? "bg-mist text-ink-soft border-line cursor-wait"
                : disabled
                  ? "bg-mist text-ink-faint border-line cursor-not-allowed"
                  : "bg-ink text-white border-ink hover:bg-black hover:scale-[1.02] active:scale-95"
          }`}
          aria-label={isRecording ? t.stopRecording : isProcessing ? t.processing : t.tapToRecord}
        >
          {isRecording ? (
            <span className="w-5 h-5 bg-white rounded-xs" />
          ) : isProcessing ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2Z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Live Audio Visualizer Wave */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-6 px-3 py-1 rounded-full bg-stone-100 border border-stone-200">
          {[0.5, 0.9, 1.4, 0.7, 1.2, 0.8, 1.5, 0.6, 1.0].map((scale, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                volume > 0.03 ? "bg-primary" : "bg-stone-300"
              }`}
              style={{
                height: `${Math.max(4, Math.min(20, (volume * 45 * scale) + 4))}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center">
        <p className={`text-xs font-semibold tracking-wide ${isRecording ? "text-error" : "text-ink-soft"}`}>
          {isRecording ? t.recording : isProcessing ? t.processing : t.tapToRecord}
        </p>

        {isRecording && (
          <div className="flex flex-col items-center gap-1 mt-1">
            <p className="text-xs tabular-nums text-ink-faint">{formatDuration(duration)}</p>
            {duration >= 2 && !hasDetectedSound && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse mt-0.5">
                {lang === "hi"
                  ? "⚠️ आवाज़ नहीं आ रही — कृपया माइक की जाँच करें"
                  : "⚠️ No sound detected — please check your mic"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MicRecorderInner);
