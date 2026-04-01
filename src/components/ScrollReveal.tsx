"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimationType = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleIn" | "clipReveal";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: AnimationType;
  duration?: number;
}

const getFromVars = (animation: AnimationType): gsap.TweenVars => {
  switch (animation) {
    case "fadeUp":
      return { opacity: 0, y: 50 };
    case "fadeIn":
      return { opacity: 0 };
    case "slideLeft":
      return { opacity: 0, x: -60 };
    case "slideRight":
      return { opacity: 0, x: 60 };
    case "scaleIn":
      return { opacity: 0, scale: 0.85 };
    case "clipReveal":
      return { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" };
    default:
      return { opacity: 0, y: 50 };
  }
};

const getToVars = (animation: AnimationType): gsap.TweenVars => {
  switch (animation) {
    case "fadeUp":
      return { opacity: 1, y: 0 };
    case "fadeIn":
      return { opacity: 1 };
    case "slideLeft":
      return { opacity: 1, x: 0 };
    case "slideRight":
      return { opacity: 1, x: 0 };
    case "scaleIn":
      return { opacity: 1, scale: 1 };
    case "clipReveal":
      return { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" };
    default:
      return { opacity: 1, y: 0 };
  }
};

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  animation = "fadeUp",
  duration = 0.8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = getFromVars(animation);
    const toVars = getToVars(animation);

    // Set initial state
    gsap.set(el, fromVars);

    // Create the animation with ScrollTrigger
    const tween = gsap.to(el, {
      ...toVars,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      tween.kill();
      // Kill associated ScrollTrigger
      const st = tween.scrollTrigger;
      if (st) st.kill();
    };
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
