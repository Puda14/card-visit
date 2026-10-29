# Digital Card Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Track progress below.

**Goal:** Build the approved NFC company and personal introduction page in pickmedev.

**Architecture:** Next.js App Router renders public profile data from server environment variables. Small client components own intro motion, avatar fallback and sharing; a server route generates a vCard. Assets are synchronized from the provided source folders before dev/build.

**Tech Stack:** Next.js, React, TypeScript, pnpm, Motion, Lucide, Playwright for browser verification.

**Spec:** ../specs/2026-10-29-digital-card-design.md

## Global Constraints

- One page; white and blue from supplied logo; Vietnamese interface.
- Real supplied avatar and logo; no invented contact details or claims.
- About 2-second skippable intro; session-only; reduced-motion respected.
- Configuration via .env plus .env.example; hide absent contact methods.
- Responsive, accessible, usable without JavaScript; no hosting deployment in this scope.

## Review Focus

- Blank contact values must not produce dead links.
- Invalid URL schemes must not become executable links.
- Vietnamese names and punctuation must survive vCard generation.
- Disabled sessionStorage, missing avatars and reduced motion must not block content.
- Narrow phone screens and keyboard navigation must remain usable.

## Task 1: Configuration and contact export

Files: package.json, tsconfig.json, next.config.ts, .gitignore, .env, .env.example, scripts/sync-assets.mjs, src/lib/profile.ts, src/lib/vcard.ts, src/app/contact.vcf/route.ts, tests/profile.test.ts.

Interfaces: readProfile(env: NodeJS.ProcessEnv): Profile; createVCard(profile: Profile): string; exported profile used by server components.

- [x] Set up package scripts and install dependencies.
- [x] Write tests for blank/invalid contacts, public defaults and Unicode/escaped vCard data; run to see failure before implementing helpers.
- [x] Implement profile parsing, asset sync and vCard response; rerun tests.

## Task 2: Page and animation

Files: src/app/layout.tsx, src/app/page.tsx, src/app/globals.css, src/components/intro.tsx, src/components/avatar.tsx, src/components/reveal.tsx, src/components/share-button.tsx, tests/site.spec.ts.

Interfaces: page consumes Profile; client components receive only public strings; intro is optional enhancement over SSR content.

- [x] Write browser checks for identity, empty contact visibility, working vCard download, mobile overflow, intro skip/session/reduced-motion and avatar fallback.
- [x] Implement refined white/navy layout with a strong blue visual field, portrait, company section and contact list.
- [x] Implement Motion spiral intro with skip, Escape, session flag, storage-error tolerance and reduced-motion fallback.
- [x] Run typecheck, unit tests, production build and browser checks.

## Task 3: Handoff

Files: README.md, this plan.

- [x] Document environment variables, swapping source images, local run and deployment.
- [x] Fresh independent code review; fix important issues and rerun affected checks.
- [x] Record checks and limitations, hand off working local source.

## Execution ledger

- User approved design with “ok”; proceed inline without another approval round.
- No Git repository exists; use requested directory directly, no worktree or Git commits.
- Dependency version and browser availability checks completed.
- Task 1 complete: tests failed on missing implementation, then 5/5 passed including UTF-8 folding and delimiter/newline safety.
- Task 2 complete: browser checks failed on empty initial page; implemented UI then identified new Next dev origin policy preventing hydration. Added allowedDevOrigins for 127.0.0.1 according to installed docs. Broken avatar failed before hydration; ref-based completed-image check fixed it. Final browser checks 5/5 passed.
- Typecheck and production build passed. Motion 14.7.1 and Lucide 1.64.0 installed; brand icons use local SVG because Lucide no longer exports them. Fonts packaged locally.
- QA uses installed Chromium 1234 via PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH; no additional browser installation required on this machine.
- Final independent review approved: no blocking or important findings. No deferred minor findings.
- Final verification: pnpm typecheck, pnpm test (5/5), pnpm build, pnpm test:e2e (5/5) passed. Screenshots inspected at desktop and 390px mobile, plus intro capture.
- Verification limits: Chromium desktop emulation only; native mobile vCard importing, native share sheets and real screen-reader announcements require testing on devices. No public deployment performed.
- Source kept directly in requested folder. No Git branch exists to merge or publish. Temporary dev server stopped for handoff.
