"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { AudioRecorder, primeAudioPlayback } from "@/lib/audioRecorder";
import { useLanguage } from "@/components/LanguageProvider";
import type { RecordingState } from "@/types";

interface MicRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}

function MicRecorderInner({
  onRecordingComplete,
  onRecordingStateChange,
  disabled = false,
  isProcessing: externalProcessing = false,
}: MicRecorderProps) {
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
    if (disabled || externalProcessing) return;
    setDuration(0);
    setVolume(0);
    setHasDetectedSound(false);
    setRecordingState("recording");
    onRecordingStateChange?.(true);

    const recorder = new AudioRecorder({
      onStatusChange: (status) => {
        if (status === "error") {
          setRecordingState("idle");
          onRecordingStateChange?.(false);
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
        onRecordingStateChange?.(false);
        setRecordingState("done");
      },
      onError: (error) => {
        console.error("Recording error:", error);
        setRecordingState("idle");
      },
    });
    recorderRef.current = recorder;
    await recorder.startRecording();
    if (recorder.status === "recording") {
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    }
  }, [disabled, externalProcessing, onRecordingComplete, onRecordingStateChange]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.status === "requesting") {
      recorderRef.current.destroy();
      setRecordingState("idle");
      onRecordingStateChange?.(false);
    } else {
      recorderRef.current?.stopRecording();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [onRecordingStateChange]);

  const handleMicClick = useCallback(() => {
    primeAudioPlayback();
    if (recordingState === "recording") stopRecording();
    else if (recordingState === "idle" || recordingState === "done") startRecording();
  }, [recordingState, startRecording, stopRecording]);

  const formatDuration = useCallback(
    (s: number) =>
      `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`,
    []
  );

  const isRecording = recordingState === "recording";
  const isProcessing = externalProcessing || recordingState === "processing";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic Stage with fixed dimensions so outer rings never overlap surrounding elements */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {isRecording && (
          <>
            <span className="absolute inset-1 rounded-full border border-clay/30 animate-ping opacity-30" />
            <span
              className="absolute inset-0 rounded-full border border-clay/20"
              style={{ animation: "pulse-soft 1.4s ease-out infinite" }}
            />
          </>
        )}

        {isProcessing && (
          <>
            <span className="absolute inset-2 rounded-full border-2 border-clay/40 animate-ping opacity-40" />
            <span
              className="absolute inset-0 rounded-full border border-clay/25"
              style={{ animation: "pulse-soft 1.2s ease-out infinite" }}
            />
          </>
        )}

        <button
          onClick={handleMicClick}
          disabled={disabled || isProcessing}
          className={`relative z-10 w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-150 border shadow-xs ${
            isRecording
              ? "bg-error text-white border-error scale-105"
              : isProcessing
              ? "bg-clay text-white border-clay shadow-md shadow-clay-ring/60 cursor-wait animate-pulse"
              : disabled
              ? "bg-mist text-ink-faint border-line cursor-not-allowed"
              : "bg-ink text-white border-ink hover:bg-black hover:scale-[1.02] active:scale-95"
          }`}
          aria-label={isRecording ? t.stopRecording : isProcessing ? t.processing : t.tapToRecord}
        >
          {isRecording ? (
            <span className="w-5 h-5 bg-white rounded-xs" />
          ) : isProcessing ? (
            <svg className="w-7 h-7 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-95" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2Z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Live Audio Visualizer Wave while Recording */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-6 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 animate-fade-in">
          {[0.5, 0.9, 1.4, 0.7, 1.2, 0.8, 1.5, 0.6, 1.0].map((scale, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-75 ${
                volume > 0.03 ? "bg-primary" : "bg-stone-300"
              }`}
              style={{
                height: `${Math.max(4, Math.min(20, volume * 45 * scale + 4))}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Processing Animation Card when Backend is Evaluating Speech */}
      {isProcessing && (
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-2.5 px-5 py-3 rounded-2xl bg-warm-sand/80 border border-stone-300/80 text-ink shadow-2xs animate-fade-in">
          <div className="flex items-center gap-1.5 h-4">
            {[0.4, 0.8, 1.3, 0.6, 1.1, 0.7, 1.4, 0.5].map((scale, idx) => (
              <span
                key={idx}
                className="w-1 bg-clay rounded-full animate-pulse"
                style={{
                  height: `${Math.round(scale * 14)}px`,
                  animationDelay: `${idx * 120}ms`,
                  animationDuration: "900ms",
                }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-ink flex items-center justify-center gap-1.5">
              <span>{lang === "hi" ? "वाक् विश्लेषण जारी है…" : "Analyzing your speech…"}</span>
            </p>
            <p className="text-[11px] text-ink-soft font-medium mt-0.5">
              {lang === "hi"
                ? "IndicWav2Vec ASR व Mitra AI फ़ीडबैक तैयार हो रहा है"
                : "Evaluating phonemes & generating Mitra AI articulation advice"}
            </p>
          </div>
        </div>
      )}

      {/* Status Label & Recording Timer */}
      {!isProcessing && (
        <div className="text-center">
          <p className={`text-xs font-semibold tracking-wide ${isRecording ? "text-error" : "text-ink-soft"}`}>
            {isRecording ? t.recording : t.tapToRecord}
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
      )}
    </div>
  );
}

export default memo(MicRecorderInner);
