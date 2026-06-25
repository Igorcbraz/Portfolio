"use client";
import { useEffect, useRef, useState } from "react";
import { GitHubRepo } from "./types";

interface OrbitRepo {
  name: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

const PERSPECTIVE = 1.0;
const PRI = { r: 0, g: 210, b: 65 };
const pri = (a: number) => `rgba(${PRI.r},${PRI.g},${PRI.b},${a})`;

export function RepoOrbitPanel({
  repos,
  inView,
}: {
  repos: GitHubRepo[];
  inView: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const angleRef = useRef<number[]>([]);
  const scanRef = useRef(0);
  const [hovered, setHovered] = useState<OrbitRepo | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const hoveredIdxRef = useRef<number>(-1);

  const topRepos: OrbitRepo[] = repos
    .filter((r) => r.stars >= 0)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)
    .map((r) => ({
      name: r.name,
      stars: r.stars,
      forks: r.forks,
      language: r.language,
      url: r.url,
    }));

  const maxStars = Math.max(...topRepos.map((r) => r.stars), 1);

  const getRingR = (index: number, width: number, height: number) => {
    const radarR = Math.min(width, height) * 0.456;
    const minR = radarR * 0.25;
    const maxR = radarR * 0.9;
    return minR + (index / 4) * (maxR - minR);
  };

  const SPEEDS = [0.007, 0.005, 0.0035, 0.0026, 0.0018];

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (angleRef.current.length === 0) {
      angleRef.current = topRepos.map(
        (_, i) =>
          (i / topRepos.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
      );
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const cx = W / 2;
    const cy = H / 2;

    function toXY(angle: number, r: number) {
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle) * PERSPECTIVE,
      };
    }

    function drawRing(r: number, alpha: number, dash?: [number, number]) {
      const c = ctx!;
      c.save();
      c.translate(cx, cy);
      c.scale(1, PERSPECTIVE);
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.restore();
      c.strokeStyle = pri(alpha);
      c.lineWidth = 0.5;
      if (dash) c.setLineDash(dash);
      c.stroke();
      c.setLineDash([]);
    }

    function drawRingTicks(r: number, alpha: number) {
      const c = ctx!;
      const tickAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      tickAngles.forEach((a) => {
        const inner = toXY(a, r - 4);
        const outer = toXY(a, r + 4);
        c.beginPath();
        c.moveTo(inner.x, inner.y);
        c.lineTo(outer.x, outer.y);
        c.strokeStyle = pri(alpha * 1.5);
        c.lineWidth = 0.5;
        c.stroke();
      });
    }

    function draw(t: number) {
      if (!ctx) return;

      ctx.fillStyle = "rgba(0,6,0,0.82)";
      ctx.fillRect(0, 0, W, H);

      const radarR = Math.min(W, H) * 0.456;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
      ctx.clip();

      const dotSpacing = 26;
      ctx.fillStyle = pri(0.05);
      for (let gx = cx % dotSpacing; gx < W; gx += dotSpacing) {
        for (let gy = cy % dotSpacing; gy < H; gy += dotSpacing) {
          const dx = gx - cx,
            dy = gy - cy;
          if (dx * dx + dy * dy < radarR * radarR) {
            ctx.beginPath();
            ctx.arc(gx, gy, 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const axisLen = radarR + 10;
      ctx.save();
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = pri(0.1);
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx - axisLen, cy);
      ctx.lineTo(cx + axisLen, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - axisLen);
      ctx.lineTo(cx, cy + axisLen);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      topRepos.forEach((_, i) => {
        const r = getRingR(i, W, H);
        const alpha = 0.12 + (i / topRepos.length) * 0.06;
        drawRing(r, alpha, [2, 5]);
        if (i % 2 === 0) drawRingTicks(r, alpha * 0.9);
      });

      const outerR = radarR - 4;
      for (let deg = 0; deg < 360; deg += 30) {
        const rad = (deg * Math.PI) / 180;
        const isMajor = deg % 90 === 0;
        const tickIn = toXY(rad, outerR - (isMajor ? 8 : 5));
        const tickOut = toXY(rad, outerR + 1);
        ctx.beginPath();
        ctx.moveTo(tickIn.x, tickIn.y);
        ctx.lineTo(tickOut.x, tickOut.y);
        ctx.strokeStyle = pri(isMajor ? 0.35 : 0.18);
        ctx.lineWidth = isMajor ? 0.8 : 0.5;
        ctx.stroke();
        if (isMajor) {
          const lPos = toXY(rad, outerR + 10);
          ctx.font = "8px ui-monospace, monospace";
          ctx.fillStyle = pri(0.3);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(deg), lPos.x, lPos.y);
        }
      }
      ctx.textBaseline = "alphabetic";

      const SWEEP_SPEED = 0.015;
      scanRef.current = (scanRef.current + SWEEP_SPEED) % (Math.PI * 2);
      const sa = scanRef.current;
      const maxR = radarR;

      const coneLen = Math.PI / 3;
      for (let si = 0; si < 36; si++) {
        const sAngle = sa - (si / 36) * coneLen;
        const ex = cx + maxR * Math.cos(sAngle);
        const ey = cy + maxR * Math.sin(sAngle) * PERSPECTIVE;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = pri((1 - si / 36) * 0.28);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + maxR * Math.cos(sa),
        cy + maxR * Math.sin(sa) * PERSPECTIVE,
      );
      ctx.strokeStyle = pri(0.85);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
      ctx.strokeStyle = pri(0.25);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, radarR - 2, 0, Math.PI * 2);
      ctx.strokeStyle = pri(0.1);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.arc(cx, cy, radarR, 0, Math.PI * 2, true);
      ctx.fillStyle = "rgb(0,4,0)";
      ctx.fill();
      ctx.restore();

      const pulse = 0.9 + 0.1 * Math.sin(t * 0.0018);

      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32 * pulse);
      halo.addColorStop(0, pri(0.5));
      halo.addColorStop(0.5, pri(0.12));
      halo.addColorStop(1, pri(0.0));
      ctx.beginPath();
      ctx.arc(cx, cy, 32 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = pri(1);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.strokeStyle = pri(0.55);
      ctx.lineWidth = 0.75;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.strokeStyle = pri(0.2);
      ctx.lineWidth = 0.5;
      ctx.stroke();

      topRepos.forEach((repo, i) => {
        const r = getRingR(i, W, H);
        angleRef.current[i] = (angleRef.current[i] + SPEEDS[i]) % (Math.PI * 2);
        const angle = angleRef.current[i];
        const { x: px, y: py } = toXY(angle, r);

        let diff = sa - angle;
        while (diff < 0) diff += Math.PI * 2;
        while (diff > Math.PI * 2) diff -= Math.PI * 2;

        const visibility = Math.max(0, 1 - diff / (Math.PI * 1.5));

        const isHov = hoveredIdxRef.current === i;
        const activeVis = isHov ? 1 : visibility;

        const nodeR = 2.5 + (repo.stars / maxStars) * 4.5;

        if (activeVis > 0) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.PI / 4);

          const glowR = nodeR * 3;
          const glw = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
          glw.addColorStop(0, pri(activeVis * 0.8));
          glw.addColorStop(1, pri(0));
          ctx.beginPath();
          ctx.arc(0, 0, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glw;
          ctx.fill();

          ctx.beginPath();
          ctx.rect(-nodeR, -nodeR, nodeR * 2, nodeR * 2);
          ctx.fillStyle = pri(activeVis);
          ctx.fill();
          ctx.strokeStyle = pri(activeVis > 0.5 ? 1 : activeVis * 1.5);
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }

        if (isHov) {
          const ret = nodeR + 5;
          ctx.strokeStyle = pri(0.85);
          ctx.lineWidth = 0.75;
          ctx.setLineDash([2, 3]);
          const bSize = 5;
          [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].forEach(([sx, sy]) => {
            ctx.beginPath();
            ctx.moveTo(px + sx * ret, py + sy * ret * PERSPECTIVE);
            ctx.lineTo(px + sx * (ret + bSize), py + sy * ret * PERSPECTIVE);
            ctx.moveTo(px + sx * ret, py + sy * ret * PERSPECTIVE);
            ctx.lineTo(px + sx * ret, py + sy * (ret + bSize) * PERSPECTIVE);
            ctx.stroke();
          });
          ctx.setLineDash([]);

          const calloutDir = px > cx ? 1 : -1;
          const lineEndX = px + calloutDir * (nodeR + 20);
          const lineEndX2 = px + calloutDir * (nodeR + 50);
          ctx.beginPath();
          ctx.moveTo(px + calloutDir * (nodeR + 2), py);
          ctx.lineTo(lineEndX, py);
          ctx.lineTo(lineEndX2, py - 14);
          ctx.strokeStyle = pri(0.55);
          ctx.lineWidth = 0.75;
          ctx.stroke();

          ctx.font = "600 9px ui-monospace, monospace";
          ctx.fillStyle = pri(0.55);
          ctx.textAlign = calloutDir > 0 ? "left" : "right";
          const tagX = lineEndX2 + calloutDir * 4;
          ctx.fillText(`★ ${repo.stars}`, tagX, py - 18);
          ctx.font = "9px ui-monospace, monospace";
          ctx.fillText(repo.language.toUpperCase(), tagX, py - 7);
        }

        if (i < 2) {
          ctx.save();
          ctx.font = "9px ui-monospace, monospace";
          ctx.fillStyle = pri(0.45 * activeVis);
          ctx.textAlign = px > cx ? "left" : "right";
          const labelX = px > cx ? px + nodeR + 5 : px - nodeR - 5;
          ctx.fillText(
            repo.name.length > 14 ? repo.name.slice(0, 13) + "…" : repo.name,
            labelX,
            py + 3,
          );
          ctx.restore();
        }
      });

      rafRef.current = requestAnimationFrame((ts) => draw(ts));
    }

    rafRef.current = requestAnimationFrame((ts) => draw(ts));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, topRepos.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cxv = rect.width / 2;
    const cyv = rect.height / 2;

    let found: OrbitRepo | null = null;
    let foundIdx = -1;
    topRepos.forEach((repo, i) => {
      const angle = angleRef.current[i] ?? 0;
      const r = getRingR(i, rect.width, rect.height);
      const px = cxv + r * Math.cos(angle);
      const py = cyv + r * Math.sin(angle) * PERSPECTIVE;
      const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (dist < 16) {
        found = repo;
        foundIdx = i;
      }
    });
    hoveredIdxRef.current = foundIdx;
    setHovered(found);
    setHoverPos({ x: mx, y: my });
  };

  return (
    <div className="relative bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30 bg-[oklch(0.10_0_0/0.50)] shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.55_0.18_25/0.55)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.70_0.18_90/0.55)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0_0/0.35)]" />
        </div>
        <span className="text-[11px] font-mono text-[rgba(0,210,65,0.55)]">
          radar.scan
        </span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-[pulse_2s_ease-in-out_infinite] bg-[rgb(0,210,65)] shadow-[0_0_5px_1px_rgba(0,210,65,0.7)]" />
            <span className="text-[10px] font-mono text-[rgba(0,210,65,0.75)]">
              SCAN
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/40">
            {topRepos.length} nodes
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[340px] bg-[rgb(0,4,0)]">
        {inView ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair cursor-target min-h-[340px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              hoveredIdxRef.current = -1;
              setHovered(null);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[340px]">
            <div className="w-8 h-8 rounded-full border border-[rgb(0,210,65/0.30)] border-t-[rgb(0,210,65)] animate-spin" />
          </div>
        )}

        {hovered && (
          <div
            className="absolute pointer-events-none z-30 px-3 py-2.5 bg-[rgb(0,6,0)] border border-[rgba(0,210,65,0.35)] rounded backdrop-blur-xl text-[11px] font-mono shadow-2xl"
            style={{
              left: hoverPos.x > 260 ? hoverPos.x - 140 : hoverPos.x + 16,
              top: hoverPos.y - 36,
            }}
          >
            <p className="font-bold text-xs text-[rgb(180,255,190)]">
              {hovered.name}
            </p>
            <div className="mt-1.5 space-y-0.5 text-[rgba(0,180,55,0.70)]">
              <p>
                stars{" "}
                <span className="text-[rgb(0,210,65)] ml-1">
                  {hovered.stars}
                </span>
              </p>
              <p>
                forks{" "}
                <span className="text-[rgba(180,255,190,0.80)] ml-1">
                  {hovered.forks}
                </span>
              </p>
              <p>
                lang{" "}
                <span className="text-[rgba(180,255,190,0.80)] ml-1">
                  {hovered.language}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2 pointer-events-none opacity-40">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M0 6V0h6" stroke="rgb(0,210,65)" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 pointer-events-none opacity-40">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M16 6V0h-6" stroke="rgb(0,210,65)" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-8 left-2 pointer-events-none opacity-40">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M0 10v6h6" stroke="rgb(0,210,65)" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-8 right-2 pointer-events-none opacity-40">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M16 10v6h-6" stroke="rgb(0,210,65)" strokeWidth="1" />
          </svg>
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center pointer-events-none">
          <p className="text-[9px] font-mono uppercase tracking-widest text-[rgba(0,210,65,0.30)]">
            size ∝ stars · hover to inspect
          </p>
        </div>
      </div>
    </div>
  );
}