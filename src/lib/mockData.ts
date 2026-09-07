/**
 * SwarSaarthi — Mock Data
 *
 * Hardcoded Hindi words and mock user data for frontend development.
 *
 * TODO: Replace all mock data with API calls when backend is ready:
 *   - Words: GET /api/words?category=<category>&difficulty=<level>
 *   - Profile: GET /api/profile
 *   - Progress: GET /api/progress
 *   - Sessions: GET /api/sessions
 */

import type { Word, UserProfile, PracticeSession, WordProgress } from "@/types";

// ============================================================
// Hindi Practice Words Dataset
// These words are organized by difficulty (1 = easiest)
// TODO: Fetch from database via GET /api/words
// ============================================================
export const practiceWords: Word[] = [
  {
    id: "w1",
    word: "नमस्ते",
    transliteration: "Namaste",
    meaningEn: "Hello / Greetings",
    meaningHi: "अभिवादन",
    difficulty: 1,
    category: "greetings",
  },
  {
    id: "w2",
    word: "पानी",
    transliteration: "Paani",
    meaningEn: "Water",
    meaningHi: "जल",
    difficulty: 1,
    category: "daily-use",
  },
  {
    id: "w3",
    word: "माँ",
    transliteration: "Maa",
    meaningEn: "Mother",
    meaningHi: "माता",
    difficulty: 1,
    category: "family",
  },
  {
    id: "w4",
    word: "किताब",
    transliteration: "Kitaab",
    meaningEn: "Book",
    meaningHi: "पुस्तक",
    difficulty: 2,
    category: "objects",
  },
  {
    id: "w5",
    word: "सूरज",
    transliteration: "Sooraj",
    meaningEn: "Sun",
    meaningHi: "सूर्य",
    difficulty: 2,
    category: "nature",
  },
  {
    id: "w6",
    word: "तितली",
    transliteration: "Titli",
    meaningEn: "Butterfly",
    meaningHi: "तितली",
    difficulty: 2,
    category: "animals",
  },
  {
    id: "w7",
    word: "विद्यालय",
    transliteration: "Vidyaalay",
    meaningEn: "School",
    meaningHi: "पाठशाला",
    difficulty: 3,
    category: "places",
  },
  {
    id: "w8",
    word: "धन्यवाद",
    transliteration: "Dhanyavaad",
    meaningEn: "Thank you",
    meaningHi: "शुक्रिया",
    difficulty: 3,
    category: "greetings",
  },
  {
    id: "w9",
    word: "चिड़िया",
    transliteration: "Chidiya",
    meaningEn: "Bird",
    meaningHi: "पक्षी",
    difficulty: 2,
    category: "animals",
  },
  {
    id: "w10",
    word: "परिवार",
    transliteration: "Parivaar",
    meaningEn: "Family",
    meaningHi: "कुटुंब",
    difficulty: 3,
    category: "family",
  },
  {
    id: "w11",
    word: "अनुभव",
    transliteration: "Anubhav",
    meaningEn: "Experience",
    meaningHi: "तजुर्बा",
    difficulty: 4,
    category: "abstract",
  },
  {
    id: "w12",
    word: "स्वागत",
    transliteration: "Swaagat",
    meaningEn: "Welcome",
    meaningHi: "आदर सत्कार",
    difficulty: 3,
    category: "greetings",
  },
  {
    id: "w13",
    word: "प्रकृति",
    transliteration: "Prakriti",
    meaningEn: "Nature",
    meaningHi: "कुदरत",
    difficulty: 4,
    category: "nature",
  },
  {
    id: "w14",
    word: "सहयोग",
    transliteration: "Sahyog",
    meaningEn: "Cooperation",
    meaningHi: "मिलकर काम करना",
    difficulty: 4,
    category: "abstract",
  },
  {
    id: "w15",
    word: "अभ्यास",
    transliteration: "Abhyaas",
    meaningEn: "Practice",
    meaningHi: "अभ्यास करना",
    difficulty: 3,
    category: "abstract",
  },
];

// ============================================================
// Mock User Profile
// TODO: Fetch from backend via GET /api/profile
// ============================================================
export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "राहुल शर्मा",
  totalWordsPracticed: 87,
  overallAccuracy: 72,
  streakDays: 5,
  difficultWords: [
    {
      word: practiceWords[6], // विद्यालय
      totalAttempts: 12,
      correctAttempts: 3,
      bestScore: 68,
      averageScore: 42,
      isDifficult: true,
    },
    {
      word: practiceWords[12], // प्रकृति
      totalAttempts: 8,
      correctAttempts: 1,
      bestScore: 55,
      averageScore: 35,
      isDifficult: true,
    },
    {
      word: practiceWords[10], // अनुभव
      totalAttempts: 10,
      correctAttempts: 2,
      bestScore: 60,
      averageScore: 38,
      isDifficult: true,
    },
    {
      word: practiceWords[13], // सहयोग
      totalAttempts: 6,
      correctAttempts: 1,
      bestScore: 50,
      averageScore: 30,
      isDifficult: true,
    },
  ],
  recentSessions: [
    {
      id: "s1",
      date: "2026-09-07",
      wordsAttempted: 10,
      wordsCorrect: 7,
      accuracy: 70,
      durationMinutes: 15,
    },
    {
      id: "s2",
      date: "2026-09-06",
      wordsAttempted: 8,
      wordsCorrect: 6,
      accuracy: 75,
      durationMinutes: 12,
    },
    {
      id: "s3",
      date: "2026-09-05",
      wordsAttempted: 12,
      wordsCorrect: 9,
      accuracy: 75,
      durationMinutes: 20,
    },
    {
      id: "s4",
      date: "2026-09-04",
      wordsAttempted: 6,
      wordsCorrect: 4,
      accuracy: 67,
      durationMinutes: 10,
    },
    {
      id: "s5",
      date: "2026-09-03",
      wordsAttempted: 10,
      wordsCorrect: 7,
      accuracy: 70,
      durationMinutes: 18,
    },
  ],
};

// ============================================================
// Word categories for filtering (bilingual)
// ============================================================
export const wordCategories = [
  { id: "all", labelEn: "All Words", labelHi: "सभी शब्द" },
  { id: "greetings", labelEn: "Greetings", labelHi: "अभिवादन" },
  { id: "daily-use", labelEn: "Daily Use", labelHi: "रोज़मर्रा" },
  { id: "family", labelEn: "Family", labelHi: "परिवार" },
  { id: "objects", labelEn: "Objects", labelHi: "वस्तुएँ" },
  { id: "nature", labelEn: "Nature", labelHi: "प्रकृति" },
  { id: "animals", labelEn: "Animals", labelHi: "जानवर" },
  { id: "places", labelEn: "Places", labelHi: "स्थान" },
  { id: "abstract", labelEn: "Abstract", labelHi: "भावनाएँ" },
];
