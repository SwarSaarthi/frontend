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

// ── Global Audio Trackers for Instant Stopping ───────────────
let _activeAudioElement: HTMLAudioElement | null = null;

/**
 * Stops any active speech synthesis or audio playback in progress.
 */
export function stopSpeaking(): void {
  if (_activeAudioElement) {
    try {
      _activeAudioElement.pause();
      _activeAudioElement.currentTime = 0;
      _activeAudioElement.src = "";
    } catch {
      // Ignore cleanup error
    }
    _activeAudioElement = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak text using the browser's native Web Speech API as fallback.
 */
function speakBrowserFallback(
  text: string,
  lang: string = "hi",
  rate: number = 0.85
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = Math.max(0.4, Math.min(1.8, rate));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = lang === "hi" ? "hi" : "en";
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith(targetPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}

/**
 * High-performance TTS: Plays audio from the backend FastAPI TTS service
 * with fallback to browser SpeechSynthesis.
 *
 * @param text - The Hindi or English text to speak
 * @param options - Language and speech rate options
 */
export async function playFastTts(
  text: string,
  options: { lang?: string; rate?: number } = {}
): Promise<void> {
  if (!text || !text.trim()) return;

  const lang = options.lang || "hi";
  const rate = options.rate || 0.85;

  stopSpeaking();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const params = new URLSearchParams({
    text: text.trim(),
    lang,
    speed: String(rate),
  });
  const ttsUrl = `${baseUrl}/api/tts?${params.toString()}`;

  // Try playing via backend Fast TTS first (< 300ms)
  try {
    await new Promise<void>((resolve, reject) => {
      const audio = new Audio(ttsUrl);
      _activeAudioElement = audio;

      // Fail-fast timer: if backend audio hasn't started playing within 3.5s, fallback
      let timeoutId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        cleanup();
        try {
          audio.pause();
          audio.src = "";
        } catch {}
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
        reject(new Error("Backend TTS timeout"));
      }, 3500);

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      };

      // Crucial: Clear timeout as soon as audio actually begins playing!
      const onPlaying = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      };

      const onEnded = () => {
        cleanup();
        if (_activeAudioElement === audio) {
          _activeAudioElement = null;
        }
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
        reject(new Error("Audio load error"));
      };

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          cleanup();
          _activeAudioElement = null;
          reject(err);
        });
      }
    });
  } catch (err) {
    // If backend TTS fails or takes too long, stop cleanly and fallback to browser
    stopSpeaking();
    console.warn("Backend TTS failed, using browser synthesis fallback:", err);
    await speakBrowserFallback(text, lang, rate);
  }
}

/**
 * Speak a Hindi word with priority given to Fast Backend TTS.
 */
export function speakHindi(text: string, rate: number = 0.85): Promise<void> {
  return playFastTts(text, { lang: "hi", rate });
}

/**
 * Speak articulation coaching / feedback text.
 * Automatically respects language (Hindi or English).
 */
export function speakFeedback(
  text: string,
  lang: string = "en",
  rate: number = 0.9
): Promise<void> {
  // Strip emojis, markdown symbols, and bullets for smooth speech flow
  const clean = text
    .replace(/[🎯👅💡✨👉→•]/g, "")
    .replace(/[*_#`~>\[\]]/g, "")
    .trim();
  return playFastTts(clean, { lang, rate });
}
