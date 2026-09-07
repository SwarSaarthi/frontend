"use client";

import { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";

function NavbarInner() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, toggleLang } = useLanguage();
  const pathname = usePathname();

  // navLinks is memoised — without this, a new array on every parent re-render
  // would cause the .map list to reconcile as all-new nodes.
  const navLinks = useMemo(
    () => [
      { href: "/", label: t.navHome },
      { href: "/practice", label: t.navPractice },
      { href: "/profile", label: t.navProfile },
    ],
    [t.navHome, t.navPractice, t.navProfile],
  );

  const isActive = useCallback((href: string) => pathname === href, [pathname]);
  const handleToggleMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);
  const handleCloseMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const handleLangToggle = useCallback(() => {
    toggleLang();
    setIsMobileMenuOpen(false);
  }, [toggleLang]);

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-[6px] border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full overflow-hidden border border-line bg-white flex items-center justify-center">
              <Image
                src="/swarSaarthi.png"
                alt="SwarSaarthi"
                height={36}
                width={36}
                priority
                sizes="36px"
                quality={85}
                className="object-contain"
              />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-ink">SwarSaarthi</span>
              <span className="text-[11px] font-hindi text-ink-soft -mt-0.5 tracking-wide">स्वर सारथी</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:text-ink hover:bg-white border border-transparent hover:border-line"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <span className="w-px h-4 bg-line mx-2" />
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-line bg-white text-ink-soft hover:border-stone-strong hover:text-ink transition-colors duration-150"
              aria-label="Toggle language"
            >
              {t.langSwitch}
            </button>
          </div>

          <button
            onClick={handleToggleMenu}
            className="md:hidden w-9 h-9 rounded-full border border-line bg-white flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2 border-t border-line mt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleCloseMenu}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-ink text-white" : "text-ink hover:bg-white border border-line"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLangToggle}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink border border-line bg-white text-left flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-ink-soft" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </svg>
                {t.langSwitch}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default memo(NavbarInner);
