"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi, setAuthToken } from "@/lib/api";
import { useLanguage } from "@/components/LanguageProvider";
import AuthGuard from "@/components/AuthGuard";

export default function SignupPage() {
  return (
    <AuthGuard mode="guest">
      <SignupForm />
    </AuthGuard>
  );
}

function SignupForm() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(
        lang === "hi" ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match.",
      );
      return;
    }

    if (password.length < 6) {
      setError(
        lang === "hi"
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters long.",
      );
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.signup({
        email,
        password,
        full_name: fullName,
      });
      setAuthToken(res.access_token);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(180deg, #A94F3B 0%, #C9785E 50%, #F5C2AD 100%)",
      }}
    >
      {/* One soft, slow-moving glow — subtle, not distracting */}
      <motion.div
        className="absolute -top-40 -left-20 w-md h-md rounded-full blur-3xl opacity-40"
        style={{
          background: "radial-gradient(circle, #f28768 0%, transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06, delayChildren: 0.1 },
          },
        }}
      >
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-8"
          variants={{
            hidden: { opacity: 0, y: -12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" },
            },
          }}
        >
          <h1 className="text-[28px] font-bold text-white tracking-tight text-center">
            {lang === "hi" ? "नया खाता बनाएँ" : "Join SwarSaarthi"}
          </h1>
          <p className="text-sm text-white mt-1.5 text-center">
            {lang === "hi"
              ? "हिंदी उच्चारण सुधारने की अपनी यात्रा शुरू करें"
              : "Start your journey to fluent Hindi speech mastery"}
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-red-500/80 border border-red-400/30 text-red-50 text-sm flex items-center gap-2.5"
          >
            <svg
              className="w-4.5 h-4.5 shrink-0 text-red-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "पूरा नाम" : "Full Name"}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Raj Sharma"
              className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/95 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all text-sm"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "ईमेल पता" : "Email Address"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/95 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all text-sm"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "पासवर्ड" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/95 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
              {lang === "hi" ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/95 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all text-sm"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #c83f16, #a43908)",
              boxShadow: "0 6px 20px rgba(242, 135, 104, 0.35)",
            }}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>{lang === "hi" ? "खाता बनाएँ" : "Create Account"}</span>
            )}
          </motion.button>
        </form>

        <motion.div
          className="mt-7 text-center"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.4 } },
          }}
        >
          <p className="text-sm text-zinc-700">
            {lang === "hi" ? "पहले से खाता है?" : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="font-semibold text-white hover:text-[#a43908] hover:underline transition-all"
            >
              {lang === "hi" ? "साइन इन करें" : "Sign In"}
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
