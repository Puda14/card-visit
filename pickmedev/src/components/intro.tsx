"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { revealProfile } from "@/lib/experience";
import {
  APERTURE_SESSION_KEY,
  resolveRibbonConfig,
  type RibbonApertureColors,
  type RibbonApertureConfig,
} from "@/lib/aperture";
import { RibbonAperture } from "@/components/ribbon-aperture";
import { cardSwirlState } from "@/lib/card-swirl";

export function Intro({
  logo,
  company,
  slogan,
  labels,
  apertureConfig,
}: {
  logo: string;
  company: string;
  slogan: string;
  labels: { skip: string; welcome: string; tagline: string };
  apertureConfig?: Partial<RibbonApertureConfig> & { colors?: Partial<RibbonApertureColors> };
}) {
  // The white veil and centered emblem are present in SSR, before hydration.
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const skip = useRef<HTMLButtonElement>(null);
  const release = useRef<(() => void) | null>(null);
  const complete = useRef(false);
  const config = useMemo(() => resolveRibbonConfig(apertureConfig), [apertureConfig]);
  const totalDuration = config.spinDuration + config.openDuration;
  const veilOpacity = useTransform(progress, value => cardSwirlState(value, config).veilOpacity);
  const emblemOpacity = useTransform(progress, value => cardSwirlState(value, config).emblemOpacity);

  const finish = useCallback(() => {
    if (complete.current) return;
    complete.current = true;
    try {
      sessionStorage.setItem(APERTURE_SESSION_KEY, "1");
    } catch {
      /* Storage is optional. */
    }
    release.current?.();
    release.current = null;
    document.documentElement.dataset.apertureSkip = "1";
    setVisible(false);
    revealProfile();
  }, []);

  useEffect(() => {
    complete.current = false;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = document.documentElement.dataset.apertureSkip === "1";
    try {
      seen ||= Boolean(sessionStorage.getItem(APERTURE_SESSION_KEY));
    } catch {
      /* Continue without storage. */
    }
    if (preference.matches || seen) {
      setVisible(false);
      revealProfile();
      return;
    }

    document.documentElement.dataset.introState = "playing";
    progress.set(0);
    const content = document.getElementById("site-content");
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (content) content.inert = true;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });

    const controls = animate(progress, 1, {
      duration: totalDuration,
      ease: "linear",
      onComplete: finish,
    });
    const fallback = window.setTimeout(finish, Math.round((totalDuration + 0.5) * 1000));
    const onPreference = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", onPreference);
    let released = false;
    const cleanup = () => {
      if (released) return;
      released = true;
      controls.stop();
      window.clearTimeout(fallback);
      preference.removeEventListener("change", onPreference);
      if (content) content.inert = false;
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
    release.current = cleanup;
    return () => {
      cleanup();
      release.current = null;
    };
  }, [finish, progress, totalDuration]);

  if (!visible) return null;
  return (
    <div
      className="intro"
      data-testid="intro"
      role="dialog"
      aria-modal="true"
      aria-label={`${labels.welcome} ${company}`}
      onKeyDown={event => {
        if (event.key === "Escape") finish();
        if (event.key === "Tab") {
          event.preventDefault();
          skip.current?.focus();
        }
      }}
    >
      <motion.div className="intro-veil" data-testid="intro-veil" style={{ opacity: veilOpacity }} aria-hidden="true" />
      <RibbonAperture progress={progress} config={apertureConfig} />
      <motion.div className="intro-emblem" data-testid="intro-emblem" style={{ opacity: emblemOpacity }} aria-hidden="true">
        <span className="intro-logo-ring" />
        <img src={logo} alt="" width={76} height={76} />
      </motion.div>
      <motion.div
        className="intro-top"
        style={{ opacity: emblemOpacity }}
      >
        <span title={slogan}>
          {company}
        </span>
        <span className="intro-top-label">{labels.tagline}</span>
      </motion.div>
      <button ref={skip} className="intro-skip" onClick={finish}>
        {labels.skip}
        <ArrowUpRight size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
