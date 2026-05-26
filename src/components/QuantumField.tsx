import { useEffect, useRef } from "react";

type Variant = "rocha" | "aguia" | "serpente" | "tubarao" | "pantera" | "default";

type Props = {
  variant?: Variant | string | null;
  intensity?: number; // 0..1
  interactive?: boolean;
  showGrid?: boolean;
};

type Profile = {
  density: number;       // particles per 1000px²
  speed: number;         // base drift
  pull: number;          // mouse attraction
  jitter: number;        // randomness
  linkDist: number;      // particle linking distance
  hue: number;           // 0..360
  curve: number;         // sinuous flow factor
  lineAlpha: number;
};

const PROFILES: Record<string, Profile> = {
  default:  { density: 0.085, speed: 0.32, pull: 0.050, jitter: 0.018, linkDist: 170, hue: 220, curve: 0.18, lineAlpha: 0.22 },
  rocha:    { density: 0.038, speed: 0.08, pull: 0.020, jitter: 0.006, linkDist: 90,  hue: 200, curve: 0.0,  lineAlpha: 0.14 },
  aguia:    { density: 0.055, speed: 0.32, pull: 0.060, jitter: 0.014, linkDist: 170, hue: 210, curve: 0.05, lineAlpha: 0.10 },
  serpente: { density: 0.060, speed: 0.22, pull: 0.045, jitter: 0.018, linkDist: 150, hue: 170, curve: 0.85, lineAlpha: 0.08 },
  tubarao:  { density: 0.045, speed: 0.40, pull: 0.075, jitter: 0.010, linkDist: 110, hue: 195, curve: 0.0,  lineAlpha: 0.16 },
  pantera:  { density: 0.040, speed: 0.10, pull: 0.030, jitter: 0.008, linkDist: 120, hue: 280, curve: 0.20, lineAlpha: 0.06 },
};


function pickProfile(variant?: string | null): Profile {
  if (!variant) return PROFILES.default;
  const v = variant.toLowerCase();
  for (const k of Object.keys(PROFILES)) {
    if (v.includes(k)) return PROFILES[k];
  }
  return PROFILES.default;
}

export function QuantumField({ variant, intensity = 1, interactive = true, showGrid = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const profileRef = useRef<Profile>(pickProfile(variant));
  const targetProfileRef = useRef<Profile>(pickProfile(variant));

  useEffect(() => {
    targetProfileRef.current = pickProfile(variant);
  }, [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; phase: number }[] = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let pulse = { x: -9999, y: -9999, t: 0, strength: 0 };

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const p = profileRef.current;
      const target = Math.max(40, Math.floor(((width * height) / 1000) * p.density * intensity));
      particles = new Array(target).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * p.speed,
        vy: (Math.random() - 0.5) * p.speed,
        r: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpProfile = (t: number) => {
      const a = profileRef.current, b = targetProfileRef.current;
      profileRef.current = {
        density: lerp(a.density, b.density, t),
        speed: lerp(a.speed, b.speed, t),
        pull: lerp(a.pull, b.pull, t),
        jitter: lerp(a.jitter, b.jitter, t),
        linkDist: lerp(a.linkDist, b.linkDist, t),
        hue: lerp(a.hue, b.hue, t),
        curve: lerp(a.curve, b.curve, t),
        lineAlpha: lerp(a.lineAlpha, b.lineAlpha, t),
      };
    };

    let raf = 0;
    let last = performance.now();
    let time = 0;

    const draw = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      time += dt * 0.001;
      lerpProfile(0.02);
      const p = profileRef.current;

      // Breathing background tint
      const breath = 0.5 + 0.5 * Math.sin(time * 0.35);
      ctx.clearRect(0, 0, width, height);

      // Soft radial mist
      const mistX = width * 0.5 + Math.cos(time * 0.12) * width * 0.1;
      const mistY = height * 0.45 + Math.sin(time * 0.09) * height * 0.1;
      const mist = ctx.createRadialGradient(mistX, mistY, 0, mistX, mistY, Math.max(width, height) * 0.7);
      mist.addColorStop(0, `hsla(${p.hue}, 60%, 55%, ${0.05 + breath * 0.04})`);
      mist.addColorStop(0.5, `hsla(${p.hue}, 50%, 30%, 0.02)`);
      mist.addColorStop(1, "hsla(0, 0%, 0%, 0)");
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, width, height);

      // Grid (deformed)
      if (showGrid) {
        const step = 64;
        const dx = mouse.active ? mouse.x : width / 2;
        const dy = mouse.active ? mouse.y : height / 2;
        ctx.strokeStyle = `hsla(${p.hue}, 30%, 50%, 0.05)`;
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          for (let y = 0; y <= height; y += 8) {
            const distx = x - dx, disty = y - dy;
            const d2 = distx * distx + disty * disty;
            const warp = (mouse.active ? 25 : 6) * Math.exp(-d2 / 60000);
            const ox = x + warp * Math.sin(y * 0.01 + time);
            if (y === 0) ctx.moveTo(ox, y);
            else ctx.lineTo(ox, y);
          }
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 8) {
            const distx = x - dx, disty = y - dy;
            const d2 = distx * distx + disty * disty;
            const warp = (mouse.active ? 25 : 6) * Math.exp(-d2 / 60000);
            const oy = y + warp * Math.cos(x * 0.01 + time);
            if (x === 0) ctx.moveTo(x, oy);
            else ctx.lineTo(x, oy);
          }
          ctx.stroke();
        }
      }

      // Particle physics
      for (const a of particles) {
        // Gentle flow
        a.vx += (Math.random() - 0.5) * p.jitter;
        a.vy += (Math.random() - 0.5) * p.jitter;

        // Sinuous curve flow
        if (p.curve > 0) {
          a.vx += Math.sin(a.y * 0.01 + time * 0.6) * 0.02 * p.curve;
          a.vy += Math.cos(a.x * 0.01 + time * 0.6) * 0.02 * p.curve;
        }

        // Mouse gravity
        if (mouse.active) {
          const dx = mouse.x - a.x;
          const dy = mouse.y - a.y;
          const d2 = dx * dx + dy * dy + 80;
          const f = (p.pull * 600) / d2;
          a.vx += dx * f * 0.0006;
          a.vy += dy * f * 0.0006;
        }

        // Pulse shockwave
        if (pulse.strength > 0.01) {
          const dx = a.x - pulse.x;
          const dy = a.y - pulse.y;
          const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const ringR = pulse.t * 600;
          const proximity = Math.exp(-Math.pow(d - ringR, 2) / 8000);
          a.vx += (dx / d) * proximity * pulse.strength * 1.4;
          a.vy += (dy / d) * proximity * pulse.strength * 1.4;
        }

        // Damping
        a.vx *= 0.96;
        a.vy *= 0.96;

        // Cap velocity
        const sp = Math.hypot(a.vx, a.vy);
        const cap = p.speed * 4;
        if (sp > cap) {
          a.vx = (a.vx / sp) * cap;
          a.vy = (a.vy / sp) * cap;
        }

        a.x += a.vx;
        a.y += a.vy;

        // Wrap
        if (a.x < -10) a.x = width + 10;
        if (a.x > width + 10) a.x = -10;
        if (a.y < -10) a.y = height + 10;
        if (a.y > height + 10) a.y = -10;
      }

      // Links
      const link2 = p.linkDist * p.linkDist;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const alpha = (1 - d2 / link2) * p.lineAlpha;
            ctx.strokeStyle = `hsla(${p.hue}, 55%, 65%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const a of particles) {
        const tw = 0.7 + 0.3 * Math.sin(time * 1.2 + a.phase);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${0.55 * tw})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulse ring overlay
      if (pulse.strength > 0.01) {
        const r = pulse.t * 600;
        ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${pulse.strength * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, r, 0, Math.PI * 2);
        ctx.stroke();
        pulse.t += dt * 0.001;
        pulse.strength *= 0.96;
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pulse.x = e.clientX - rect.left;
      pulse.y = e.clientY - rect.top;
      pulse.t = 0;
      pulse.strength = 1;
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [interactive, intensity, showGrid]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top, transparent 35%, rgba(0,0,0,0.85) 100%)" }}
      />
    </div>
  );
}
