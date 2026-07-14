# Experiment: E2 Property validation with live preview

**Status:** Draft
**Date:** 2026-07-14
**Owner:** Unassigned
**PostHog feature flag:** [exp-property-live-preview](https://us.posthog.com/project/476084/feature_flags/760085)

## Hypothesis

Inline validation plus live canvas preview while editing properties reduces
invalid property values and undos after property changes by ≥ 30%.

## Variants

| Variant | Description               | Split |
| ------- | ------------------------- | ----- |
| control | Commit on blur            | 50%   |
| test    | Live preview + validation | 50%   |

## Metrics

- **Primary:** undo within 10 s of `component_property_changed`.
- **Secondary:** property edit abandonment; edits per property.
- **Guardrails:** `editor_error` / `$exception`, INP from `$web_vitals`.

## Rollout

Flag inactive until baseline week completes and E1 decision is recorded.
Only one experiment active at a time.

## Results

Pending launch.
