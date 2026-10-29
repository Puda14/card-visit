"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { REVEAL_EVENT } from "@/lib/experience";

export function PageEntrance() {
  useEffect(() => {
    const root = document.getElementById("site-content");
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = gsap.context(() => {}, root);
    let started = false;
    let frame = 0;
    const play = () => {
      if (started || preference.matches) return;
      started = true;
      context.add(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".profile-panel", { y: 34, scale: .975, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .95, clearProps: "transform,opacity,visibility" })
          .fromTo("[data-enter]", { y: 24, autoAlpha: 0, filter: "blur(6px)" }, {
            y: 0, autoAlpha: 1, filter: "blur(0px)", duration: .8, stagger: .055,
            clearProps: "transform,opacity,visibility,filter",
          }, .12)
          .fromTo(".panel-shine", { xPercent: -160 }, { xPercent: 180, duration: 1.5, ease: "power2.inOut" }, .2);
      });
    };
    const onPreference = () => { if (preference.matches) context.revert(); };
    document.addEventListener(REVEAL_EVENT, play);
    frame = requestAnimationFrame(() => {
      if (document.documentElement.dataset.introState !== "playing") play();
    });
    preference.addEventListener("change", onPreference);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener(REVEAL_EVENT, play);
      preference.removeEventListener("change", onPreference);
      context.revert();
    };
  }, []);
  return null;
}
