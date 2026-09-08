"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import StatsCard from "@/components/StatsCard";
import DifficultWords from "@/components/DifficultWords";
import { mockUserProfile } from "@/lib/mockData";
import {
  profileApi,
  authApi,
  getAuthToken,
  type ProfileSummary,
  type FocusWordItem,
  type StreakDay,
  type DifficultyProgress,
} from "@/lib/api";
import type { WordProgress } from "@/types";

function DocIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v1M12 21v1M2 12h1M21 12h1" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path d="M12 3s4 3.2 4 7a4 4 0 0 1-8 0c0-3.8 4-7 4-7Z" />
      <path d="M12 17a2 2 0 0 0 2-2c0-1-1-1.8-2-3-1 1.2-2 2-2 3a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null);
  const [focusWords, setFocusWords] = useState<FocusWordItem[]>([]);
  const [calendarData, setCalendarData] = useState<StreakDay[]>([]);
  const [difficultyProgress, setDifficultyProgress] = useState<DifficultyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      const token = getAuthToken();
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      try {
        const [summary, focus, cal, prog] = await Promise.allSettled([
          profileApi.getSummary(),
          profileApi.getFocusWords(),
          profileApi.getStreakCalendar(90),
          profileApi.getProgress(),
        ]);

        if (isMounted) {
          if (summary.status === "fulfilled") setProfileSummary(summary.value);
          if (focus.status === "fulfilled") setFocusWords(focus.value.focus_words);
          if (cal.status === "fulfilled") setCalendarData(cal.value.calendar);
          if (prog.status === "fulfilled") setDifficultyProgress(prog.value);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setIsLoggedIn(false);
    setProfileSummary(null);
    router.push("/login");
  };

  // Profile display values (with fallback to mock data for guest preview)
  const userName = profileSummary?.user?.full_name || mockUserProfile.name;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "S";
  const streakDays = profileSummary?.streak?.current_streak ?? mockUserProfile.streakDays;
  const totalPracticed = profileSummary?.stats?.unique_words_practiced ?? mockUserProfile.totalWordsPracticed;
  const accuracy = profileSummary?.stats?.overall_accuracy ?? mockUserProfile.overallAccuracy;

  // Render Calendar Heatmap Grid (last 12 weeks / 84 days)
  const calendarGrid = useMemo(() => {
    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const dateMap = new Map<string, number>();
    calendarData.forEach((d) => dateMap.set(d.date, d.count));

    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      days.push({
        date: iso,
        count: dateMap.get(iso) || 0,
        dayOfWeek: d.getDay(),
      });
    }
    return days;
  }, [calendarData]);

  // Formatted difficult words for component
  const mappedDifficultWords: WordProgress[] = useMemo(() => {
    if (focusWords.length > 0) {
      return focusWords.map((fw) => ({
        word: {
          id: fw.word_id,
          word: fw.text_hi,
          transliteration: fw.transliteration,
          meaningEn: fw.meaning_en,
          meaningHi: fw.text_hi,
          difficulty: fw.difficulty === "basic" ? 1 : fw.difficulty === "intermediate" ? 2 : 3,
          category: fw.category,
        },
        totalAttempts: fw.total_attempts,
        correctAttempts: fw.correct_attempts,
        bestScore: fw.best_score,
        averageScore: fw.avg_accuracy,
        isDifficult: true,
      }));
    }
    return mockUserProfile.difficultWords;
  }, [focusWords]);

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">{t.profileTitle}</h1>
            <span className="h-px w-12 bg-line hidden sm:block" />
          </div>

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-xs"
            >
              {lang === "hi" ? "साइन इन करें" : "Sign In to Save Progress"}
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-line bg-white text-zinc-600 hover:text-red-600 hover:border-red-200 transition-all"
            >
              {lang === "hi" ? "लॉग आउट" : "Sign Out"}
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="card p-6 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-blue-500/20">
              {userInitial}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-ink leading-tight">{userName}</h2>
              <p className="text-xs text-ink-soft mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {profileSummary?.user?.email || (isLoggedIn ? "Active Learner" : "Guest Mode — Sign in to save streak")}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200/60 rounded-full px-3 py-1 flex items-center gap-1">
              🔥 {streakDays} {lang === "hi" ? "दिनों की स्ट्रीक" : "Day Streak"}
            </span>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatsCard icon={<DocIcon className="w-4 h-4" />} label={t.totalPracticed} value={totalPracticed} />
          <StatsCard icon={<TargetIcon className="w-4 h-4" />} label={t.accuracy} value={accuracy} suffix="%" />
          <StatsCard icon={<FlameIcon className="w-4 h-4" />} label={t.streak} value={streakDays} />
        </div>

        {/* Streak Heatmap Calendar Section */}
        <section className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink flex items-center gap-2">
                <span>🗓️</span>
                {lang === "hi" ? "अभ्यास कैलेंडर एवं स्ट्रीक" : "Practice Streak Calendar"}
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                {lang === "hi"
                  ? "पिछले 12 हफ्तों की आपकी दैनिक बोलने की गतिविधि"
                  : "Your daily speech practice activity over the last 12 weeks"}
              </p>
            </div>
            <span className="text-xs text-zinc-500 font-medium hidden sm:block">
              {calendarData.length > 0 ? `${calendarData.length} active days` : "Start practicing daily"}
            </span>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
              {calendarGrid.map((day, idx) => {
                const count = day.count;
                let bgClass = "bg-stone-100 border border-stone-200/60";
                if (count >= 5) bgClass = "bg-emerald-600 border border-emerald-700";
                else if (count >= 3) bgClass = "bg-emerald-500 border border-emerald-600";
                else if (count >= 1) bgClass = "bg-emerald-300 border border-emerald-400";

                return (
                  <div
                    key={idx}
                    title={`${day.date}: ${count} words practiced`}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-colors ${bgClass}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-3 pt-3 border-t border-line">
            <span>{lang === "hi" ? "कम" : "Less"}</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-xs bg-stone-100 border border-stone-200" />
              <div className="w-3 h-3 rounded-xs bg-emerald-300 border border-emerald-400" />
              <div className="w-3 h-3 rounded-xs bg-emerald-500 border border-emerald-600" />
              <div className="w-3 h-3 rounded-xs bg-emerald-600 border border-emerald-700" />
            </div>
            <span>{lang === "hi" ? "अधिक" : "More"}</span>
          </div>
        </section>

        {/* Difficulty Progress Breakdown Section */}
        <section className="card p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink flex items-center gap-2">
              <span>📊</span>
              {lang === "hi" ? "कठिनाई स्तर प्रगति" : "Difficulty Progress"}
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              {lang === "hi"
                ? "सरल, मध्यम और उन्नत श्रेणियों में आपके अभ्यास की प्रगति"
                : "Your progress across Basic, Intermediate, and Advanced vocabulary"}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "basic",
                labelEn: "Basic (मूल)",
                labelHi: "सरल स्तर",
                data: difficultyProgress?.breakdown?.basic || {
                  total_words: 200,
                  attempted_words: 45,
                  mastered_words: 38,
                  avg_accuracy: 88.5,
                  completion_percentage: 22.5,
                },
                color: "bg-emerald-500",
              },
              {
                key: "intermediate",
                labelEn: "Intermediate (मध्यम)",
                labelHi: "मध्यम स्तर",
                data: difficultyProgress?.breakdown?.intermediate || {
                  total_words: 180,
                  attempted_words: 28,
                  mastered_words: 20,
                  avg_accuracy: 76.2,
                  completion_percentage: 15.5,
                },
                color: "bg-blue-500",
              },
              {
                key: "advanced",
                labelEn: "Advanced (उन्नत)",
                labelHi: "उन्नत स्तर",
                data: difficultyProgress?.breakdown?.advanced || {
                  total_words: 140,
                  attempted_words: 12,
                  mastered_words: 6,
                  avg_accuracy: 64.0,
                  completion_percentage: 8.5,
                },
                color: "bg-purple-500",
              },
            ].map((tier) => (
              <div key={tier.key} className="p-3.5 rounded-2xl bg-stone-50/60 border border-stone-200/70">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 mb-1.5">
                  <span>{lang === "hi" ? tier.labelHi : tier.labelEn}</span>
                  <span className="text-zinc-500 font-normal">
                    {tier.data.attempted_words} / {tier.data.total_words} {lang === "hi" ? "शब्द" : "words"} ({tier.data.completion_percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${tier.color} transition-all duration-500`}
                    style={{ width: `${Math.min(100, tier.data.completion_percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>{lang === "hi" ? "सटीकता:" : "Avg Accuracy:"} {tier.data.avg_accuracy}%</span>
                  <span>{lang === "hi" ? "महारत:" : "Mastered:"} {tier.data.mastered_words}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Words to Focus On Section */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink flex items-center gap-2">
              <span>🎯</span>
              {t.difficultWordsTitle}
            </h2>
            <p className="text-sm text-ink-soft">{t.difficultWordsDesc}</p>
          </div>
          <DifficultWords words={mappedDifficultWords} />
        </section>
      </div>
    </div>
  );
}
