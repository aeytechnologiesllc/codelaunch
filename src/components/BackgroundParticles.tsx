"use client";

import { useEffect, useRef } from "react";

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Particles — small dots drifting upward
    const particles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      drift: number;
      pulse: number;
      pulseSpeed: number;
    }[] = [];

    const count = 50;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        size: 0.8 + Math.random() * 1.5,
        speed: 0.15 + Math.random() * 0.35,
        opacity: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.3 + Math.random() * 0.8,
      });
    }

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift + Math.sin(time * 0.5 + p.pulse) * 0.15;
        p.pulse += p.pulseSpeed * 0.016;

        // Reset when off top
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        // Wrap horizontally
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pulseOpacity = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `rgba(167, 139, 250, ${pulseOpacity * 0.4})`);
        glow.addColorStop(1, "rgba(167, 139, 250, 0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${pulseOpacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 6 }}
      aria-hidden="true"
    />
  );
}
