# Ocular intro and extension hydration compatibility

User reported an exact `<html data-immersive-translate-page-theme="light">` hydration diff and asked for a Sharingan-like spinning eye instead of broad ribbons.

- [x] Confirm source does not produce the extension attribute.
- [x] Reproduce the exact hydration warning by attaching the attribute before React hydration via an initialization script/MutationObserver.
- [x] Add `suppressHydrationWarning` narrowly to `<html>` only, preserving descendant checks. Confirm regression test changes from the exact warning to green.
- [x] Replace broad ribbons with a blue iris, fixed central pupil, three navy tomoe at 120 degrees, accelerating spin, contracting orbit and speed trails; retain approved center-out mask and GSAP reveal.
- [x] Verify all browser behavior, typecheck and production build; inspect the actual intro and mobile frame.

The suppression is an explicit compatibility escape hatch for extension-owned attributes, not removal of the attribute or disabling SSR. Standard body content remains server-rendered. Reference: https://nextjs.org/docs/messages/react-hydration-error (browser extensions and the one-level suppression escape hatch).

Initial request-interception test buffered HTML and missed the timed intro; replaced it with direct pre-hydration attribute mutation. This reproduced the user's exact console diff. After the narrow fix the test passed and the extension attribute remained intact.

Verification: full browser suite 12/12 passed (including extension injection, actual rotor transform changes, opening mask and existing keyboard/reduced-motion/fallback/GSAP/locale tests), unit suite 9/9, typecheck and production build passed. Intro desktop screenshot inspected. Default English, existing contacts, background network and phone display unchanged. Existing dev server remains running.

Desktop and mobile ocular screenshots inspected. Independent focused review approved without important findings; confirmed suppression scope, fixed rotation center, deterministic SVG and retained reduced-motion/skip/focus cleanup.
