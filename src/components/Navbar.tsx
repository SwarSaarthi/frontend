/**
 * SwarSaarthi — Navbar Component
 *
 * Top navigation bar with:
 *  - App name/logo with Hindi subtitle
 *  - Navigation links (Home, Practice, Profile)
 *  - Language toggle button (English ↔ Hindi)
 *  - Mobile-responsive hamburger menu
 *
 * This is a client component because it uses state (mobile menu toggle)
 * and the language context.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, toggleLang } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t.navHome },
    { href: "/practice", label: t.navPractice },
    { href: "/profile", label: t.navProfile },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-primary-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / App Name */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Simple hand-drawn style icon */}
            <span className="text-2xl" role="img" aria-label="Speech icon">
              <Image src="/swarSaarthi.png" alt="logo" height={60} width={60} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-primary tracking-tight group-hover:text-primary-dark transition-colors">
                SwarSaarthi
              </span>
              <span className="text-[14px] text-text-secondary font-hindi -mt-1">
                स्वर सारथी
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-primary hover:bg-primary-50 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="ml-3 px-3 py-1.5 rounded-full text-xs font-medium border border-primary-200 text-primary hover:bg-primary-50 transition-all duration-200"
              aria-label="Toggle language"
            >
              {t.langSwitch}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6 text-text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-primary text-white"
                      : "text-text-primary hover:bg-primary-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleLang();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary-50 text-left transition-all"
              >
                🌐 {t.langSwitch}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
