"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-line bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full border border-line bg-mist flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
                <path d="M19 10a7 7 0 0 1-14 0M12 17v4M8 21h8" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-ink leading-none">SwarSaarthi <span className="font-hindi font-normal text-ink-soft">· स्वर सारथी</span></p>
              <p className="text-xs text-ink-faint mt-1">{t.footerText}</p>
            </div>
          </div>
          <p className="text-xs text-ink-faint flex items-center gap-2 bg-mist border border-line rounded-full px-3 py-1.5">
            <span className="w-3 h-3 rounded-full border border-stone-strong flex items-center justify-center text-[7px]">i</span>
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
