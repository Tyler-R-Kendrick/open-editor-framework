# Experiment: <name>

**Status:** Draft | Running | Complete
**Date:** YYYY-MM-DD
**Owner:** <name>
**PostHog experiment:** <link>

## Hypothesis

What change is being made, for whom, and what measurable effect is expected
(direction and minimum size).

## Variants

| Variant | Description | Split |
| ------- | ----------- | ----- |
| control |             | 50%   |
| test    |             | 50%   |

## Metrics

- **Primary:** one metric, with the event(s) and formula it is computed from.
- **Secondary:** supporting metrics.
- **Guardrails:** metrics that must not regress (error rate, web vitals,
  accessibility checks).

## Rollout

Target audience, exposure event, planned duration (from the running-time
calculator), and stop conditions.

## Results

Filled in after the experiment ends: outcome per metric, statistical
significance, decision (ship / iterate / revert), and follow-ups. Negative
and inconclusive results are documented too.
