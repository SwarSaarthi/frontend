"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/lib/api";

/**
 * AuthGuard — route-protection wrapper.
 *
 * mode="protected"  → page needs a token. Redirect to /login if missing.
 * mode="guest"      → page is for unauthenticated users only (login/signup).
 *                     Redirect to /profile if token exists.
 *
 * While the check is running, a subtle loading skeleton is shown
 * to prevent the underlying page from flashing.
 */

interface AuthGuardProps {
  children: ReactNode;
  mode: "protected" | "guest";
}

export default function AuthGuard({ children, mode }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "allowed" | "redirecting">("loading");

  useEffect(() => {
    const token = getAuthToken();

    if (mode === "protected" && !token) {
      setStatus("redirecting");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (mode === "guest" && token) {
      setStatus("redirecting");
      router.replace("/profile");
    } else {
      setStatus("allowed");
    }
  }, [mode, router, pathname]);

  if (status === "loading" || status === "redirecting") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[2.5px] border-stone-200 border-t-zinc-700 rounded-full animate-spin" />
          <span className="text-xs text-zinc-400 font-medium tracking-wide">
            {status === "redirecting" ? "Redirecting…" : "Verifying…"}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
