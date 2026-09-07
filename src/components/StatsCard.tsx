import { memo } from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
}

function StatsCard({ icon, label, value, suffix }: StatsCardProps) {
  return (
    <div className="card p-5">
      <div className="w-8 h-8 rounded-full border border-line bg-mist flex items-center justify-center mb-3 text-ink-soft">
        {icon}
      </div>
      <p className="text-2xl font-bold tracking-tight text-ink leading-none">
        {value}
        {suffix && <span className="text-sm font-normal text-ink-faint ml-1">{suffix}</span>}
      </p>
      <p className="text-xs text-ink-soft mt-1.5 tracking-wide">{label}</p>
    </div>
  );
}

export default memo(StatsCard);
