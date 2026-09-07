/**
 * SwarSaarthi — MicRecorder Component
 *
 * Central recording UI for the practice room. Handles:
 *  - Microphone permission request
 *  - Visual recording state (idle → recording → processing)
 *  - Animated pulse ring while recording
 *  - Timer showing recording duration
 *  - Returns audio blob for processing
 *
 * FUTURE BACKEND INTEGRATION:
 *  When the backend is ready, the audio blob from onRecordingComplete
 *  should be sent to POST /api/asr as FormData:
 *
 *    const formData = new FormData();
 *    formData.append("audio", blob, "recording.webm");
 *    const res = await fetch("/api/asr", { method: "POST", body: formData });
 *    const { transcribedText, confidence } = await res.json();
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AudioRecorder } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import type { RecordingState } from "@/types";

interface MicRecorderProps {
  /** Called when recording is complete with the audio blob */
  onRecordingComplete: (blob: Blob) => void;
  /** Whether the component is disabled (e.g., during feedback display) */
  disabled?: boolean;
}

export default function MicRecorder({
  onRecordingComplete,
  disabled = false,
}: MicRecorderProps) {
  const { t } = useLanguage();
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up on unmount
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
        // After a brief "processing" visual, return to idle
        setTimeout(() => setRecordingState("done"), 500);
      },
      onError: (error) => {
        console.error("Recording error:", error);
        setRecordingState("idle");
      },
    });

    recorderRef.current = recorder;
    await recorder.startRecording();

    // Start duration timer
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }, [disabled, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stopRecording();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMicClick = () => {
    if (recordingState === "recording") {
      stopRecording();
    } else if (recordingState === "idle" || recordingState === "done") {
      startRecording();
    }
  };

  // Format seconds as MM:SS
  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isRecording = recordingState === "recording";
  const isProcessing = recordingState === "processing";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic Button with Pulse Animation */}
      <div className="relative">
        {/* Pulse rings — visible only while recording */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
            <span
              className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}

        <button
          onClick={handleMicClick}
          disabled={disabled || isProcessing}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200 ${
            isRecording
              ? "bg-error text-white shadow-lg scale-110"
              : isProcessing
                ? "bg-accent text-white cursor-wait"
                : disabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          }`}
          aria-label={
            isRecording
              ? t.stopRecording
              : isProcessing
                ? t.processing
                : t.tapToRecord
          }
        >
          {isRecording ? (
            // Stop icon (square)
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : isProcessing ? (
            // Spinner
            <svg
              className="w-8 h-8 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            // Mic icon
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Status Text & Timer */}
      <div className="text-center">
        <p
          className={`text-sm font-medium ${
            isRecording
              ? "text-error"
              : isProcessing
                ? "text-accent"
                : "text-text-secondary"
          }`}
        >
          {isRecording
            ? t.recording
            : isProcessing
              ? t.processing
              : t.tapToRecord}
        </p>

        {/* Recording duration timer */}
        {isRecording && (
          <p className="text-xs text-text-muted mt-1 font-mono">
            {formatDuration(duration)}
          </p>
        )}
      </div>
    </div>
  );
}
