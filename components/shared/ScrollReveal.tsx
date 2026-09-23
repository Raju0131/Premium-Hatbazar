"use client";

import { useEffect, useRef } from "react";

export function ScrollReveal({
  children,
  className,
  style,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const targets = el.children.length > 0 ? el.children : [el];

      // Reduced-motion: leave content visible, no reveal animation.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 24 });

      const tl = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });

      // Kill only this instance's trigger, not every ScrollTrigger on the page.
      const st = tl.scrollTrigger;
      cleanup = () => {
        st?.kill();
        tl.kill();
      };
    })();

    return () => cleanup?.();
  }, [stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
