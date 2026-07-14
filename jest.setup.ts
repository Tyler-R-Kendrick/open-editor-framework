import '@testing-library/jest-dom';

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    capture: jest.fn(),
    captureException: jest.fn(),
    getFeatureFlag: jest.fn(),
    onFeatureFlags: jest.fn(() => () => undefined),
    isFeatureEnabled: jest.fn()
  }
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {}
  })
});

HTMLCanvasElement.prototype.getContext = () => null;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(
  window as unknown as { ResizeObserver: typeof ResizeObserver }
).ResizeObserver = ResizeObserver;
