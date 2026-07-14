import { useCallback, useEffect, useState } from 'react';
import { getFeatureFlag, posthog, type FeatureFlagValue } from '../analytics';

/**
 * Subscribe to a PostHog feature flag and return its current value.
 * Falls back to `undefined` when analytics is disabled.
 */
export function useFeatureFlag(flag: string): FeatureFlagValue {
  const [value, setValue] = useState<FeatureFlagValue>(() =>
    getFeatureFlag(flag)
  );

  const refresh = useCallback(() => {
    setValue(getFeatureFlag(flag));
  }, [flag]);

  useEffect(() => {
    refresh();
    if (typeof posthog?.onFeatureFlags !== 'function') return;
    return posthog.onFeatureFlags(() => {
      refresh();
    });
  }, [flag, refresh]);

  return value;
}
