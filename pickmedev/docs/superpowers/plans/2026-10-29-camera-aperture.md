# Three-leaf mechanical camera aperture

Binding user requirements: exactly three curved interleaving blades; independent pivots and outward sliding; small real initial opening reveals the existing page; curved triangular opening becomes nearly circular and exceeds the viewport; a short setting rotation followed by one smooth synchronized opening; no close, flash or white overlay; underlying page position and scale remain fixed throughout.

Implementation: three opaque SVG blades defined as the region outside three offset circles. Their actual inner edges bound the aperture; there is no separate radial reveal mask. Independent pivot rotation and compensated outward translation move the circle centers inward so their intersection grows from a curved triangle toward a circle. Colored faces, navy bevels and edge highlights show depth and overlapping order.

- [x] Verify geometry: three pivots, initial gap, monotonic opening at every direction, late circularity, final full viewport clearance, rotation+outward translations.
- [x] Replace ribbon intro with actual blades driven by one bounded progress timeline. Keep skip/Escape, reduced-motion, storage tolerance and one-play session behavior.
- [x] Keep underlying content static: unmount the earlier GSAP entrance, pause background network until completion, retain page layout and scroll width.
- [x] Inspect initial/nudge/mid/opening frames on desktop and mobile; browser-check genuine transparency, independent leaf transforms, no content position/scale/opacity changes, one-shot opening and existing regressions.
- [x] Run typecheck, unit/browser suites, production build and independent review.

Verification: unit suite13/13 (aperture4 + profile9), browser suite13/13, typecheck and production build passed. SSR-first-frame test blocks framework scripts and checks the actual SVG fill at center/corner; body remains visible through the center. Runtime test measures leaf transform changes and unchanged content bounds/scale/opacity through opening and completion. Initial/nudge/mid/opening/mobile screenshots inspected; recorded full motion at qa/aperture-preview.webm.

Native SVG transform attributes are updated via useMotionValueEvent; Motion's automatic conversion to CSS transforms was rejected because it used the large blade bounding-box origin. Stable scrollbar gutter preserves page geometry when scroll is locked; overlay explicitly spans100vw/100dvh.

Independent reviewer approved without Important findings and independently checked 720 directions ×1000 progress steps for monotonicity. Existing user's server left running; Chromium verified, native Safari/mobile-device rendering remains a device check.
