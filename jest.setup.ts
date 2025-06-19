import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => { },
    removeEventListener: () => { },
    addListener: () => { },
    removeListener: () => { }
  })
});

HTMLCanvasElement.prototype.getContext = () => null;

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

(window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserver;
