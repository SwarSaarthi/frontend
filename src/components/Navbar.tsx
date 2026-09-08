"use client";

import { useState, useMemo, useCallback, memo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { getAuthToken, removeAuthToken } from "@/lib/api";
import Image from "next/image";

function NavbarInner() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, toggleLang, lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Re-check token on every route change so the navbar updates after login/logout
  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, [pathname]);

  // Listen for storage events (login/logout in other tabs)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "swarsaarthi_token") {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // navLinks is memoised — without this, a new array on every parent re-render
  // would cause the .map list to reconcile as all-new nodes.
  const navLinks = useMemo(
    () => [
      { href: "/", label: t.navHome },
      ...(isLoggedIn
        ? [
            { href: "/practice", label: t.navPractice },
            { href: "/profile", label: t.navProfile },
          ]
        : []),
    ],
    [t.navHome, t.navPractice, t.navProfile, isLoggedIn],
  );

  const isActive = useCallback((href: string) => pathname === href, [pathname]);
  const handleToggleMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);
  const handleCloseMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const handleLangToggle = useCallback(() => {
    toggleLang();
    setIsMobileMenuOpen(false);
  }, [toggleLang]);

  const handleLogout = useCallback(() => {
    removeAuthToken();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  }, [router]);

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-[6px] border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-15">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-14 h-14 overflow-hidden flex items-center justify-center">
              <Image
                src="/swarSaarthi.png"
                alt="SwarSaarthi"
                height={60}
                width={60}
                priority
                sizes="60px"
                quality={85}
              />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[16px] font-bold tracking-tight text-ink">
                <span className="text-blue-900">Swar</span>
                <span className="text-orange-500">Saarthi</span>
              </span>
              <span className="text-[13px] font-hindi text-ink-soft mt-0.5 tracking-wide">
                <span className="text-blue-900">स्वर</span> <span className="text-orange-500">सारथी</span>
              </span>
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
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-150"
              >
                {lang === "hi" ? "लॉग आउट" : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium border border-line bg-white text-ink hover:bg-stone-50 hover:border-stone-strong transition-colors duration-150"
              >
                {lang === "hi" ? "लॉग इन" : "Sign In"}
              </Link>
            )}
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
            <svg
              className="w-4 h-4 text-ink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
            >
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
                    isActive(link.href)
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-white border border-line"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 bg-white text-left hover:bg-red-50 transition-colors"
                >
                  {lang === "hi" ? "लॉग आउट" : "Sign Out"}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={handleCloseMenu}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink border border-line bg-white text-left hover:bg-stone-50 transition-colors"
                >
                  {lang === "hi" ? "लॉग इन" : "Sign In"}
                </Link>
              )}

              <button
                onClick={handleLangToggle}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink border border-line bg-white text-left flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-ink-soft"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
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

