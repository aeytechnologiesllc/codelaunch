"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isTouch) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-default-cursor]") || target.tagName === "CANVAS") {
        setIsHidden(true);
        return;
      }

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("[data-magnetic]")
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-default-cursor]") || target.tagName === "CANVAS") {
        setIsHidden(false);
        return;
      }

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("[data-magnetic]")
      ) {
        setIsHovering(false);
      }
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [cursorX, cursorY, isTouch, isVisible]);

  if (isTouch) return null;

  const showCursor = isVisible && !isHidden;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 48 : 8,
            height: isHovering ? 48 : 8,
            opacity: showCursor ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="rounded-full bg-white"
        />
      </motion.div>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 64 : 40,
            height: isHovering ? 64 : 40,
            opacity: showCursor ? (isHovering ? 0.5 : 0.15) : 0,
            borderColor: isHovering
              ? "rgba(167, 139, 250, 0.6)"
              : "rgba(255, 255, 255, 0.3)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-full border-[1.5px]"
        />
      </motion.div>
    </>
  );
}
