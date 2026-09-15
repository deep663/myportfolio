"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Progressive-enhancement scroll-reveal, replacing the legacy GSAP +
 * ScrollTrigger `.reveal-up`/`.reveal-hero-*` animations (ADR-001).
 *
 * Contract (load-bearing — see ADR-001 Risks table): children are
 * **visible by default**. No opacity-0/hidden class is ever applied before
 * JS runs, so content can never be permanently hidden pending a script
 * that never executes (STORY-1.2 AC Scenario 3) — this is what fixes the
 * legacy `#loader` defect ADR-001 documents, structurally rather than
 * incidentally. `IntersectionObserver` only ever *adds* a finishing
 * fade/slide-in class once available; its absence changes nothing about
 * visibility.
 *
 * @param children - content to reveal
 */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${revealed ? "translate-y-0 opacity-100" : "motion-safe:translate-y-2 motion-safe:opacity-90"}`}
    >
      {children}
    </div>
  );
}
