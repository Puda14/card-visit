export const APERTURE_RADIUS = 1580;
export const APERTURE_SESSION_KEY = "pickmedev-card-swirl-v4";
export const APERTURE_BOOTSTRAP = `try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('${APERTURE_SESSION_KEY}'))document.documentElement.dataset.apertureSkip='1'}catch{}`;

const INITIAL_GAP = 560;
const PIVOT_DISTANCE = 1020;

export type RibbonApertureColors = {
  brightLight: string;
  brightMid: string;
  brightDeep: string;
  navyDark: string;
  navyMid: string;
  navyLight: string;
  highlight: string;
  backdropInner: string;
  backdropMid: string;
  backdropOuter: string;
};

export type RibbonApertureConfig = {
  colors: RibbonApertureColors;
  /** Duration of the initial clockwise spin phase before expansion (seconds). */
  spinDuration: number;
  /** Duration of the simultaneous clockwise spin + aperture expansion phase (seconds). */
  openDuration: number;
  /** Total clockwise rotation of the interwoven ribbons across the intro (degrees). */
  totalRotationDeg: number;
  /** Initial minimum radius of the central rounded-triangular aperture (SVG viewBox units). */
  initialApertureRadius: number;
  /** Maximum radius of the expanded aperture clearing all viewport corners (SVG viewBox units). */
  maxApertureRadius: number;
  /** Outer radius of the three interwoven ribbons around the center at rest (SVG viewBox units). */
  ribbonOuterRadius: number;
};

export const DEFAULT_RIBBON_APERTURE_CONFIG: RibbonApertureConfig = {
  colors: {
    brightLight: "#009dff",
    brightMid: "#118eff",
    brightDeep: "#0451b5",
    navyDark: "#03142e",
    navyMid: "#072f6b",
    navyLight: "#0b52a8",
    highlight: "#b8ecff",
    backdropInner: "#07285c",
    backdropMid: "#051c42",
    backdropOuter: "#03112b",
  },
  spinDuration: 1.9,
  openDuration: 2.5,
  totalRotationDeg: 36,
  initialApertureRadius: INITIAL_GAP,
  maxApertureRadius: APERTURE_RADIUS,
  ribbonOuterRadius: 365,
};

export type ApertureLeaf = {
  center: { x: number; y: number };
  pivot: { x: number; y: number };
  translation: { x: number; y: number };
  rotation: number;
  matrix: [number, number, number, number, number, number];
};

export type RibbonWeaveLobeState = {
  index: number;
  rotationDeg: number;
  scale: number;
  radialOffset: number;
  matrix: [number, number, number, number, number, number];
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function resolveRibbonConfig(
  overrides?: Partial<RibbonApertureConfig> & { colors?: Partial<RibbonApertureColors> },
): RibbonApertureConfig {
  if (!overrides) return DEFAULT_RIBBON_APERTURE_CONFIG;
  return {
    ...DEFAULT_RIBBON_APERTURE_CONFIG,
    ...overrides,
    colors: {
      ...DEFAULT_RIBBON_APERTURE_CONFIG.colors,
      ...(overrides.colors ?? {}),
    },
  };
}

export function spinPhaseRatio(config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG): number {
  const total = Math.max(0.1, config.spinDuration + config.openDuration);
  return clamp(config.spinDuration / total);
}

export function apertureLeaves(
  progress: number,
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): ApertureLeaf[] {
  const p = clamp(progress);
  const split = spinPhaseRatio(config);
  const setting = smooth(p / split);
  const opening = smooth((p - split) / (1 - split));
  const radius = config.maxApertureRadius;
  const initialGap = config.initialApertureRadius;
  const baseDistance = radius - initialGap;
  const distance = baseDistance * (1 - 0.08 * setting - 0.92 * opening);
  const orientation = ((7 * setting + 11 * opening) * Math.PI) / 180;
  const rotation = config.totalRotationDeg * (0.22 * setting + 0.78 * opening);
  const theta = (rotation * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  return [0, 1, 2].map(index => {
    const angle = ((-90 + index * 120) * Math.PI) / 180;
    const normal = { x: Math.cos(angle), y: Math.sin(angle) };
    const pivot = { x: normal.x * PIVOT_DISTANCE, y: normal.y * PIVOT_DISTANCE };
    const base = { x: -normal.x * baseDistance, y: -normal.y * baseDistance };
    const center = {
      x: -Math.cos(angle + orientation) * distance,
      y: -Math.sin(angle + orientation) * distance,
    };
    const rotatedBase = {
      x: pivot.x + cos * (base.x - pivot.x) - sin * (base.y - pivot.y),
      y: pivot.y + sin * (base.x - pivot.x) + cos * (base.y - pivot.y),
    };
    const translation = { x: center.x - rotatedBase.x, y: center.y - rotatedBase.y };
    return {
      center,
      pivot,
      translation,
      rotation,
      // T(slide) · T(pivot) · R(rotation) · T(-pivot): each leaf has its own hinge.
      matrix: [
        cos,
        sin,
        -sin,
        cos,
        pivot.x - cos * pivot.x + sin * pivot.y + translation.x,
        pivot.y - sin * pivot.x - cos * pivot.y + translation.y,
      ],
    };
  });
}

export function openingRadius(
  progress: number,
  angle: number,
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): number {
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  const radius = config.maxApertureRadius;
  return Math.min(
    ...apertureLeaves(progress, config).map(leaf => {
      const c = leaf.center;
      const projection = c.x * direction.x + c.y * direction.y;
      return projection + Math.sqrt(radius ** 2 - c.x ** 2 - c.y ** 2 + projection ** 2);
    }),
  );
}

/**
 * Exact 3-arc rounded-triangular SVG path for the central transparent aperture mask cutout.
 * Formed by the intersection of the three circular leaf cutouts of radius `maxApertureRadius`.
 */
export function apertureHolePath(
  progress: number,
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): string {
  const p = clamp(progress);
  const split = spinPhaseRatio(config);
  const setting = smooth(p / split);
  const opening = smooth((p - split) / (1 - split));
  const R = config.maxApertureRadius;
  const baseDistance = R - config.initialApertureRadius;
  const d = baseDistance * (1 - 0.08 * setting - 0.92 * opening);
  const orientation = ((7 * setting + 11 * opening) * Math.PI) / 180;
  // The 3 vertices of the rounded triangle lie at angles (-30 + k * 120) deg + orientation
  const vertexRadius = -0.5 * d + Math.sqrt(Math.max(0, R * R - 0.75 * d * d));
  const vertices = [0, 1, 2].map(index => {
    const vertexAngle = ((-30 + index * 120) * Math.PI) / 180 + orientation;
    return {
      x: Number((Math.cos(vertexAngle) * vertexRadius).toFixed(3)),
      y: Number((Math.sin(vertexAngle) * vertexRadius).toFixed(3)),
    };
  });
  const [v0, v1, v2] = vertices;
  const rFixed = R.toFixed(1);
  return `M${v2.x} ${v2.y}A${rFixed} ${rFixed} 0 0 1 ${v0.x} ${v0.y}A${rFixed} ${rFixed} 0 0 1 ${v1.x} ${v1.y}A${rFixed} ${rFixed} 0 0 1 ${v2.x} ${v2.y}Z`;
}

/**
 * Computes C1-continuous clockwise rotation and outward iris expansion for the 3 interwoven ribbons.
 * - Phase 1 (0 .. spinPhaseRatio): smooth clockwise spin around the shared center while aperture stays compact.
 * - Phase 2 (spinPhaseRatio .. 1): continuous clockwise spin + radial expansion clearing all 4 viewport corners.
 */
export function ribbonWeaveStates(
  progress: number,
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): RibbonWeaveLobeState[] {
  const p = clamp(progress);
  const split = spinPhaseRatio(config);
  const setting = smooth(p / split);
  const opening = smooth((p - split) / (1 - split));

  // C1-continuous clockwise rotation across the entire [0, 1] timeline:
  // Blends steady angular velocity with smooth ease-in/out so there is no velocity jump at `split`.
  const spinBlend = 0.38 * p + 0.62 * smooth(p);
  const sharedRotationDeg = config.totalRotationDeg * spinBlend;

  // Radial scale and outward translation of each ribbon lobe so its inner edge hugs the expanding aperture
  // and exits completely beyond the viewport corners (±1000, ±1000) by progress = 1.
  const scale = 1 + 0.03 * setting + 3.45 * opening;
  const radialOffset = 4 * setting + 1360 * (opening * opening * (0.35 + 0.65 * opening));

  return [0, 1, 2].map(index => {
    const lobeAngleDeg = index * 120 + sharedRotationDeg;
    const theta = (lobeAngleDeg * Math.PI) / 180;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    // Outward normal for lobe `index` in world space as it spins clockwise:
    const outwardAngle = theta - Math.PI / 2;
    const tx = Math.cos(outwardAngle) * radialOffset;
    const ty = Math.sin(outwardAngle) * radialOffset;
    return {
      index,
      rotationDeg: lobeAngleDeg,
      scale,
      radialOffset,
      matrix: [scale * cos, scale * sin, -scale * sin, scale * cos, tx, ty],
    };
  });
}

export type RibbonLobeGeometry = {
  /** Dark navy inner/back fold nestled inside the lobe curve for 3D depth. */
  navyFoldPath: string;
  /** Bright blue tail half that tucks underneath the preceding ribbon lobe. */
  brightUnderPath: string;
  /** Bright blue head/crest half that weaves over the succeeding ribbon lobe. */
  brightOverPath: string;
  /** Soft shadow cast onto the underlying ribbon at the over-under crossing. */
  crossingShadowPath: string;
  /** Crisp cyan specular highlight along the inner aperture-hugging edge. */
  innerHighlightPath: string;
};

/**
 * Generates smooth cubic-Bezier SVG paths for a canonical ribbon lobe around (0, 0)
 * inspired by the 3 interwoven curved lobes of the Pick Me Dev logo.
 */
export function createRibbonLobeGeometry(
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): RibbonLobeGeometry {
  const s = config.ribbonOuterRadius / 365;
  const fmt = (n: number) => (n * s).toFixed(2);

  // Dark navy inner/back crescent fold: hugs the central triangular opening and tucks under the bright band
  const navyFoldPath = [
    `M ${fmt(-74)} ${fmt(-42)}`,
    `C ${fmt(-22)} ${fmt(-54)}, ${fmt(34)} ${fmt(-52)}, ${fmt(78)} ${fmt(-32)}`,
    `C ${fmt(126)} ${fmt(-10)}, ${fmt(162)} ${fmt(34)}, ${fmt(172)} ${fmt(88)}`,
    `C ${fmt(132)} ${fmt(52)}, ${fmt(82)} ${fmt(28)}, ${fmt(24)} ${fmt(24)}`,
    `C ${fmt(-42)} ${fmt(20)}, ${fmt(-104)} ${fmt(46)}, ${fmt(-148)} ${fmt(92)}`,
    `C ${fmt(-142)} ${fmt(32)}, ${fmt(-116)} ${fmt(-18)}, ${fmt(-74)} ${fmt(-42)}`,
    "Z",
  ].join(" ");

  // Bright blue under-tail segment (tucks under the previous ribbon's over-head on the left/bottom-left)
  const brightUnderPath = [
    `M ${fmt(-292)} ${fmt(118)}`,
    `C ${fmt(-332)} ${fmt(18)}, ${fmt(-318)} ${fmt(-108)}, ${fmt(-244)} ${fmt(-204)}`,
    `C ${fmt(-176)} ${fmt(-292)}, ${fmt(-62)} ${fmt(-354)}, ${fmt(64)} ${fmt(-358)}`,
    `L ${fmt(42)} ${fmt(-208)}`,
    `C ${fmt(-42)} ${fmt(-206)}, ${fmt(-118)} ${fmt(-164)}, ${fmt(-162)} ${fmt(-96)}`,
    `C ${fmt(-198)} ${fmt(-40)}, ${fmt(-206)} ${fmt(32)}, ${fmt(-182)} ${fmt(96)}`,
    `C ${fmt(-218)} ${fmt(116)}, ${fmt(-258)} ${fmt(124)}, ${fmt(-292)} ${fmt(118)}`,
    "Z",
  ].join(" ");

  // Bright blue over-head segment (continues seamlessly from the crest and weaves OVER the next ribbon's tail,
  // while its inner edge hugs the central rounded-triangular aperture)
  const brightOverPath = [
    `M ${fmt(-48)} ${fmt(-344)}`,
    `C ${fmt(78)} ${fmt(-368)}, ${fmt(214)} ${fmt(-318)}, ${fmt(298)} ${fmt(-212)}`,
    `C ${fmt(368)} ${fmt(-124)}, ${fmt(386)} ${fmt(-4)}, ${fmt(338)} ${fmt(96)}`,
    `C ${fmt(296)} ${fmt(182)}, ${fmt(208)} ${fmt(238)}, ${fmt(112)} ${fmt(232)}`,
    `C ${fmt(74)} ${fmt(228)}, ${fmt(48)} ${fmt(198)}, ${fmt(54)} ${fmt(162)}`,
    `C ${fmt(60)} ${fmt(124)}, ${fmt(94)} ${fmt(96)}, ${fmt(124)} ${fmt(62)}`,
    `C ${fmt(156)} ${fmt(26)}, ${fmt(166)} ${fmt(-26)}, ${fmt(142)} ${fmt(-74)}`,
    `C ${fmt(114)} ${fmt(-130)}, ${fmt(48)} ${fmt(-174)}, ${fmt(-28)} ${fmt(-192)}`,
    `C ${fmt(-54)} ${fmt(-198)}, ${fmt(-68)} ${fmt(-268)}, ${fmt(-48)} ${fmt(-344)}`,
    "Z",
  ].join(" ");

  // Subtle shadow cast at the weave junction where brightOver crosses over the adjacent ribbon
  const crossingShadowPath = [
    `M ${fmt(118)} ${fmt(58)}`,
    `C ${fmt(196)} ${fmt(82)}, ${fmt(268)} ${fmt(126)}, ${fmt(322)} ${fmt(186)}`,
    `C ${fmt(274)} ${fmt(228)}, ${fmt(198)} ${fmt(252)}, ${fmt(116)} ${fmt(244)}`,
    `C ${fmt(72)} ${fmt(238)}, ${fmt(48)} ${fmt(196)}, ${fmt(58)} ${fmt(154)}`,
    `C ${fmt(68)} ${fmt(112)}, ${fmt(92)} ${fmt(82)}, ${fmt(118)} ${fmt(58)}`,
    "Z",
  ].join(" ");

  // Specular highlight tracing the inner hole-hugging rim and sweeping out along the ribbon crest
  const innerHighlightPath = [
    `M ${fmt(-72)} ${fmt(-44)}`,
    `C ${fmt(-14)} ${fmt(-56)}, ${fmt(48)} ${fmt(-50)}, ${fmt(96)} ${fmt(-20)}`,
    `C ${fmt(148)} ${fmt(14)}, ${fmt(166)} ${fmt(78)}, ${fmt(132)} ${fmt(146)}`,
  ].join(" ");

  return {
    navyFoldPath,
    brightUnderPath,
    brightOverPath,
    crossingShadowPath,
    innerHighlightPath,
  };
}

export function circlePath(x: number, y: number, radius: number): string {
  return `M${x + radius} ${y}a${radius} ${radius} 0 1 0 ${-2 * radius} 0a${radius} ${radius} 0 1 0 ${2 * radius} 0Z`;
}

export function apertureLeafPath(
  index: number,
  config: RibbonApertureConfig = DEFAULT_RIBBON_APERTURE_CONFIG,
): string {
  const { center } = apertureLeaves(0, config)[index];
  return `M-12000-12000H12000V12000H-12000Z${circlePath(center.x, center.y, config.maxApertureRadius)}`;
}
