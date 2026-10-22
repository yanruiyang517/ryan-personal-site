# MOVE Implementation Plan

**Goal:** Replace the scoped training site with a calm, responsive daily training companion.
**Architecture:** React components, exercise data, pure plan/timer functions, validated local storage. Vite builds into the existing `rehab-training` directory.
**Spec:** ../specs/2026-10-22-personal-training-design.md

## Boundaries
- Preserve root resume, PDF and other pages.
- Clear only six known legacy training storage keys after successful initialization.
- No private footage or user health history in public source.
- Current deliverable is a local preview and review branch; merge/deploy is separate.

## Implementation
- [x] Date, schedule, timer, import validation, scoped migration and stale-update protection.
- [x] Today, weekly/overall plan, searchable exercise library, records and settings.
- [x] Preflight, per-set actual amounts, skipped sets, rest timer, ending feedback, durable paused reload.
- [x] Active-session Wake Lock with factual status and failure fallback.
- [x] Click-to-load official demonstration videos, original sources and written steps.
- [x] Astra visual system, optimized room image, responsive layout and reduced-motion support.
- [x] Read-only CI workflow and compatible old entry routes.

## Verification
- [x] Eleven domain/storage tests pass, including injected storage denial in an isolated test adapter.
- [x] Production build passes.
- [x] Browser: preflight walking-only branch, actual partial completion, reload persistence, skipped set, rest/next action, paused session reload, settings save/reload and progression dialog.
- [x] Browser: library filtering, demonstration playback, Wake Lock granted status, current-day next-morning input disabled, no captured runtime errors.
- [x] Desktop 1440px and phone 390px visual inspection; 320px no horizontal overflow and seven date targets approximately 45px wide.
- [x] Root resume paths unchanged; full scoped source review.
- [ ] Real iOS/Android hardware, system power-saving behavior, denied Wake Lock and cross-region third-party video playback are not verified.
- [ ] Browser storage-fault injection was rejected by browser approval review and not retried. The isolated storage-adapter tests cover the domain failure paths; fault UI itself is not claimed browser-verified.

## Delivery
Commit source and generated assets together, push the task branch and open a review PR. Leave production unchanged until the release boundary is handled.
