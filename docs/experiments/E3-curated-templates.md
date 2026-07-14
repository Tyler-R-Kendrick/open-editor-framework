# Experiment: E3 Curated default component templates

**Status:** Draft
**Date:** 2026-07-14
**Owner:** Unassigned
**PostHog feature flag:** [exp-curated-templates](https://us.posthog.com/project/476084/feature_flags/760086)

## Hypothesis

Richer curated defaults (`/assets/curated-component-templates.json`) shorten
time to first meaningful output and reduce property edits per component by
≥ 20%.

## Variants

| Variant | Description                                | Split |
| ------- | ------------------------------------------ | ----- |
| control | Current `/assets/component-templates.json` | 50%   |
| curated | Curated templates with real content        | 50%   |

## Metrics

- **Primary:** time from first `component_added` to first
  `share_link_created` or `canvas_exported`.
- **Secondary:** property edits per component in the first session.

## Rollout

Flag inactive. Launch after earlier experiments conclude.

## Results

Pending launch.
