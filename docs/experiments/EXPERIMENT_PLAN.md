# Experiment Plan: Improving Editor Output Quality

**Status:** Proposed
**Date:** 2026-07-13
**Owner:** Unassigned

## 1. Audit of currently documented experiments and research

Before proposing new work, the following sources were surveyed for existing
experiment documentation and research references:

| Source                                             | What was found                                                                                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository markdown docs                           | Engineering summaries only (`REFACTORING_SUMMARY.md`, `DRAG_FIX_SUMMARY.md`, `NPM_WARNINGS_RESOLUTION.md`, `DISCONNECTED_FEATURES.md`, component `README.md` files). No experiment write-ups or research papers. |
| Git history (all branches)                         | Historical fix/status docs (`MOBILE_DRAGGING_FIX.md`, `PLAYWRIGHT_FIXES_SUMMARY.md`, etc.). No experiment documentation.                                                                                         |
| GitHub issues and PRs                              | Feature and bug-fix work only (e.g. #63–#65 mobile drag, #72 properties panel selection sync). No experiment proposals or results.                                                                               |
| PostHog project (`Default project`, QuickDeployAI) | **0 experiments, 0 notebooks, 0 feature flags, 0 custom events.** The only artifact is a "Set up PostHog" task. The PostHog SDK is not integrated into this codebase.                                            |

**Conclusion:** there is no existing experimentation practice to build on. This
plan therefore covers (a) the instrumentation prerequisites, (b) a first wave
of experiments, and (c) the documentation conventions so future experiments
are discoverable (see `TEMPLATE.md` in this folder).

## 2. What "output quality" means for this project

The framework is a canvas-based editor; its output is the component tree a
user composes (rendered on canvas, exported, or shared via compressed URL).
"Output quality" is defined along three measurable axes:

1. **Structural correctness** — the produced component tree is valid: no
   orphaned children, correct parent ids (cf. the bug fixed in #69), bounds
   inside the canvas, no overlapping/degenerate components.
2. **Visual quality** — components are aligned, consistently spaced, and
   render identically across devices and re-loads (share-link round trips).
3. **Editing efficiency** — users reach their intended output with few
   corrections: low undo rate, few post-drop position adjustments, no
   rage/dead clicks, successful mobile drags.

Known weak spots, taken from repo history and `DISCONNECTED_FEATURES.md`:
drag precision and duration (#65), mobile touch dragging (#63, #64),
properties panel/selection sync (#67, #72), and unwired canvas modules
(`useCanvasState.ts`, `CanvasRenderer.tsx`).

## 3. Phase 0 — Prerequisites (instrumentation)

No experiment below can run until the product emits telemetry. This phase is
a hard dependency.

1. **Integrate `posthog-js`** into `src/main.tsx`, gated behind a config flag
   so self-hosters can disable it. Enable session replay and web vitals.
2. **Emit custom events** from the Redux store / behaviors layer:
   - `component_added` (source: palette drag vs. tap, component type)
   - `component_moved` (drag duration, distance, pointer type, snap used)
   - `component_property_changed` (property key, panel used)
   - `undo_performed` / `redo_performed`
   - `share_link_created` and `share_link_opened` (payload size)
   - `canvas_exported`
   - `editor_error` via PostHog error tracking for thrown exceptions
3. **Derived quality metrics** (computed as PostHog insights):
   - _Correction rate_: `undo_performed` + repeat `component_moved` on the
     same component within 10 s, divided by `component_added`.
   - _Mobile drag success_: `component_moved` with `pointer_type=touch` that
     is not followed by an undo.
   - _Output validity_: share payloads that fail to deserialize on open.
4. **Feature-flag plumbing**: a small utility that reads PostHog flags and
   exposes them to React components, so variants can be assigned per user.
5. **Baseline dashboard**: one week of data minimum before the first
   experiment launches, to establish baselines and sample-size estimates.

## 4. Phase 1 — Proposed experiments

Each experiment gets its own write-up in `docs/experiments/` using
`TEMPLATE.md` before launch. Ordered by expected impact on output quality.

### E1 — Smart alignment guides and snap-to-grid

- **Hypothesis:** showing alignment guides while dragging (and snapping to
  8 px grid + sibling edges) reduces post-drop corrections by ≥ 25% and
  produces more aligned output.
- **Variants:** control (free drag) / guides only / guides + snap.
- **Primary metric:** correction rate per `component_added`.
- **Secondary:** mean alignment error between sibling components in the final
  tree; time from drag start to final placement.
- **Guardrails:** rage clicks, drag abandonment (drag started, no drop).
- **Note:** direct-manipulation research (Bier & Stone's "snap-dragging",
  CHI'86 onward) consistently shows constraint-based snapping improves layout
  precision; this validates it in our editor.

### E2 — Property validation with live preview

- **Hypothesis:** inline validation plus live canvas preview while editing
  properties in the control panel reduces invalid property values and undos
  after property changes by ≥ 30%.
- **Variants:** control (commit on blur) / live preview + validation.
- **Primary metric:** undo within 10 s of `component_property_changed`.
- **Secondary:** property edit abandonment; number of edits per property.
- **Guardrails:** editor error rate (live preview must not regress canvas
  performance), INP from web vitals.

### E3 — Curated default component templates

- **Hypothesis:** richer curated defaults in `samples/default-component-templates.json`
  (real content, sensible sizes) instead of minimal placeholders shorten time
  to first meaningful output and reduce property edits per component by ≥ 20%.
- **Variants:** control (current templates) / curated set.
- **Primary metric:** time from first `component_added` to first
  `share_link_created` or `canvas_exported`.
- **Secondary:** property edits per component in the first session.

### E4 — Mobile long-press drag threshold tuning

- **Hypothesis:** the long-press delay before touch drag starts (see the
  mobile dragging work in #63/#64) trades off accidental drags against
  perceived lag; an optimized threshold raises mobile drag success ≥ 15%.
- **Variants:** 150 ms / 300 ms (current behavior) / 450 ms, touch users only.
- **Primary metric:** mobile drag success rate (drop not followed by undo).
- **Secondary:** drag abandonment, scroll-vs-drag misfires (`$dead_click`).
- **Guardrails:** session duration on mobile must not drop.

### E5 — Share-link output preview

- **Hypothesis:** showing a render preview before the share URL is copied
  catches broken output early and increases the share of links that open into
  a valid, non-empty canvas by ≥ 10%.
- **Variants:** control (copy immediately) / preview step.
- **Primary metric:** output validity of opened share links.
- **Secondary:** `share_link_created` → `share_link_opened` conversion.
- **Guardrails:** share completion rate (the extra step must not deter
  sharing by more than 5%).

## 5. Non-A/B quality experiments (offline)

These do not need traffic and can start immediately:

- **Visual regression corpus:** extend the Playwright e2e suite with a corpus
  of saved component trees and screenshot them per PR; track pixel-diff rate
  as an internal output-quality metric.
- **Property fuzzing:** generate randomized property values against the
  control panel schema and assert the canvas renders without exceptions;
  failures become unit tests.
- **Serialization round-trip testing:** property-based tests asserting
  encode→decode of share payloads is lossless for arbitrary component trees.

## 6. Statistical approach and realism

- Run experiments through PostHog Experiments with the default
  `$feature_flag_called` exposure; one primary metric each.
- Current traffic is small. Run at most **one A/B experiment at a time**,
  50/50 split, and prefer the larger effect sizes listed above; use PostHog's
  running-time calculator against baseline data before launch. If projected
  runtime is unreasonable, fall back to qualitative evaluation: session
  replays plus the offline experiments in section 5.
- Document every experiment — including negative and inconclusive results —
  in this folder using `TEMPLATE.md`.

## 7. Reference reading

Baseline literature for the methodology used above:

- R. Kohavi, D. Tang, Y. Xu, _Trustworthy Online Controlled Experiments_
  (Cambridge University Press, 2020) — guardrails, sample ratio mismatch,
  one-primary-metric discipline.
- E. Bier, M. Stone, "Snap-Dragging" (SIGGRAPH 1986) — precision benefits of
  snapping/alignment constraints in direct-manipulation editors (E1).
- P. Fitts (1954) / ISO 9241-411 — pointing-time models motivating the touch
  target and drag threshold work (E4).
- W3C, _WCAG 2.1_ — the accessibility bar all variants must continue to meet;
  no experiment may ship a variant that regresses keyboard or screen-reader
  flows.
