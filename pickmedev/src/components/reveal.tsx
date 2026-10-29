"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false} whileInView={reduced ? undefined : { y: [16, 0], opacity: [.65, 1] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .6, ease: [.2, .7, .2, 1] }}>{children}</motion.div>;
}
