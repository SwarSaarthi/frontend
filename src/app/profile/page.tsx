"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
import AuthGuard from "@/components/AuthGuard";

function DocIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9Z" />
      <path d="M14 3v6h6M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v1M12 21v1M2 12h1M21 12h1" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M12 3s4 3.2 4 7a4 4 0 0 1-8 0c0-3.8 4-7 4-7Z" />
      <path d="M12 17a2 2 0 0 0 2-2c0-1-1-1.8-2-3-1 1.2-2 2-2 3a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard mode="protected">
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(
    null,
  );
  const [focusWords, setFocusWords] = useState<FocusWordItem[]>([]);
  const [calendarData, setCalendarData] = useState<StreakDay[]>([]);
  const [difficultyProgress, setDifficultyProgress] =
    useState<DifficultyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Drag-to-scroll State & Refs
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

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
          profileApi.getStreakCalendar(365),
          profileApi.getProgress(),
        ]);

        if (isMounted) {
          if (summary.status === "fulfilled") setProfileSummary(summary.value);
          if (focus.status === "fulfilled")
            setFocusWords(focus.value.focus_words);
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
  const streakDays =
    profileSummary?.streak?.current_streak ?? mockUserProfile.streakDays;
  const totalPracticed =
    profileSummary?.stats?.unique_words_practiced ??
    mockUserProfile.totalWordsPracticed;
  const accuracy =
    profileSummary?.stats?.overall_accuracy ?? mockUserProfile.overallAccuracy;

  // ── LeetCode-Style Streak Heatmap Grid (52 Weeks / 1 Year) ──
  const NUM_WEEKS = 52;

  const { weeks, activeDaysCount } = useMemo(() => {
    const dateMap = new Map<string, number>();
    let activeCount = 0;

    calendarData.forEach((d) => {
      dateMap.set(d.date, d.count);
      if (d.count > 0) activeCount++;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat

    // Sunday of the current week (rightmost column)
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - todayDayOfWeek);

    // Sunday of the first week (leftmost column, 51 weeks before current week)
    const startSunday = new Date(currentWeekSunday);
    startSunday.setDate(startSunday.getDate() - (NUM_WEEKS - 1) * 7);

    const weeksList: {
      weekIndex: number;
      days: ({
        date: string;
        formattedDate: string;
        count: number;
        dayOfWeek: number;
        isToday: boolean;
        isFuture: boolean;
      } | null)[];
      monthLabel?: string;
    }[] = [];

    let lastMonthSeen = -1;
    let lastMonthWeek = -4;

    const monthNamesEn = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthNamesHi = [
      "जन",
      "फर",
      "मार्च",
      "अप्रैल",
      "मई",
      "जून",
      "जुलाई",
      "अग",
      "सितंबर",
      "अक्टूबर",
      "नवंबर",
      "दिसंबर",
    ];
    const monthNames = lang === "hi" ? monthNamesHi : monthNamesEn;

    for (let w = 0; w < NUM_WEEKS; w++) {
      const weekSunday = new Date(startSunday);
      weekSunday.setDate(startSunday.getDate() + w * 7);

      const daysInWeek = [];
      let monthForThisWeek: string | undefined = undefined;

      for (let d = 0; d < 7; d++) {
        const dateObj = new Date(weekSunday);
        dateObj.setDate(weekSunday.getDate() + d);
        dateObj.setHours(0, 0, 0, 0);

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const dayNum = dateObj.getDate();

        // Place month label at start of month if spaced out from previous label
        if (
          month !== lastMonthSeen &&
          (w - lastMonthWeek >= 3 || lastMonthSeen === -1)
        ) {
          monthForThisWeek = monthNames[month];
          lastMonthSeen = month;
          lastMonthWeek = w;
        }

        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
        const isFuture = dateObj.getTime() > today.getTime();
        const isToday = dateObj.getTime() === today.getTime();
        const count = dateMap.get(iso) || 0;

        daysInWeek.push({
          date: iso,
          formattedDate: dateObj.toLocaleDateString(
            lang === "hi" ? "hi-IN" : "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          ),
          count,
          dayOfWeek: d,
          isToday,
          isFuture,
        });
      }

      weeksList.push({
        weekIndex: w,
        days: daysInWeek,
        monthLabel: monthForThisWeek,
      });
    }

    return { weeks: weeksList, activeDaysCount: activeCount };
  }, [calendarData, lang]);

  // Auto-scroll to far-right on load / data update
  useEffect(() => {
    if (calendarScrollRef.current) {
      calendarScrollRef.current.scrollLeft =
        calendarScrollRef.current.scrollWidth;
    }
  }, [calendarData, weeks]);

  // Drag to Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!calendarScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - calendarScrollRef.current.offsetLeft);
    setScrollLeftState(calendarScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !calendarScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - calendarScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // Scroll speed multiplier
    calendarScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

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
          difficulty:
            fw.difficulty === "basic"
              ? 1
              : fw.difficulty === "intermediate"
                ? 2
                : 3,
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
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {t.profileTitle}
            </h1>
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
              <h2 className="text-lg sm:text-xl font-bold text-ink leading-tight">
                {userName}
              </h2>
              <p className="text-xs text-ink-soft mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {profileSummary?.user?.email ||
                  (isLoggedIn
                    ? "Active Learner"
                    : "Guest Mode — Sign in to save streak")}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200/60 rounded-full px-3 py-1 flex items-center gap-1">
              🔥 {streakDays}{" "}
              {lang === "hi" ? "दिनों की स्ट्रीक" : "Day Streak"}
            </span>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatsCard
            icon={<DocIcon className="w-4 h-4" />}
            label={t.totalPracticed}
            value={totalPracticed}
          />
          <StatsCard
            icon={<TargetIcon className="w-4 h-4" />}
            label={t.accuracy}
            value={accuracy}
            suffix="%"
          />
          <StatsCard
            icon={<FlameIcon className="w-4 h-4" />}
            label={t.streak}
            value={streakDays}
          />
        </div>

        {/* Streak Heatmap Calendar Section */}
        <section className="card p-5 sm:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink flex items-center gap-2">
                <span>🗓️</span>
                {lang === "hi"
                  ? "अभ्यास कैलेंडर एवं स्ट्रीक"
                  : "Practice Streak Calendar"}
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                {lang === "hi"
                  ? "पिछले 1 वर्ष की आपकी दैनिक बोलने की गतिविधि"
                  : "Your daily speech practice activity over the past year"}
              </p>
            </div>
            <span className="text-xs text-zinc-500 font-medium hidden sm:block">
              {activeDaysCount > 0
                ? `${activeDaysCount} ${lang === "hi" ? "सक्रिय दिन" : "active days in the past year"}`
                : lang === "hi"
                  ? "प्रतिदिन अभ्यास शुरू करें"
                  : "Start practicing daily"}
            </span>
          </div>

          {/* Calendar Heatmap Drag Container */}
          <div
            ref={calendarScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`overflow-x-auto pb-4 pt-6 scrollbar-thin select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="inline-block min-w-full">
              {/* Month Header Labels */}
              <div className="flex gap-0.75 pl-6.5 text-[10px] text-zinc-400 font-medium h-4 mb-1 select-none">
                {weeks.map((week, idx) => (
                  <div key={idx} className="w-2.75 sm:w-3 shrink-0 relative">
                    {week.monthLabel && (
                      <span className="absolute left-0 top-0 whitespace-nowrap text-zinc-400 font-medium text-[10px]">
                        {week.monthLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid: Day Labels + Week Columns */}
              <div className="flex gap-1.5 items-start">
                {/* Day Labels */}
                <div className="grid grid-rows-7 gap-0.75 text-[9px] text-zinc-400 font-medium select-none shrink-0 w-5">
                  <span className="h-3 sm:h-3 leading-none flex items-center"></span>
                  <span className="h-3 sm:h-3 leading-none flex items-center text-zinc-400">
                    {lang === "hi" ? "सोम" : "Mon"}
                  </span>
                  <span className="h-3 sm:h-3 leading-none flex items-center"></span>
                  <span className="h-3 sm:h-3 leading-none flex items-center text-zinc-400">
                    {lang === "hi" ? "बुध" : "Wed"}
                  </span>
                  <span className="h-3 sm:h-3 leading-none flex items-center"></span>
                  <span className="h-3 sm:h-3 leading-none flex items-center text-zinc-400">
                    {lang === "hi" ? "शुक्र" : "Fri"}
                  </span>
                  <span className="h-3 sm:h-3 leading-none flex items-center"></span>
                </div>

                {/* Weeks Grid (52 columns x 7 rows) */}
                <div className="flex gap-0.75">
                  {weeks.map((week, wIdx) => (
                    <div
                      key={week.weekIndex}
                      className="grid grid-rows-7 gap-0.75 shrink-0"
                    >
                      {week.days.map((day, dIdx) => {
                        if (!day || day.isFuture) {
                          return (
                            <div
                              key={dIdx}
                              className="w-2.75 h-2.75 sm:w-3 sm:h-3 rounded-xs opacity-0 pointer-events-none"
                            />
                          );
                        }

                        const count = day.count;
                        let bgClass =
                          "bg-stone-200/40 hover:bg-stone-200/80 border border-stone-200/60";
                        if (count >= 5)
                          bgClass = "bg-emerald-600 border border-emerald-700";
                        else if (count >= 3)
                          bgClass = "bg-emerald-500 border border-emerald-600";
                        else if (count >= 1)
                          bgClass = "bg-emerald-300 border border-emerald-400";

                        const todayBorder = day.isToday
                          ? "ring-1.5 ring-emerald-500 ring-offset-1 z-10"
                          : "";

                        // Shift placement for last columns to prevent horizontal tooltip clipping
                        const isLastColumns = wIdx >= weeks.length - 4;

                        return (
                          <div
                            key={dIdx}
                            className="relative group flex items-center justify-center"
                          >
                            {/* Main heatmap block */}
                            <div
                              className={`w-2.75 h-2.75 sm:w-3 sm:h-3 rounded-xs transition-all duration-150 ${bgClass} ${todayBorder} hover:scale-125 hover:z-20 cursor-pointer`}
                            />

                            {/* Custom Tooltip Container */}
                            <div
                              className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col pointer-events-none z-50 ${
                                isLastColumns
                                  ? "right-0 items-end"
                                  : "left-1/2 -translate-x-1/2 items-center"
                              }`}
                            >
                              <div className="bg-slate-900 text-white text-xs py-1 px-2 rounded shadow-md whitespace-nowrap">
                                {`${day.formattedDate}: ${count} ${
                                  lang === "hi"
                                    ? "शब्द अभ्यास किए"
                                    : "words practiced"
                                }${day.isToday ? (lang === "hi" ? " (आज)" : " (Today)") : ""}`}
                              </div>

                              {/* Tooltip Arrow */}
                              <div
                                className={`w-2 h-2 -mt-1 bg-slate-900 rotate-45 ${
                                  isLastColumns ? "mr-1" : "self-center"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-3 pt-3 border-t border-line">
            <span>{lang === "hi" ? "कम" : "Less"}</span>
            <div className="flex items-center gap-1">
              <div
                title="0 words"
                className="w-2.5 h-2.5 rounded-xs bg-stone-200/40 border border-stone-200"
              />
              <div
                title="1-2 words"
                className="w-2.5 h-2.5 rounded-xs bg-emerald-300 border border-emerald-400"
              />
              <div
                title="3-4 words"
                className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600"
              />
              <div
                title="5+ words"
                className="w-2.5 h-2.5 rounded-xs bg-emerald-600 border border-emerald-700"
              />
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
              <div
                key={tier.key}
                className="p-3.5 rounded-2xl bg-stone-50/60 border border-stone-200/70"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 mb-1.5">
                  <span>{lang === "hi" ? tier.labelHi : tier.labelEn}</span>
                  <span className="text-zinc-500 font-normal">
                    {tier.data.attempted_words} / {tier.data.total_words}{" "}
                    {lang === "hi" ? "शब्द" : "words"} (
                    {tier.data.completion_percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-stone-200 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${tier.color} transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, tier.data.completion_percentage)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>
                    {lang === "hi" ? "सटीकता:" : "Avg Accuracy:"}{" "}
                    {tier.data.avg_accuracy}%
                  </span>
                  <span>
                    {lang === "hi" ? "महारत:" : "Mastered:"}{" "}
                    {tier.data.mastered_words}
                  </span>
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
