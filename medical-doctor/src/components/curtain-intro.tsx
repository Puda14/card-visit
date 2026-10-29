"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { MedicalCross } from "./medical-mark";
import { CURTAIN_KEY } from "@/lib/curtain";

export function CurtainIntro({ slogan, skipLabel, welcome }: { slogan: string; skipLabel: string; welcome: string }) {
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const skip = useRef<HTMLButtonElement>(null);
  const release = useRef<(() => void) | null>(null);
  const done = useRef(false);
  function finish() {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem(CURTAIN_KEY, "1"); } catch { /* Optional storage. */ }
    release.current?.();
    document.documentElement.dataset.curtainSkip = "1";
    setVisible(false);
  }
  useEffect(() => {
    done.current = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = document.documentElement.dataset.curtainSkip === "1";
    try { seen ||= Boolean(sessionStorage.getItem(CURTAIN_KEY)); } catch { /* Optional storage. */ }
    if (seen || preference.matches) { setVisible(false); return; }
    const content = document.getElementById("site-content");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    setPlaying(true);
    const timeout = window.setTimeout(finish, 3100);
    const onPreference = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", onPreference);
    let released = false;
    const cleanup = () => {
      if (released) return;
      released = true;
      window.clearTimeout(timeout);
      preference.removeEventListener("change", onPreference);
      if (content) content.inert = false;
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
    release.current = cleanup;
    return cleanup;
  }, []);
  if (!visible) return null;
  return <div className="curtain-intro" data-testid="curtain-intro" role="dialog" aria-modal="true" aria-label={welcome} onKeyDown={event => {
    if (event.key === "Escape") finish();
    if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
  }}>
    <motion.div className="curtain-panel curtain-left" initial={false} animate={{ x: playing ? "-101%" : "0%" }} transition={{ delay: 0.95, duration: 1.65, ease: [0.76, 0, 0.24, 1] }} />
    <motion.div className="curtain-panel curtain-right" initial={false} animate={{ x: playing ? "101%" : "0%" }} transition={{ delay: 0.95, duration: 1.65, ease: [0.76, 0, 0.24, 1] }} onAnimationComplete={() => { if (playing) finish(); }} />
    <motion.div className="curtain-emblem" initial={false} animate={{ opacity: playing ? 0 : 1 }} transition={{ delay: 0.78, duration: 0.45 }}>
      <MedicalCross /><p>{slogan}</p>
    </motion.div>
    <button ref={skip} className="curtain-skip" onClick={finish}>{skipLabel}<ArrowRight size={15} aria-hidden="true" /></button>
  </div>;
}
