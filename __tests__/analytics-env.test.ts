describe('analytics env', () => {
  beforeEach(() => {
    // src/analytics/env.ts keeps module-level mutable state; reset the
    // module registry so each test starts from a clean, empty env.
    jest.resetModules();
  });

  it('returns an empty object before any env has been set', async () => {
    const { getAnalyticsEnv } = await import('../src/analytics/env');
    expect(getAnalyticsEnv()).toEqual({});
  });

  it('stores values passed to setAnalyticsEnv', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({
      apiKey: 'phc_test123',
      apiHost: 'https://us.i.posthog.com',
      enabled: true
    });

    expect(getAnalyticsEnv()).toEqual({
      apiKey: 'phc_test123',
      apiHost: 'https://us.i.posthog.com',
      enabled: true
    });
  });

  it('merges successive calls instead of replacing the whole object', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({ apiKey: 'phc_test123' });
    setAnalyticsEnv({ apiHost: 'https://eu.i.posthog.com' });

    expect(getAnalyticsEnv()).toEqual({
      apiKey: 'phc_test123',
      apiHost: 'https://eu.i.posthog.com'
    });
  });

  it('lets later calls override previously set fields', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({ enabled: true });
    setAnalyticsEnv({ enabled: false });

    expect(getAnalyticsEnv().enabled).toBe(false);
  });

  it('preserves unrelated fields when partially updating', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({
      apiKey: 'phc_test123',
      apiHost: 'https://us.i.posthog.com',
      enabled: true
    });
    setAnalyticsEnv({ enabled: false });

    expect(getAnalyticsEnv()).toEqual({
      apiKey: 'phc_test123',
      apiHost: 'https://us.i.posthog.com',
      enabled: false
    });
  });

  it('accepts an empty patch without throwing or changing existing values', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({ apiKey: 'phc_test123' });
    expect(() => setAnalyticsEnv({})).not.toThrow();
    expect(getAnalyticsEnv()).toEqual({ apiKey: 'phc_test123' });
  });

  it('explicitly overwrites a field with undefined when passed', async () => {
    const { setAnalyticsEnv, getAnalyticsEnv } = await import(
      '../src/analytics/env'
    );

    setAnalyticsEnv({ apiKey: 'phc_test123' });
    setAnalyticsEnv({ apiKey: undefined });

    // Object spread merging means an explicit `undefined` in the patch
    // overwrites the previous value rather than being ignored.
    expect(getAnalyticsEnv().apiKey).toBeUndefined();
    expect('apiKey' in getAnalyticsEnv()).toBe(true);
  });
});