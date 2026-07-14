import {
  AnalyticsEvents,
  createAnalyticsClient,
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
