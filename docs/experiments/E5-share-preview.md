# Experiment: E5 Share-link output preview

**Status:** Draft
**Date:** 2026-07-14
**Owner:** Unassigned
**PostHog feature flag:** [exp-share-preview](https://us.posthog.com/project/476084/feature_flags/760084)

## Hypothesis

Showing a render preview before the share URL is copied catches broken
output early and increases the share of links that open into a valid,
non-empty canvas by ≥ 10%.

## Variants

| Variant | Description              | Split |
| ------- | ------------------------ | ----- |
| control | Copy immediately         | 50%   |
| test    | Preview dialog then copy | 50%   |

## Metrics

- **Primary:** output validity of opened share links
  (`share_link_opened.valid`).
- **Secondary:** `share_link_created` → `share_link_opened` conversion.
- **Guardrails:** share completion rate must not drop by more than 5%.

## Rollout

Flag inactive. Launch after baseline telemetry and earlier experiments.

## Results

Pending launch.
