"use client";

import { useEffect, type ReactNode } from "react";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced-motion: skip JS smooth-scroll entirely, use native scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let destroyed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // Keep ScrollTrigger in sync with Lenis and drive Lenis from gsap's ticker.
      lenis.on("scroll", ScrollTrigger.update);
      const ticker = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
