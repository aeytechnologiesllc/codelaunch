"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  orbitSpeed: number;
  wobble: number;
  wobbleSpeed: number;
}

export function MobileHeroCanvas() {
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
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Center of the orb
    const cx = () => w / 2;
    const cy = () => h * 0.42;

    // Create orbiting particles
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const ring = Math.random();
      const radius = 60 + ring * 120;
      particles.push({
        x: 0,
        y: 0,
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1),
        size: 1 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.6,
        orbitSpeed: 0.3 + Math.random() * 0.7,
        wobble: Math.random() * 15,
        wobbleSpeed: 0.5 + Math.random() * 2,
      });
    }

    // Floating ambient particles (background)
    const ambientParticles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      ambientParticles.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.4,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.3,
      });
    }

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const centerX = cx();
      const centerY = cy();

      // === Outer glow ===
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 160);
      outerGlow.addColorStop(0, "rgba(124, 58, 237, 0.08)");
      outerGlow.addColorStop(0.5, "rgba(167, 139, 250, 0.04)");
      outerGlow.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, w, h);

      // === Central orb ===
      const pulse = 1 + Math.sin(time * 1.2) * 0.06;
      const orbRadius = 55 * pulse;

      // Orb outer glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, orbRadius * 0.5, centerX, centerY, orbRadius * 2.2);
      glowGrad.addColorStop(0, "rgba(167, 139, 250, 0.15)");
      glowGrad.addColorStop(0.4, "rgba(129, 140, 248, 0.08)");
      glowGrad.addColorStop(1, "rgba(129, 140, 248, 0)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Orb body
      const orbGrad = ctx.createRadialGradient(
        centerX - orbRadius * 0.25,
        centerY - orbRadius * 0.25,
        0,
        centerX,
        centerY,
        orbRadius
      );
      orbGrad.addColorStop(0, "rgba(196, 181, 253, 0.2)");
      orbGrad.addColorStop(0.5, "rgba(167, 139, 250, 0.12)");
      orbGrad.addColorStop(1, "rgba(124, 58, 237, 0.06)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.fillStyle = orbGrad;
      ctx.fill();

      // Orb border
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 + Math.sin(time * 1.5) * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // === Orbit rings ===
      const drawOrbitRing = (radius: number, opacity: number, dashOffset: number) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 8]);
        ctx.lineDashOffset = dashOffset;
        ctx.stroke();
        ctx.setLineDash([]);
      };

      drawOrbitRing(90, 0.15, time * 15);
      drawOrbitRing(130, 0.1, -time * 10);
      drawOrbitRing(175, 0.06, time * 8);

      // === Orbiting particles ===
      particles.forEach((p) => {
        p.angle += p.speed;
        const wobbleOffset = Math.sin(time * p.wobbleSpeed) * p.wobble;
        const r = p.radius + wobbleOffset;
        p.x = centerX + Math.cos(p.angle) * r;
        p.y = centerY + Math.sin(p.angle) * r * 0.7; // Slight ellipse for depth

        // Depth-based opacity (particles "behind" the orb are dimmer)
        const depthFade = 0.5 + Math.sin(p.angle) * 0.5;
        const finalOpacity = p.opacity * depthFade;

        // Glow
        const glowSize = p.size * 4;
        const particleGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        particleGlow.addColorStop(0, `rgba(196, 181, 253, ${finalOpacity * 0.5})`);
        particleGlow.addColorStop(1, "rgba(196, 181, 253, 0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = particleGlow;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${finalOpacity})`;
        ctx.fill();
      });

      // === Connection lines between nearby particles ===
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            const lineOpacity = (1 - dist / 60) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      // === Ambient floating particles ===
      ambientParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        // Reset if off screen
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
      });

      // === Traveling dot on orbit (prominent) ===
      const travelerAngle = time * 0.5;
      const tx = centerX + Math.cos(travelerAngle) * 130;
      const ty = centerY + Math.sin(travelerAngle) * 130 * 0.7;
      const tGlow = ctx.createRadialGradient(tx, ty, 0, tx, ty, 12);
      tGlow.addColorStop(0, "rgba(196, 181, 253, 0.8)");
      tGlow.addColorStop(0.5, "rgba(167, 139, 250, 0.3)");
      tGlow.addColorStop(1, "rgba(167, 139, 250, 0)");
      ctx.beginPath();
      ctx.arc(tx, ty, 12, 0, Math.PI * 2);
      ctx.fillStyle = tGlow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();

      // Second traveler, opposite direction
      const t2Angle = -time * 0.35 + Math.PI;
      const t2x = centerX + Math.cos(t2Angle) * 90;
      const t2y = centerY + Math.sin(t2Angle) * 90 * 0.7;
      const t2Glow = ctx.createRadialGradient(t2x, t2y, 0, t2x, t2y, 8);
      t2Glow.addColorStop(0, "rgba(129, 140, 248, 0.7)");
      t2Glow.addColorStop(1, "rgba(129, 140, 248, 0)");
      ctx.beginPath();
      ctx.arc(t2x, t2y, 8, 0, Math.PI * 2);
      ctx.fillStyle = t2Glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(t2x, t2y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

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
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
