/**
 * SwarSaarthi — TypeScript Interfaces
 *
 * Central type definitions for the speech therapy app.
 * These types will be shared between frontend components and
 * eventually the backend API responses.
 */

/** A single Hindi word for practice */
export interface Word {
  id: string;
  /** The Hindi word in Devanagari script */
  word: string;
  /** Romanized transliteration for reference */
  transliteration: string;
  /** English meaning of the word */
  meaningEn: string;
  /** Hindi meaning of the word */
  meaningHi: string;
  /** Difficulty level: 1 (easy) to 5 (hard) */
  difficulty: number;
  /** Category/tag for the word (e.g., "greetings", "food", "animals") */
  category: string;
  /**
   * TODO: URL to the correct pronunciation audio file from backend TTS
   * Will be populated when backend is connected: GET /api/tts/:wordId
   * For now, we use browser's SpeechSynthesis API as a placeholder.
   */
  audioUrl?: string;
}

/** Result of a single pronunciation attempt */
export interface PronunciationAttempt {
  wordId: string;
  /** The text recognized by ASR from user's speech */
  recognizedText: string;
  /** The ASR model's raw prediction (same as recognizedText when using ASR) */
  predictionText: string;
  /** The expected/correct text */
  expectedText: string;
  /** Similarity score between 0 and 100 */
  score: number;
  /** Character Error Rate from jiwer (0.0 = perfect) */
  cer: number;
  /** Whether the attempt was considered correct (score >= threshold) */
  isCorrect: boolean;
  /** Human-readable feedback from the backend */
  feedbackMessage: string;
  /** Categorized feedback tier */
  feedbackTier?: "excellent" | "almost_there" | "needs_improvement";
  /** Detailed Gemini AI articulation coaching suggestion */
  geminiSuggestion?: string;
  /** Language used for the feedback ('en' or 'hi') */
  feedbackLanguage?: "en" | "hi";
  /** Timestamp of the attempt */
  timestamp: Date;
  /** The raw audio blob recorded by the user (for playback) */
  audioBlob?: Blob;
  /** Pre-synthesized base64 or URL audio for instant zero-latency feedback playback */
  feedbackAudio?: string;
}

export type FeedbackTier = "excellent" | "almost_there" | "needs_improvement";
export type FeedbackType = "success" | "almostThere" | "needsImprovement" | "tryAgain" | "neutral";

/** Aggregated stats for a single word */
export interface WordProgress {
  word: Word;
  /** Total number of attempts on this word */
  totalAttempts: number;
  /** Number of correct attempts */
  correctAttempts: number;
  /** Best score achieved */
  bestScore: number;
  /** Average score across all attempts */
  averageScore: number;
  /** Whether this word is flagged as "difficult" for the user */
  isDifficult: boolean;
}

/** User profile with overall progress */
export interface UserProfile {
  id: string;
  name: string;
  /** URL to user avatar image */
  avatarUrl?: string;
  /** Total words practiced across all sessions */
  totalWordsPracticed: number;
  /** Overall accuracy percentage */
  overallAccuracy: number;
  /** Current streak in days */
  streakDays: number;
  /** Words the user finds most difficult */
  difficultWords: WordProgress[];
  /** Recent practice sessions */
  recentSessions: PracticeSession[];
  /**
   * TODO: User authentication data
   * Will be managed by: POST /api/auth/login
   */
}

/** A single practice session */
export interface PracticeSession {
  id: string;
  /** Date of the session */
  date: string;
  /** Number of words attempted */
  wordsAttempted: number;
  /** Number of words correctly pronounced */
  wordsCorrect: number;
  /** Session accuracy percentage */
  accuracy: number;
  /** Duration of session in minutes */
  durationMinutes: number;
}

/** Recording state for the MicRecorder component */
export type RecordingState = "idle" | "recording" | "processing" | "done";

/** Feedback state after a pronunciation attempt */
export interface FeedbackState {
  /** Whether feedback is currently visible */
  isVisible: boolean;
  /** The pronunciation attempt result */
  attempt: PronunciationAttempt | null;
  /** Feedback message to display */
  message: string;
  /** Type of feedback for styling */
  type: FeedbackType;
}

/** Supported languages for the UI */
export type UILanguage = "en" | "hi";
