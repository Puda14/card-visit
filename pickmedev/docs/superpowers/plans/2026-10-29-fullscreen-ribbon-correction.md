# Full-screen ribbon correction

User clarified that Sharingan described the motion only. Remove literal eye geometry completely. Three broad blue/navy bands must flow from the left upward, from the top downward and from below towards the right, weaving across the full viewport as in the business card.

- Replace ocular-vortex.tsx with brand-vortex.tsx; full-viewport SVG, three folded tapered bands and separate translations from beyond the viewport edges. Filled shapes retain sharp tips during entry.
- Slow the overall motion: about 106 degrees of broad swirl over 4.5 seconds rather than 1800 degrees of small central rotation in 2.8 seconds. Overall intro 4.8 seconds including the existing center-out reveal.
- Return original logo/name/slogan to the white space in the middle; no iris, pupil, tomoe, circles or eye outline.
- Retain keyboard/skip/reduced-motion/session behavior and GSAP handoff, updating timing and session key.
- Verify actual full-screen composition on desktop/mobile with mid-animation and settled screenshots; run existing regression tests, typecheck and build.

Existing English default, contact information, network background and extension hydration fix remain in place.

Completed: literal eye component and its styles removed; three full-screen folded bands enter from beyond the left, top and bottom edges with independent translation plus slow shared swirl. Overall intro 4.8s, GSAP reveal at3.4s, aperture opens by4.7s, versionv5. On narrow screens bands are composed wider and the central negative space protects logo/wordmark legibility. Filled shapes preserve pointed tips; no path-drawing cutoffs.

Verification: 12/12 browser tests, 9/9 unit tests, typecheck and production build passed. Browser test checks full viewport coverage, exactly three flows, absence of eye/circle artwork, visible intro after3s, movement and actual center aperture. Desktop entry/settled/mobile screenshots inspected. Independent source review approved without important findings. Existing server left running.
