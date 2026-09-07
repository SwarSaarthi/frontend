/**
 * SwarSaarthi — Custom Cursor Follower & Mouse Spotlight
 *
 * Adds a soft, organic cursor follower dot and warm background spotlight
 * that smoothly glides with user mouse movements, giving the website a tactile,
 * alive, and human touch feeling.
 */

"use client";

import { useEffect, useState } from "react";

export default function CursorFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = Boolean(
        target.closest('a, button, input, [role="button"], .interactive')
      );
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Background warm spotlight following mouse */}
      <div
        className="pointer-events-none fixed z-0 transition-opacity duration-500 hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "450px",
          height: "450px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(254, 215, 170, 0.25) 0%, rgba(255, 237, 213, 0.1) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Main cursor follower ring */}
      <div
        className="pointer-events-none fixed z-50 rounded-full transition-transform duration-100 ease-out hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isPointer ? "36px" : "20px",
          height: isPointer ? "36px" : "20px",
          transform: "translate(-50%, -50%)",
          backgroundColor: isPointer ? "rgba(198, 93, 62, 0.15)" : "rgba(198, 93, 62, 0.3)",
          border: isPointer ? "2px solid #C65D3E" : "1px solid rgba(198, 93, 62, 0.4)",
          boxShadow: isPointer ? "0 0 12px rgba(198, 93, 62, 0.3)" : "none",
        }}
      />

      {/* Inner tiny cursor dot */}
      <div
        className="pointer-events-none fixed z-50 rounded-full bg-primary transition-transform duration-75 hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isPointer ? "8px" : "6px",
          height: isPointer ? "8px" : "6px",
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
