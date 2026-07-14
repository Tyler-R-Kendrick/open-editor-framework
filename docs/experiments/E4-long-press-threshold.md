# Experiment: E4 Mobile long-press drag threshold

**Status:** Draft
**Date:** 2026-07-14
**Owner:** Unassigned
**PostHog feature flag:** [exp-long-press-threshold](https://us.posthog.com/project/476084/feature_flags/760083)

## Hypothesis

An optimized long-press delay before touch drag starts raises mobile drag
success ≥ 15% versus the 300 ms control.

## Variants

| Variant | Description | Split |
| ------- | ----------- | ----- |
| 150     | 150 ms      | 34%   |
| 300     | 300 ms      | 33%   |
| 450     | 450 ms      | 33%   |

## Metrics

- **Primary:** mobile drag success (`component_moved` with
  `pointer_type=touch` not followed by undo).
- **Secondary:** drag abandonment, `$dead_click`.
- **Guardrails:** mobile session duration must not drop.

## Rollout

Flag inactive. When inactive, the app keeps the current PointerSensor
distance-based activation (no long-press delay) so default UX is unchanged.

## Results

Pending launch.
