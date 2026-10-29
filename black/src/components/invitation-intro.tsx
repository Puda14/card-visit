"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { INVITATION_KEY } from "@/lib/invitation";

export function InvitationIntro({ name, skip, welcome }: { name: string; skip: string; welcome: string }) {
  const initials = name.trim().split(/\s+/).map(part => Array.from(part)[0]).join("").toLocaleUpperCase("vi");
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const skipButton = useRef<HTMLButtonElement>(null);
  const release = useRef<(() => void) | null>(null);
  const complete = useRef(false);
  function finish() {
    if (complete.current) return;
    complete.current = true;
    try { sessionStorage.setItem(INVITATION_KEY, "1"); } catch { /* Optional storage. */ }
    release.current?.(); release.current = null;
    document.documentElement.dataset.invitationSkip = "1";
    setVisible(false);
  }
  useEffect(() => {
    complete.current = false;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = document.documentElement.dataset.invitationSkip === "1";
    try { seen ||= Boolean(sessionStorage.getItem(INVITATION_KEY)); } catch { /* Optional storage. */ }
    if (seen || preference.matches) { setVisible(false); return; }
    const content = document.getElementById("site-content");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skipButton.current?.focus({ preventScroll: true });
    setPlaying(true);
    const fallback = window.setTimeout(finish, 3300);
    const onPreference = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", onPreference);
    let released = false;
    const cleanup = () => {
      if (released) return; released = true;
      clearTimeout(fallback); preference.removeEventListener("change", onPreference);
      if (content) content.inert = false;
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
    release.current = cleanup;
    return cleanup;
  }, []);
  if (!visible) return null;
  const transition = { delay: 1.05, duration: 1.75, ease: [0.76, 0, 0.24, 1] as const };
  return <div className="invitation-intro" data-testid="invitation-intro" role="dialog" aria-modal="true" aria-label={welcome} onKeyDown={event => {
    if (event.key === "Escape") finish();
    if (event.key === "Tab") { event.preventDefault(); skipButton.current?.focus(); }
  }}>
    <motion.div className="invitation-panel invitation-black" initial={false} animate={{ x: playing ? "-101%" : "0%" }} transition={transition}><i /></motion.div>
    <motion.div className="invitation-panel invitation-gold" initial={false} animate={{ x: playing ? "101%" : "0%" }} transition={transition} onAnimationComplete={() => { if (playing) finish(); }}><i /></motion.div>
    <div className="invitation-seal">
      <motion.span initial={false} animate={{ opacity: playing ? 0 : 1, scale: playing ? .9 : 1 }} transition={{ delay: .78, duration: .48 }}>{initials}</motion.span>
    </div>
    <button ref={skipButton} className="invitation-skip" onClick={finish}>{skip}<ArrowRight size={15} aria-hidden="true" /></button>
  </div>;
}
