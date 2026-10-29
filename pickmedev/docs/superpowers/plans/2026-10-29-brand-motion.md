# Card-inspired brand and motion refinement

Implement the user's explicit corrections within the existing compact multilingual page; preserve configured contacts and the approved circular opening reveal.

- [x] Default `/` to `/en`, retain the three explicit language routes.
- [x] Format Vietnamese telephone display as `+84 839.191.315`; keep the original normalized dial/vCard value. Cover +84, 84, domestic 0 and existing punctuation; do not alter foreign formats.
- [x] Render an animated, connected node/strand backdrop matching the card front. Keep it behind readable content, resize correctly, pause for reduced motion/hidden tabs and clean up animation resources.
- [x] Give the single profile panel a stronger company identity, blue/navy band, upright portrait treatment, larger contact values and subtle branded depth.
- [x] Replace separated small intro blades with broad, full-frame interwoven blue/navy ribbons surrounding a white center and the original logo/wordmark, based on card back. Preserve center-out transparent mask, skip, keyboard and reduced motion; version session key.
- [x] Use GSAP for coordinated panel, identity and contact entrance after the intro starts opening. Keep server HTML visible and clean up on reduced motion/unmount.
- [x] Verify formatting, root language, locale/responsive behavior, intro lifecycle, background pause and entrance visibility. Inspect screenshots and run production build.

New dependency: GSAP 3.15.0 installed for the requested appearance effects. Existing Motion remains responsible for the intro and circular mask. No external data or generated images required.

Verification: phone tests failed before implementation, then full unit suite 9/9 passed. Browser suite 11/11 passed, including pixel changes in running canvas/static reduced-motion canvas, entrance completion after skip, default English without JavaScript, three locales and 320–1440px viewports. Typecheck and production build passed; broad-ribbon intro and final desktop/mobile screenshots inspected. Independent review approved with no important findings and independently checked mid-entrance reduced-motion cleanup plus 320px resizing. Existing user dev server left running; no public deployment performed. Native mobile share/vCard import and non-Chromium graphics remain device checks.
