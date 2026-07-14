# Experiment: E1 Smart alignment guides and snap-to-grid

**Status:** Draft
**Date:** 2026-07-14
**Owner:** Unassigned
**PostHog feature flag:** [exp-alignment-guides](https://us.posthog.com/project/476084/feature_flags/760082)

## Hypothesis

Showing alignment guides while dragging (and snapping to an 8 px grid +
sibling edges) reduces post-drop corrections by ≥ 25% and produces more
aligned output.

## Variants

| Variant     | Description                      | Split |
| ----------- | -------------------------------- | ----- |
| control     | Free drag, no guides             | 34%   |
| guides      | Alignment guides only            | 33%   |
| guides-snap | Guides + 8px grid + sibling snap | 33%   |

## Metrics

- **Primary:** correction rate per `component_added` (`undo_performed` +
  repeat `component_moved` within 10 s).
- **Secondary:** mean sibling alignment error; drag duration.
- **Guardrails:** `$rageclick`, drag abandonment.

## Rollout

Flag is created inactive. Activate after ≥ 1 week of baseline telemetry.
Launch alone (one experiment at a time). Stop when PostHog running-time
calculator reaches significance or after a fixed observation window.

## Results

Pending launch.
