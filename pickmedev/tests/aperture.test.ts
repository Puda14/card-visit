import { test } from "node:test";
import assert from "node:assert/strict";
import {
  apertureLeaves,
  APERTURE_RADIUS,
  DEFAULT_RIBBON_APERTURE_CONFIG,
  openingRadius,
} from "../src/lib/aperture.ts";

test("three independent bands frame a generous central window from the first frame", () => {
  const leaves = apertureLeaves(0);
  assert.equal(leaves.length, 3);
  assert.equal(new Set(leaves.map(leaf => `${leaf.pivot.x},${leaf.pivot.y}`)).size, 3);
  for (const leaf of leaves) assert.ok(Math.hypot(leaf.center.x, leaf.center.y) < APERTURE_RADIUS);
  assert.ok(openingRadius(0, 0) > 300);
  assert.ok(openingRadius(0, 0) < 1200);
});

test("aperture opens monotonically along every viewing direction without a closing beat", () => {
  for (let ray = 0; ray < 72; ray++) {
    const angle = (ray * Math.PI * 2) / 72;
    let previous = openingRadius(0, angle);
    for (let step = 1; step <= 100; step++) {
      const current = openingRadius(step / 100, angle);
      assert.ok(current >= previous - 1e-6, `ray ${ray}, step ${step}: ${previous} -> ${current}`);
      previous = current;
    }
  }
});

test("curved triangular opening approaches a circle and clears the entire viewport", () => {
  const early = Array.from({ length: 72 }, (_, i) => openingRadius(0, (i * Math.PI * 2) / 72));
  const late = Array.from({ length: 72 }, (_, i) => openingRadius(0.9, (i * Math.PI * 2) / 72));
  assert.ok(Math.max(...early) / Math.min(...early) > 1.25);
  assert.ok(Math.max(...late) / Math.min(...late) < 1.1);
  for (const leaf of apertureLeaves(1)) {
    for (const [x, y] of [
      [-1000, -1100],
      [1000, -1100],
      [-1000, 1100],
      [1000, 1100],
    ]) {
      assert.ok(Math.hypot(x - leaf.center.x, y - leaf.center.y) < APERTURE_RADIUS);
    }
  }
});

test("each blade rotates around its own pivot and slides outward independently", () => {
  const initial = apertureLeaves(0);
  const moving = apertureLeaves(0.65);
  assert.equal(new Set(moving.map(leaf => `${leaf.translation.x},${leaf.translation.y}`)).size, 3);
  moving.forEach((leaf, i) => {
    assert.ok(leaf.rotation > 0);
    const outward = leaf.translation.x * leaf.pivot.x + leaf.translation.y * leaf.pivot.y;
    assert.ok(outward > 0);
    const [a, b, c, d, e, f] = leaf.matrix;
    const base = initial[i].center;
    assert.ok(Math.abs(a * base.x + c * base.y + e - leaf.center.x) < 1e-6);
    assert.ok(Math.abs(b * base.x + d * base.y + f - leaf.center.y) < 1e-6);
  });
});

test("card bands move at a restrained pace without spinning a full turn", () => {
  const config = DEFAULT_RIBBON_APERTURE_CONFIG;
  assert.ok(config.spinDuration + config.openDuration >= 3.5);
  assert.ok(config.totalRotationDeg > 0 && config.totalRotationDeg < 60);
});
