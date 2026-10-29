"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import {
  resolveRibbonConfig,
  type RibbonApertureColors, type RibbonApertureConfig,
} from "@/lib/aperture";
import { cardSwirlPaths } from "@/lib/card-swirl";

export type RibbonApertureProps = {
  progress: MotionValue<number>;
  config?: Partial<RibbonApertureConfig> & { colors?: Partial<RibbonApertureColors> };
};

function CardBand({ index, progress, config }: {
  index: number; progress: MotionValue<number>; config: RibbonApertureConfig;
}) {
  const face = useRef<SVGPathElement>(null);
  const blue = useRef<SVGPathElement>(null);
  const initial = useMemo(() => cardSwirlPaths(index, 0, config), [index, config]);
  useMotionValueEvent(progress, "change", value => {
    const paths = cardSwirlPaths(index, value, config);
    face.current?.setAttribute("d", paths.face);
    blue.current?.setAttribute("d", paths.blue);
  });

  return <g className="aperture-blade card-band">
    <path ref={face} d={initial.face} fill={`url(#card-navy-${index})`} />
    <path ref={blue} d={initial.blue} fill={`url(#card-blue-${index})`} />
  </g>;
}

export function RibbonAperture({ progress, config: overrides }: RibbonApertureProps) {
  const config = useMemo(() => resolveRibbonConfig(overrides), [overrides]);
  const { colors } = config;

  return <svg className="camera-aperture card-swirl" viewBox="-1000 -1100 2000 2200" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      {[0, 1, 2].map(index => <linearGradient key={`blue-${index}`} id={`card-blue-${index}`} x1="-1100" y1="-900" x2="1000" y2="1100" gradientUnits="userSpaceOnUse" gradientTransform={`rotate(${index * 120})`}>
        <stop stopColor={colors.brightLight} /><stop offset=".5" stopColor={colors.brightMid} /><stop offset="1" stopColor={colors.brightDeep} />
      </linearGradient>)}
      {[0, 1, 2].map(index => <linearGradient key={`navy-${index}`} id={`card-navy-${index}`} x1="-900" y1="-700" x2="900" y2="900" gradientUnits="userSpaceOnUse" gradientTransform={`rotate(${index * 120})`}>
        <stop stopColor={colors.navyDark} /><stop offset=".6" stopColor={colors.navyMid} /><stop offset="1" stopColor={colors.navyLight} />
      </linearGradient>)}
    </defs>
    {[0, 1, 2].map(index => <CardBand key={index} index={index} progress={progress} config={config} />)}
  </svg>;
}
