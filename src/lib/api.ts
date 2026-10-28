/**
 * SwarSaarthi — Frontend API Client
 *
 * Connects Next.js frontend with FastAPI backend.
 * Handles JWT token persistence, auth state, word datasets,
 * pronunciation submission, streak tracking, and user profile.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Auth Token Helpers ──────────────────────────────────────────
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("swarsaarthi_token");
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("swarsaarthi_token", token);
    window.dispatchEvent(new Event("swarsaarthi_auth_changed"));
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("swarsaarthi_token");
    window.dispatchEvent(new Event("swarsaarthi_auth_changed"));
  }
}

// ── Generic Fetch Wrapper ────────────────────────────────────────
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("swarsaarthi_unauthorized"));
      }
    }
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

// ── FormData Fetch Wrapper (for file uploads) ────────────────────
async function apiFetchFormData<T>(endpoint: string, formData: FormData): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  // Do NOT set Content-Type — browser sets it with boundary for multipart
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401) {
      removeAuthToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("swarsaarthi_unauthorized"));
      }
    }
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

// ── Types ────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface WordItem {
  id: string;
  text_hi: string;
  transliteration: string;
  meaning_en: string;
  meaning_hi?: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  audio_url?: string | null;
}

export interface PracticeSubmitPayload {
  word_id: string;
  recognized_text: string;
}

export interface PracticeSubmitResult {
  session_id: string;
  word_id: string;
  target_text: string;
  recognized_text: string;
  accuracy_score: number;
  is_correct: boolean;
  details: {
    char_ratio: number;
    token_sort_ratio: number;
    partial_ratio: number;
  };
  needs_focus: boolean;
  streak: number;
}

export interface AsrPredictResult {
  session_id: string;
  word_id: string;
  target_text: string;
  prediction_text: string;
  accuracy_score: number;
  cer: number;
  is_correct: boolean;
  feedback_tier?: "excellent" | "almost_there" | "needs_improvement";
  feedback: string;
  details: {
    char_ratio: number;
    token_sort_ratio: number;
    partial_ratio: number;
  };
  needs_focus: boolean;
  streak: number;
}

export interface ProfileSummary {
  user: User;
  streak: {
    current_streak: number;
    longest_streak: number;
    total_practice_days: number;
  };
  stats: {
    unique_words_practiced: number;
    total_attempts: number;
    overall_accuracy: number;
    focus_words_count: number;
    total_words_available: number;
  };
}

export interface FocusWordItem {
  word_id: string;
  text_hi: string;
  transliteration: string;
  meaning_en: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  total_attempts: number;
  correct_attempts: number;
  avg_accuracy: number;
  best_score: number;
  last_practiced_at: string | null;
}

export interface StreakDay {
  date: string;
  count: number;
}

export interface DifficultyProgress {
  breakdown: {
    [key in "basic" | "intermediate" | "advanced"]: {
      total_words: number;
      attempted_words: number;
      mastered_words: number;
      avg_accuracy: number;
      completion_percentage: number;
    };
  };
}

// ── API Namespace ────────────────────────────────────────────────
export const authApi = {
  signup: (data: { email: string; password: string; full_name: string }) =>
    apiFetch<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: () => apiFetch<User>("/api/auth/me"),

  logout: () => {
    removeAuthToken();
  },
};

export const wordsApi = {
  list: (params?: { difficulty?: string; category?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.category) query.set("category", params.category);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    return apiFetch<WordItem[]>(`/api/words?${query.toString()}`);
  },

  getRandom: (count = 10, difficulty?: string) => {
    const query = new URLSearchParams({ count: String(count) });
    if (difficulty) query.set("difficulty", difficulty);
    return apiFetch<WordItem[]>(`/api/words/random?${query.toString()}`);
  },

  getCounts: () => apiFetch<{ basic: number; intermediate: number; advanced: number; total: number }>("/api/words/count"),

  getCategories: () => apiFetch<string[]>("/api/words/categories"),

  getById: (id: string) => apiFetch<WordItem>(`/api/words/${id}`),
};

export const practiceApi = {
  submit: (payload: PracticeSubmitPayload) =>
    apiFetch<PracticeSubmitResult>("/api/practice/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getHistory: (limit = 20, offset = 0) =>
    apiFetch<{ items: any[]; limit: number; offset: number }>(
      `/api/practice/history?limit=${limit}&offset=${offset}`
    ),
};

export const profileApi = {
  getSummary: () => apiFetch<ProfileSummary>("/api/profile"),

  getFocusWords: (limit = 20) =>
    apiFetch<{ focus_words: FocusWordItem[]; count: number }>(`/api/profile/focus-words?limit=${limit}`),

  getStreakCalendar: (days = 180) =>
    apiFetch<{ calendar: StreakDay[] }>(`/api/profile/streak-calendar?days=${days}`),

  getProgress: () => apiFetch<DifficultyProgress>("/api/profile/progress"),
};

export const asrApi = {
  predict: (audio: Blob, wordId: string) => {
    const formData = new FormData();
    formData.append("audio", audio, "recording.webm");
    formData.append("word_id", wordId);
    return apiFetchFormData<AsrPredictResult>("/api/asr/predict", formData);
  },
};
