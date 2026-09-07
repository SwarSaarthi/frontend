"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AudioRecorder } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import type { RecordingState } from "@/types";

interface MicRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export default function MicRecorder({ onRecordingComplete, disabled = false }: MicRecorderProps) {
  const { t } = useLanguage();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
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
    setRecordingState("recording");
    const recorder = new AudioRecorder({
      onStatusChange: (status) => {
        if (status === "error") {
          setRecordingState("idle");
          if (timerRef.current) clearInterval(timerRef.current);
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

  const handleMicClick = () => {
    if (recordingState === "recording") stopRecording();
    else if (recordingState === "idle" || recordingState === "done") startRecording();
  };

  const formatDuration = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full border border-clay/20" style={{ animation: "pulse-soft 1.4s ease-out infinite" }} />
            <span className="absolute inset-0 rounded-full border border-clay/10" style={{ animation: "pulse-soft 1.4s ease-out 0.35s infinite" }} />
          </>
        )}
        <button
          onClick={handleMicClick}
          disabled={disabled || isProcessing}
          className={`relative z-10 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full flex items-center justify-center transition-colors duration-150 border ${
            isRecording
              ? "bg-error text-white border-error"
              : isProcessing
                ? "bg-mist text-ink-soft border-line cursor-wait"
                : disabled
                  ? "bg-mist text-ink-faint border-line cursor-not-allowed"
                  : "bg-ink text-white border-ink hover:bg-black"
          }`}
          aria-label={isRecording ? t.stopRecording : isProcessing ? t.processing : t.tapToRecord}
        >
          {isRecording ? (
            <span className="w-4 h-4 bg-white rounded-sm" />
          ) : isProcessing ? (
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2Z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className={`text-xs font-medium tracking-wide ${isRecording ? "text-error" : isProcessing ? "text-ink-soft" : "text-ink-soft"}`}>
          {isRecording ? t.recording : isProcessing ? t.processing : t.tapToRecord}
        </p>
        {isRecording && <p className="text-xs tabular-nums text-ink-faint mt-1">{formatDuration(duration)}</p>}
      </div>
    </div>
  );
}
