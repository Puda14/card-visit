import { DEFAULT_RIBBON_APERTURE_CONFIG, type RibbonApertureConfig, spinPhaseRatio } from "./aperture";

const ease = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

export function cardSwirlState(progress: number, config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG) {
  const split = Math.max(0.001, Math.min(0.999, spinPhaseRatio(config)));
  const inward = progress <= split;
  const t = ease(inward ? progress / split : (progress - split) / (1 - split));
  const reveal = (progress - split) / (1 - split);
  return {
    veilOpacity: 1 - ease(reveal / 0.85),
    emblemOpacity: 1 - ease(reveal / 0.23),
    gap: inward ? config.initialApertureRadius + (55 - config.initialApertureRadius) * t : 55 + (1800 - 55) * t,
    twist: inward ? 1.35 + 3.4 * t : 4.75 - 4 * t,
    rotation: inward ? 0.8 * t : 0.8 - 1.85 * t,
  };
}

/** Three pointed bands sweep in from beyond the viewport. Geometry curls, not the page. */
export function cardSwirlPaths(index: number, progress: number, config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG) {
  const { gap, twist, rotation } = cardSwirlState(progress, config);
  const outer = 4200;
  const point = (radius: number, across: number) => {
    const distance = radius - gap;
    const width = 1.93 * (1 - Math.exp(-distance / 330)) ** 2;
    const angle = -2 + index * Math.PI * 2 / 3 + rotation
      + twist * Math.exp(-distance / 1050) + (across - 0.5) * width;
    return `${(radius * Math.cos(angle)).toFixed(2)} ${(radius * Math.sin(angle)).toFixed(2)}`;
  };
  const band = (start: number, end: number) => {
    const points: string[] = [];
    // Quadratic sampling keeps the tightly curled tips smooth at small radii.
    for (let i = 0; i <= 100; i++) points.push(point(gap + (outer - gap) * (i / 100) ** 2, start));
    for (let i = 100; i >= 0; i--) points.push(point(gap + (outer - gap) * (i / 100) ** 2, end));
    return `M${points.join("L")}Z`;
  };
  return { face: band(0, 1), blue: band(0, 0.43) };
}
