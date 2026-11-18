/**
 * SwarSaarthi — Audio Recorder Utility
 *
 * Wraps the browser's MediaRecorder API to handle:
 *  1. Requesting microphone permission
 *  2. Recording audio as WebM/WAV chunks
 *  3. Combining chunks into a single Blob
 *  4. Providing the blob ready to be sent to the backend ASR endpoint
 *
 * FUTURE BACKEND INTEGRATION:
 *  - The recorded blob should be sent to: POST /api/asr
 *  - The backend will run the Hindi ASR model and return transcribed text
 *  - The request will be FormData with the audio blob:
 *      const formData = new FormData();
 *      formData.append("audio", blob, "recording.webm");
 *      const response = await fetch("/api/asr", { method: "POST", body: formData });
 *      const { transcribedText } = await response.json();
 */

import { API_BASE_URL } from "./api";

export type RecorderStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "stopped"
  | "error";

export interface RecorderCallbacks {
  onStatusChange?: (status: RecorderStatus) => void;
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  onVolumeChange?: (volume: number) => void;
}

/**
 * Creates and manages an audio recording session.
 * Uses MediaRecorder API with fallback MIME type detection.
 */
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private callbacks: RecorderCallbacks;
  private _status: RecorderStatus = "idle";
  private startTime: number = 0;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private volumeIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(callbacks: RecorderCallbacks = {}) {
    this.callbacks = callbacks;
  }

  get status(): RecorderStatus {
    return this._status;
  }

  /** Duration in seconds since recording started */
  get elapsedSeconds(): number {
    if (this._status !== "recording" || !this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Detect the best supported MIME type for audio recording.
   * Prefers WebM (Opus) as it's widely supported and efficient.
   */
  private getSupportedMimeType(): string {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    // Fallback — let the browser decide
    return "";
  }

  /**
   * Request microphone access and start recording.
   * The browser will prompt the user for permission on first call.
   */
  async startRecording(): Promise<void> {
    try {
      this.setStatus("requesting");
      this.audioChunks = [];

      // Request mic access with clean settings (no sampleRate constraint, allow hardware rate)
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });

      // Set up real-time volume analysis if callback is provided
      this.setupVolumeAnalysis(this.stream);

      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(
        this.stream,
        mimeType ? { mimeType } : undefined,
      );

      // Collect audio data in chunks
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // When recording stops, combine chunks into a single blob
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, {
          type: mimeType || "audio/webm",
        });
        this.callbacks.onDataAvailable?.(blob);
        this.setStatus("stopped");
        this.releaseStream();
      };

      this.mediaRecorder.onerror = () => {
        this.setStatus("error");
        this.callbacks.onError?.(
          new Error("MediaRecorder encountered an error"),
        );
        this.releaseStream();
      };

      // Start recording — collect data every 200ms
      this.mediaRecorder.start(200);
      this.startTime = Date.now();
      this.setStatus("recording");
    } catch (error) {
      this.setStatus("error");
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to access microphone");
      this.callbacks.onError?.(err);
    }
  }

  /**
   * Set up Web Audio API AnalyserNode to calculate real-time microphone volume.
   */
  private setupVolumeAnalysis(stream: MediaStream): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.volumeIntervalId = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average amplitude
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedVolume = Math.min(1.0, avg / 128); // 0.0 to 1.0

        this.callbacks.onVolumeChange?.(normalizedVolume);
      }, 60);
    } catch (err) {
      console.warn("Could not start audio volume analyser:", err);
    }
  }

  /** Stop the current recording */
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      try {
        // Flush any buffered audio before stopping
        this.mediaRecorder.requestData();
      } catch {
        // Ignore if already stopped
      }
      this.mediaRecorder.stop();
    }
    this.stopVolumeAnalysis();
  }

  private stopVolumeAnalysis(): void {
    if (this.volumeIntervalId) {
      clearInterval(this.volumeIntervalId);
      this.volumeIntervalId = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }

  /** Release the microphone stream */
  private releaseStream(): void {
    this.stopVolumeAnalysis();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  /** Update status and notify callback */
  private setStatus(status: RecorderStatus): void {
    this._status = status;
    this.callbacks.onStatusChange?.(status);
  }

  /** Clean up resources */
  destroy(): void {
    this.stopRecording();
    this.releaseStream();
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

// ── Global Audio Trackers for Instant Stopping & Priming ────────
let _activeAudioElement: HTMLAudioElement | null = null;
let _sharedAudioElement: HTMLAudioElement | null = null;

/**
 * Prime audio playback during a user gesture (such as clicking the mic button).
 * This unlocks browser autoplay policies for subsequent audio playback.
 */
export function primeAudioPlayback(): void {
  if (typeof window === "undefined") return;
  try {
    if (!_sharedAudioElement) {
      _sharedAudioElement = new Audio();
    }
    // Silent 1-sample WAV to prime the audio element within user interaction
    _sharedAudioElement.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    const playPromise = _sharedAudioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  } catch {}
}

/**
 * Stops any active speech synthesis or audio playback in progress immediately.
 */
export function stopSpeaking(): void {
  if (_activeAudioElement) {
    try {
      _activeAudioElement.pause();
      _activeAudioElement.currentTime = 0;
      _activeAudioElement.src = "";
    } catch {}
    _activeAudioElement = null;
  }

  // Also cancel any browser speech synthesis to prevent ghost audio
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

// Ensure all audio stops immediately if the user refreshes, navigates away, or closes the tab
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    stopSpeaking();
  });
  window.addEventListener("pagehide", () => {
    stopSpeaking();
  });
}

/**
 * Play pre-synthesized audio (data:audio/mpeg;base64,...) directly with zero latency.
 */
export async function playDirectAudio(audioSrc: string): Promise<void> {
  if (!audioSrc) return;
  stopSpeaking();

  return new Promise<void>((resolve, reject) => {
    if (!_sharedAudioElement) {
      _sharedAudioElement = new Audio();
    }
    const audio = _sharedAudioElement;
    _activeAudioElement = audio;

    const cleanup = () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
    };

    const onEnded = () => {
      cleanup();
      if (_activeAudioElement === audio) {
        _activeAudioElement = null;
      }
      resolve();
    };

    const onPause = () => {
      // If paused externally by stopSpeaking, resolve cleanly without triggering secondary errors
      cleanup();
      if (_activeAudioElement === audio) {
        _activeAudioElement = null;
      }
      resolve();
    };

    const onError = () => {
      cleanup();
      if (_activeAudioElement === audio) {
        _activeAudioElement = null;
      }
      reject(new Error("Audio playback failed"));
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.src = audioSrc;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        cleanup();
        _activeAudioElement = null;
        reject(err);
      });
    }
  });
}

export interface FastTtsOptions {
  lang?: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

/**
 * Single, natural female neural voice TTS (Microsoft Edge Neural hi-IN-SwaraNeural / en-IN-NeerjaNeural).
 * Streams MP3 audio directly from the backend FastAPI TTS service.
 */
export async function playFastTts(
  text: string,
  options: FastTtsOptions = {}
): Promise<void> {
  if (!text || !text.trim()) return;

  const lang = options.lang || "hi";
  const rate = options.rate || 0.85;

  stopSpeaking();

  const baseUrl = API_BASE_URL;
  let audioUrl = "";
  let objectUrlToRevoke: string | null = null;

  try {
    if (text.length > 100) {
      // For longer sentences/feedback: use POST with JSON body to prevent URL encoding issues
      const res = await fetch(`${baseUrl}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          lang,
          speed: rate,
        }),
      });
      if (!res.ok) {
        throw new Error(`TTS server responded with ${res.status}`);
      }
      const blob = await res.blob();
      objectUrlToRevoke = URL.createObjectURL(blob);
      audioUrl = objectUrlToRevoke;
    } else {
      const params = new URLSearchParams({
        text: text.trim(),
        lang,
        speed: String(rate),
      });
      audioUrl = `${baseUrl}/api/tts?${params.toString()}`;
    }

    await new Promise<void>((resolve, reject) => {
      if (!_sharedAudioElement) {
        _sharedAudioElement = new Audio();
      }
      const audio = _sharedAudioElement;
      _activeAudioElement = audio;

      // Note: Backend TTS service already synthesizes audio with the requested speed/rate applied.
      // Playing at 1.0 avoids double-scaling and keeps mouth animation tightly synchronized.
      audio.defaultPlaybackRate = 1.0;
      audio.playbackRate = 1.0;
      audio.src = audioUrl;

      let hasFiredEnd = false;
      const fireEndOnce = () => {
        if (!hasFiredEnd) {
          hasFiredEnd = true;
          options.onEnd?.();
        }
      };

      let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        cleanup();
        try {
          audio.pause();
          audio.src = "";
        } catch {}
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
        fireEndOnce();
        resolve(); // Resolve on timeout rather than cascading into another speech system
      }, 15000);

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (objectUrlToRevoke) {
          URL.revokeObjectURL(objectUrlToRevoke);
          objectUrlToRevoke = null;
        }
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("timeupdate", onTimeUpdate);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        audio.removeEventListener("pause", onPause);
      };

      const clearConnectionTimeout = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      const onLoaded = () => {
        clearConnectionTimeout();
      };

      const onCanPlay = () => {
        clearConnectionTimeout();
      };

      const onPlaying = () => {
        clearConnectionTimeout();
        // Signal mouth animation to start ONLY when actual speaker audio playback begins!
        options.onStart?.();
      };

      const onTimeUpdate = () => {
        clearConnectionTimeout();
        // Trim silence tail: if within 0.12s of the audio duration, signal end early to prevent visual lag
        if (audio.duration && audio.duration > 0.4 && audio.currentTime >= audio.duration - 0.12) {
          fireEndOnce();
        }
      };

      const onEnded = () => {
        cleanup();
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
        fireEndOnce();
        resolve();
      };

      const onPause = () => {
        cleanup();
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
        fireEndOnce();
        resolve();
      };

      const onError = () => {
        cleanup();
        try {
          audio.pause();
          audio.src = "";
        } catch {}
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
        fireEndOnce();
        reject(new Error("Audio load error"));
      };

      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("timeupdate", onTimeUpdate);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);
      audio.addEventListener("pause", onPause);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          cleanup();
          _activeAudioElement = null;
          fireEndOnce();
          reject(err);
        });
      }
    });
  } catch (err) {
    // Stop cleanly without triggering any secondary TTS engines
    stopSpeaking();
    options.onEnd?.();
    console.warn("TTS playback stopped or unavailable:", err);
  }
}

/**
 * Speak a Hindi word using the natural female neural voice.
 */
export function speakHindi(
  text: string,
  rate: number = 0.85,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): Promise<void> {
  return playFastTts(text, {
    lang: "hi",
    rate,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
  });
}

/**
 * Speak articulation coaching / feedback text using the natural female neural voice.
 */
export function speakFeedback(
  text: string,
  lang: string = "en",
  rate: number = 0.9,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): Promise<void> {
  const clean = text
    .replace(/[🎯👅💡✨👉→•]/g, "")
    .replace(/[*_#`~>\[\]]/g, "")
    .trim();
  return playFastTts(clean, {
    lang,
    rate,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
  });
}
