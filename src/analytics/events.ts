export const AnalyticsEvents = {
  COMPONENT_ADDED: 'component_added',
  COMPONENT_MOVED: 'component_moved',
  COMPONENT_PROPERTY_CHANGED: 'component_property_changed',
  UNDO_PERFORMED: 'undo_performed',
  REDO_PERFORMED: 'redo_performed',
  SHARE_LINK_CREATED: 'share_link_created',
  SHARE_LINK_OPENED: 'share_link_opened',
  CANVAS_EXPORTED: 'canvas_exported',
  EDITOR_ERROR: 'editor_error'
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export type AnalyticsCapture = (
  event: string,
  properties?: AnalyticsProperties
) => void;

export interface AnalyticsClientOptions {
  enabled: boolean;
  capture: AnalyticsCapture;
}

export interface AnalyticsClient {
  track: (event: AnalyticsEventName, properties?: AnalyticsProperties) => void;
  enabled: boolean;
}

export function createAnalyticsClient(
  options: AnalyticsClientOptions
): AnalyticsClient {
  return {
    enabled: options.enabled,
    track(event, properties) {
      if (!options.enabled) return;
      options.capture(event, properties);
    }
  };
}

let activeClient: AnalyticsClient = createAnalyticsClient({
  enabled: false,
  capture: () => undefined
});

export function setAnalyticsClient(client: AnalyticsClient): void {
  activeClient = client;
}

export function getAnalyticsClient(): AnalyticsClient {
  return activeClient;
}

export function track(
  event: AnalyticsEventName,
  properties?: AnalyticsProperties
): void {
  activeClient.track(event, properties);
}
