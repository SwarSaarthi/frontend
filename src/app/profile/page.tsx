/**
 * SwarSaarthi — Profile Page
 *
 * User's profile and progress tracking page showing:
 *  - User info card with avatar placeholder
 *  - Overall stats (words practiced, accuracy, streak)
 *  - Difficult words section (words needing extra practice)
 *  - Recent practice sessions
 *
 * FUTURE BACKEND INTEGRATION:
 *  - Profile data: GET /api/profile
 *  - Progress data: GET /api/progress
 *  - Sessions: GET /api/sessions
 *  - Authentication: The profile will be behind auth (POST /api/auth/login)
 */

"use client";

import { useLanguage } from "@/components/LanguageProvider";
import StatsCard from "@/components/StatsCard";
import DifficultWords from "@/components/DifficultWords";
import { mockUserProfile } from "@/lib/mockData";

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const profile = mockUserProfile;

  return (
    <div className="min-h-[calc(100vh-8rem)] py-6 sm:py-10 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-8">
          {t.profileTitle}
        </h1>

        {/* ================================================================
            USER INFO CARD
            ================================================================ */}
        <div className="card-warm p-6 mb-8 flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary-light to-primary flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary font-hindi">
              {profile.name}
            </h2>
            <p className="text-sm text-text-secondary">
              {/* TODO: Replace with user's join date from backend */}
              🗓️{" "}
              {lang === "hi"
                ? "सितंबर 2026 से सक्रिय"
                : "Active since September 2026"}
            </p>
          </div>
        </div>

        {/* ================================================================
            STATS GRID
            ================================================================ */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatsCard
            icon="📝"
            label={t.totalPracticed}
            value={profile.totalWordsPracticed}
            accentColor="text-primary"
          />
          <StatsCard
            icon="🎯"
            label={t.accuracy}
            value={profile.overallAccuracy}
            suffix="%"
            accentColor="text-secondary"
          />
          <StatsCard
            icon="🔥"
            label={t.streak}
            value={profile.streakDays}
            accentColor="text-accent"
          />
        </div>

        {/* ================================================================
            DIFFICULT WORDS SECTION
            ================================================================ */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              {t.difficultWordsTitle}
            </h2>
            <p className="text-sm text-text-secondary">
              {t.difficultWordsDesc}
            </p>
          </div>
          <DifficultWords words={profile.difficultWords} />
        </section>

        {/* ================================================================
            RECENT SESSIONS
            ================================================================ */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            {t.recentActivityTitle}
          </h2>

          <div className="space-y-3">
            {profile.recentSessions.map((session) => (
              <div
                key={session.id}
                className="card-warm p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Date */}
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xs font-semibold text-primary">
                    {new Date(session.date).toLocaleDateString(
                      lang === "hi" ? "hi-IN" : "en-IN",
                      { day: "numeric", month: "short" },
                    )}
                  </div>

                  {/* Session info */}
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {session.wordsCorrect}/{session.wordsAttempted}{" "}
                      {t.correct}
                    </p>
                    <p className="text-xs text-text-muted">
                      {session.durationMinutes} {t.duration}
                    </p>
                  </div>
                </div>

                {/* Accuracy badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    session.accuracy >= 75
                      ? "bg-success-light text-success"
                      : session.accuracy >= 50
                        ? "bg-accent-light text-accent"
                        : "bg-error-light text-error"
                  }`}
                >
                  {session.accuracy}%
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
