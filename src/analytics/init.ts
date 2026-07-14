import posthog from 'posthog-js';
import {
  createAnalyticsClient,
  setAnalyticsClient,
  type AnalyticsClient
} from './events';
import { getAnalyticsEnv, setAnalyticsEnv, type AnalyticsEnv } from './env';

export type AnalyticsConfig = AnalyticsEnv;

export function isAnalyticsConfigured(config: AnalyticsConfig = {}): boolean {
  const env = { ...getAnalyticsEnv(), ...config };
  const enabled = env.enabled !== false;
  return Boolean(enabled && env.apiKey);
}

export function initAnalytics(config: AnalyticsConfig = {}): AnalyticsClient {
  const env = { ...getAnalyticsEnv(), ...config };
  if (config.apiKey || config.apiHost || config.enabled !== undefined) {
    setAnalyticsEnv(env);
  }

  const apiKey = env.apiKey;
  const apiHost = env.apiHost ?? 'https://us.i.posthog.com';
  const enabled = isAnalyticsConfigured(env);

  if (!enabled || !apiKey) {
    const client = createAnalyticsClient({
      enabled: false,
      capture: () => undefined
    });
    setAnalyticsClient(client);
    return client;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    defaults: '2026-01-30',
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: false,
    persistence: 'localStorage+cookie'
  });

  const client = createAnalyticsClient({
    enabled: true,
    capture: (event, properties) => {
      posthog.capture(event, properties);
    }
  });
  setAnalyticsClient(client);
  return client;
}

export function getFeatureFlag(flag: string): string | boolean | undefined {
  if (!isAnalyticsConfigured()) return undefined;
  try {
    return posthog.getFeatureFlag(flag) as string | boolean | undefined;
  } catch {
    return undefined;
  }
}

export function captureException(error: unknown): void {
  if (!isAnalyticsConfigured()) return;
  try {
    posthog.captureException(error);
  } catch {
    // no-op when PostHog is unavailable
  }
}

export { posthog };
