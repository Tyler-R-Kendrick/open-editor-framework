import {
  AnalyticsEvents,
  createAnalyticsClient,
  getAnalyticsClient,
  setAnalyticsClient,
  track,
  type AnalyticsCapture
} from '../src/analytics/events';

describe('analytics client', () => {
  it('does not capture when analytics is disabled', () => {
    const capture: AnalyticsCapture = jest.fn();
    const client = createAnalyticsClient({
      enabled: false,
      capture
    });

    client.track(AnalyticsEvents.COMPONENT_ADDED, {
      component_type: 'text',
      source: 'tap'
    });

    expect(capture).not.toHaveBeenCalled();
  });

  it('captures named events with properties when enabled', () => {
    const capture: AnalyticsCapture = jest.fn();
    const client = createAnalyticsClient({
      enabled: true,
      capture
    });

    client.track(AnalyticsEvents.COMPONENT_MOVED, {
      component_id: 'c1',
      drag_duration_ms: 120,
      distance: 40,
      pointer_type: 'mouse',
      snap_used: true
    });

    expect(capture).toHaveBeenCalledWith('component_moved', {
      component_id: 'c1',
      drag_duration_ms: 120,
      distance: 40,
      pointer_type: 'mouse',
      snap_used: true
    });
  });

  it('exposes the planned event name constants', () => {
    expect(AnalyticsEvents.COMPONENT_ADDED).toBe('component_added');
    expect(AnalyticsEvents.COMPONENT_MOVED).toBe('component_moved');
    expect(AnalyticsEvents.COMPONENT_PROPERTY_CHANGED).toBe(
      'component_property_changed'
    );
    expect(AnalyticsEvents.UNDO_PERFORMED).toBe('undo_performed');
    expect(AnalyticsEvents.REDO_PERFORMED).toBe('redo_performed');
    expect(AnalyticsEvents.SHARE_LINK_CREATED).toBe('share_link_created');
    expect(AnalyticsEvents.SHARE_LINK_OPENED).toBe('share_link_opened');
    expect(AnalyticsEvents.CANVAS_EXPORTED).toBe('canvas_exported');
    expect(AnalyticsEvents.EDITOR_ERROR).toBe('editor_error');
  });
});

describe('analytics module-level client singleton', () => {
  afterEach(() => {
    // Restore the disabled no-op default so state does not leak between tests.
    setAnalyticsClient(
      createAnalyticsClient({ enabled: false, capture: () => undefined })
    );
  });

  it('defaults to a disabled no-op client', () => {
    expect(getAnalyticsClient().enabled).toBe(false);
    expect(() => track(AnalyticsEvents.COMPONENT_ADDED)).not.toThrow();
  });

  it('track() delegates to whichever client was set via setAnalyticsClient', () => {
    const capture: AnalyticsCapture = jest.fn();
    setAnalyticsClient(createAnalyticsClient({ enabled: true, capture }));

    track(AnalyticsEvents.CANVAS_EXPORTED, { component_count: 3 });

    expect(capture).toHaveBeenCalledWith('canvas_exported', {
      component_count: 3
    });
  });

  it('getAnalyticsClient reflects the most recently set client instance', () => {
    const client = createAnalyticsClient({ enabled: true, capture: jest.fn() });
    setAnalyticsClient(client);

    expect(getAnalyticsClient()).toBe(client);
  });

  it('track() without properties forwards undefined and does not throw', () => {
    const capture: AnalyticsCapture = jest.fn();
    setAnalyticsClient(createAnalyticsClient({ enabled: true, capture }));

    expect(() => track(AnalyticsEvents.UNDO_PERFORMED)).not.toThrow();
    expect(capture).toHaveBeenCalledWith('undo_performed', undefined);
  });

  it('stops forwarding events after the client is swapped to a disabled one', () => {
    const capture: AnalyticsCapture = jest.fn();
    setAnalyticsClient(createAnalyticsClient({ enabled: true, capture }));
    track(AnalyticsEvents.REDO_PERFORMED);
    expect(capture).toHaveBeenCalledTimes(1);

    setAnalyticsClient(
      createAnalyticsClient({ enabled: false, capture: () => undefined })
    );
    track(AnalyticsEvents.REDO_PERFORMED);

    expect(capture).toHaveBeenCalledTimes(1);
  });
});
