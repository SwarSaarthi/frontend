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

/**
 * Stops any active speech synthesis in progress.
 */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speak a Hindi word using the browser's built-in Text-to-Speech.
 *
 * @param text - The Hindi text to speak (in Devanagari)
 * @param rate - Speech rate (0.1 to 2.0, default 0.75 for clarity)
 */
export function speakHindi(text: string, rate: number = 0.75): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      reject(new Error("Speech synthesis not supported in this browser"));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Use a small timeout to let the browser cancel cleanly before dispatching a new utterance
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "hi-IN";
        utterance.rate = Math.max(0.2, Math.min(2.0, rate));
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a Hindi voice
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) => v.lang === "hi-IN" || v.lang.toLowerCase().startsWith("hi"),
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          // If cancelled by another playback, treat as benign
          if (event.error === "canceled" || event.error === "interrupted") {
            resolve();
          } else {
            reject(new Error(`Speech synthesis error: ${event.error}`));
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to speak"));
      }
    }, 20);
  });
}

