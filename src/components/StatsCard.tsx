/**
 * SwarSaarthi — StatsCard Component
 *
 * Displays a single statistic in a warm card style.
 * Used on the Profile page for metrics like:
 *  - Total words practiced
 *  - Overall accuracy
 *  - Streak days
 *
 * TODO: Stats data will come from GET /api/profile
 */

"use client";

interface StatsCardProps {
  /** Icon emoji */
  icon: string;
  /** The label for the stat */
  label: string;
  /** The numeric value */
  value: number | string;
  /** Optional suffix (e.g., "%", "days") */
  suffix?: string;
  /** Optional accent color class */
  accentColor?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  suffix,
  accentColor = "text-primary",
}: StatsCardProps) {
  return (
    <div className="card-warm p-5 text-center">
      <span className="text-3xl mb-2 block">{icon}</span>
      <p className={`text-3xl font-bold ${accentColor} mb-1`}>
        {value}
        {suffix && (
          <span className="text-lg font-normal text-text-muted ml-0.5">
            {suffix}
          </span>
        )}
      </p>
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}
