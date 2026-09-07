"use client";

import { usePathname } from "next/navigation";

/**
 * PageTransition — lightweight, natural route change.
 *
 * Why not Framer Motion / View Transitions API?
 * - No extra JS (0kb runtime)
 * - GPU-only props (opacity + translateY) — no layout thrash
 * - 180ms ease-out feels hand-timed, not AI-smooth spring
 * - `key` on pathname forces a fresh animation per route without
 *   remounting layout (Navbar/Footer stay mounted).
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in will-change-[opacity,transform]">
      {children}
    </div>
  );
}
