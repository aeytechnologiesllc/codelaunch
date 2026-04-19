"use client";

import { useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pass-through wrapper. We used to run Lenis here for a fancy eased
 * smooth-scroll, but that made scrolling feel laggy/artificial — wheel
 * input lerped over 1.2s instead of tracking your fingers.
 *
 * Native browser scroll is what every user expects and what their OS
 * tunes to their hardware. The only thing this component still does is
 * keep GSAP's ScrollTrigger in sync on mount.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Let GSAP ScrollTrigger recalculate against the final layout once
    // everything has mounted. No momentum scroll, no RAF loop.
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, []);

  return <>{children}</>;
}
