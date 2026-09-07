"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import StatsCard from "@/components/StatsCard";
import DifficultWords from "@/components/DifficultWords";
import { mockUserProfile } from "@/lib/mockData";

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
  const { t, lang } = useLanguage();
  const profile = mockUserProfile;

  // format dates once per lang — avoids new Date() + toLocaleDateString on every render
  const sessions = useMemo(
    () =>
      profile.recentSessions.map((s) => ({
        ...s,
        label: new Date(s.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
          day: "numeric",
          month: "short",
        }),
      })),
    [lang, profile.recentSessions],
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">{t.profileTitle}</h1>
          <span className="h-px flex-1 bg-line hidden sm:block" />
        </div>

        <div className="card p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-ink text-white flex items-center justify-center text-lg font-bold shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-ink font-hindi leading-none">{profile.name}</h2>
            <p className="text-xs text-ink-soft mt-1.5 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full border border-line bg-mist flex items-center justify-center">
                <svg className="w-3 h-3 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 8h18M8 3v3M16 3v3" strokeLinecap="round" />
                </svg>
              </span>
              {lang === "hi" ? "सितंबर 2026 से सक्रिय" : "Active since September 2026"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <StatsCard icon={<DocIcon className="w-4 h-4" />} label={t.totalPracticed} value={profile.totalWordsPracticed} />
          <StatsCard icon={<TargetIcon className="w-4 h-4" />} label={t.accuracy} value={profile.overallAccuracy} suffix="%" />
          <StatsCard icon={<FlameIcon className="w-4 h-4" />} label={t.streak} value={profile.streakDays} />
        </div>

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink">{t.difficultWordsTitle}</h2>
            <p className="text-sm text-ink-soft">{t.difficultWordsDesc}</p>
          </div>
          <DifficultWords words={profile.difficultWords} />
        </section>

        <section>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-ink mb-4">{t.recentActivityTitle}</h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mist border border-line flex items-center justify-center text-xs font-semibold text-ink">
                    {session.label}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {session.wordsCorrect}/{session.wordsAttempted} {t.correct}
                    </p>
                    <p className="text-xs text-ink-faint">{session.durationMinutes} {t.duration}</p>
                  </div>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    session.accuracy >= 75
                      ? "bg-moss-soft text-moss border-moss/10"
                      : session.accuracy >= 50
                        ? "bg-mist text-ink border-line"
                        : "bg-error-light text-error border-error/10"
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
