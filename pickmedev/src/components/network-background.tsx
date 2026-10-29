"use client";

import { useEffect, useRef } from "react";
import { REVEAL_EVENT } from "@/lib/experience";

export function NetworkBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDraw = 0;
    let nodes: { x: number; y: number; phase: number }[] = [];

    function draw(time: number) {
      const ctx = context!;
      ctx.clearRect(0, 0, width, height);
      const positions = nodes.map(node => ({
        x: node.x * width + Math.sin(time * .00019 + node.phase) * 22,
        y: node.y * height + Math.cos(time * .00014 + node.phase) * 19,
      }));
      const reach = Math.max(160, Math.min(245, width * .2));
      positions.forEach((point, i) => {
        for (let j = i + 1; j < positions.length; j++) {
          const other = positions[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance >= reach) continue;
          const opacity = (1 - distance / reach) * .5;
          ctx.strokeStyle = `rgba(37, 113, 218, ${opacity})`;
          ctx.lineWidth = .85;
          ctx.beginPath(); ctx.moveTo(point.x, point.y); ctx.lineTo(other.x, other.y); ctx.stroke();
          if ((i + j) % 8 === 0) {
            const progress = (time * .00011 + i * .17) % 1;
            ctx.fillStyle = `rgba(8, 117, 249, ${opacity + .15})`;
            ctx.beginPath(); ctx.arc(point.x + (other.x - point.x) * progress, point.y + (other.y - point.y) * progress, 1.6, 0, Math.PI * 2); ctx.fill();
          }
        }
        ctx.fillStyle = i % 5 === 0 ? "rgba(8,117,249,.65)" : "rgba(46,113,209,.3)";
        ctx.beginPath(); ctx.arc(point.x, point.y, i % 5 === 0 ? 2.7 : 1.8, 0, Math.PI * 2); ctx.fill();
        if (i % 5 === 0) {
          ctx.strokeStyle = "rgba(8,117,249,.1)";
          ctx.beginPath(); ctx.arc(point.x, point.y, 7, 0, Math.PI * 2); ctx.stroke();
        }
      });
    }

    function tick(time: number) {
      if (time - lastDraw >= 32) { draw(time); lastDraw = time; }
      frame = requestAnimationFrame(tick);
    }

    function restart() {
      cancelAnimationFrame(frame);
      if (preference.matches || document.hidden || document.documentElement.dataset.introState === "playing") { draw(0); return; }
      frame = requestAnimationFrame(tick);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      element!.width = Math.round(width * dpr);
      element!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = width < 600 ? 4 : 8;
      nodes = Array.from({ length: columns * 7 }, (_, i) => ({
        x: ((i % columns) + .2 + Math.sin(i * 3.7) * .25) / (columns - .5),
        y: (Math.floor(i / columns) + .2 + Math.cos(i * 2.3) * .26) / 6.5,
        phase: i * 2.399,
      }));
      draw(0);
      restart();
    }

    resize();
    element.parentElement?.classList.add("is-ready");
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", restart);
    document.addEventListener(REVEAL_EVENT, restart);
    preference.addEventListener("change", restart);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", restart);
      document.removeEventListener(REVEAL_EVENT, restart);
      preference.removeEventListener("change", restart);
      element.parentElement?.classList.remove("is-ready");
    };
  }, []);

  return <div className="network-background" aria-hidden="true">
    <svg className="network-skeleton" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none">
      <path d="M0 170 145 105 280 215 160 380 0 300M145 105 210 0M280 215 430 70 500 0M160 380 255 600 0 720M255 600 170 820 330 1000M170 820 0 860M1600 110 1460 195 1320 70 1220 0M1460 195 1380 390 1600 505M1380 390 1500 630 1600 590M1500 630 1325 790 1470 1000M1325 790 1130 1000M1500 630 1600 860" stroke="#3d85de" strokeOpacity=".23" />
      {[[145,105],[280,215],[160,380],[255,600],[170,820],[1460,195],[1380,390],[1500,630],[1325,790]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#1877ed" opacity=".3" />)}
    </svg>
    <canvas ref={canvas} />
  </div>;
}
