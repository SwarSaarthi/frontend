/**
 * SwarSaarthi — Footer Component
 *
 * Simple footer with:
 *  - App tagline & description
 *  - Disclaimer: "This is an assistive tool, not a diagnostic system."
 *  - Project credits
 */

"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-warm-sand border-t border-primary-100/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center text-center gap-3">
          {/* App identity */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🗣️</span>
            <span className="text-base font-semibold text-primary">
              SwarSaarthi
            </span>
            <span className="text-sm text-text-secondary font-hindi">
              स्वर सारथी
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-text-secondary max-w-md">{t.footerText}</p>

          {/* Disclaimer — important for speech assistive system */}
          <p className="text-xs text-text-muted italic px-4 py-2 bg-primary-50 rounded-full">
            ⓘ {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
