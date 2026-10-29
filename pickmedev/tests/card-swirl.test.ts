import { test } from "node:test";
import assert from "node:assert/strict";
import { cardSwirlPaths, cardSwirlState } from "../src/lib/card-swirl.ts";
import { DEFAULT_RIBBON_APERTURE_CONFIG, spinPhaseRatio } from "../src/lib/aperture.ts";

test("ribbons curl into a small hole, then reverse direction and open beyond all corners", () => {
  const split = spinPhaseRatio();
  const start = cardSwirlState(0), tight = cardSwirlState(split), end = cardSwirlState(1);
  assert.ok(start.gap > 500 && tight.gap > 0 && tight.gap < 60);
  assert.ok(tight.twist > start.twist + 3);
  assert.ok(tight.rotation > start.rotation);
  assert.ok(end.rotation < tight.rotation && end.twist < tight.twist);
  assert.ok(end.gap > Math.hypot(1000, 1100));
  for (let i = 1; i <= 100; i++) {
    assert.ok(cardSwirlState(split * i / 100).gap <= cardSwirlState(split * (i - 1) / 100).gap);
    assert.ok(cardSwirlState(split + (1 - split) * i / 100).gap >= cardSwirlState(split + (1 - split) * (i - 1) / 100).gap);
  }
});

test("turning point is continuous, deterministic, and preserves three distinct bands", () => {
  const split = spinPhaseRatio();
  const a = cardSwirlState(split - 1e-5), b = cardSwirlState(split + 1e-5);
  assert.ok(Math.abs(a.gap - b.gap) < 0.001);
  assert.ok(Math.abs(a.rotation - b.rotation) < 0.001);
  assert.equal(new Set([0, 1, 2].map(i => cardSwirlPaths(i, split).face)).size, 3);
  for (const p of [0, split, 0.8, 1]) {
    assert.deepEqual(cardSwirlPaths(0, p), cardSwirlPaths(0, p));
    assert.ok(!/NaN|Infinity/.test(cardSwirlPaths(0, p).face));
  }
  for (const spinDuration of [0, 1.9]) {
    const config = { ...DEFAULT_RIBBON_APERTURE_CONFIG, spinDuration, openDuration: 0 };
    assert.ok(!/NaN|Infinity/.test(cardSwirlPaths(0, 0, config).face));
  }
});

test("white cover hides content while curling in, then logo disappears before content is fully revealed", () => {
  const split = spinPhaseRatio();
  for (const progress of [0, split / 2, split]) {
    assert.equal(cardSwirlState(progress).veilOpacity, 1);
    assert.equal(cardSwirlState(progress).emblemOpacity, 1);
  }
  const opening = cardSwirlState(split + (1 - split) * 0.3);
  assert.equal(opening.emblemOpacity, 0);
  assert.ok(opening.veilOpacity > 0 && opening.veilOpacity < 1);
  assert.equal(cardSwirlState(1).veilOpacity, 0);
});
