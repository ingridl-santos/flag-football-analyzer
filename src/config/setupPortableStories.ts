import { setProjectAnnotations } from '@storybook/react-vite';
import { beforeAll, vi } from 'vitest';

import * as previewAnnotations from '../../.storybook/preview';

// Mock the i18n module to prevent HTTP requests in tests
vi.mock('../../.storybook/i18n', async () => {
  const { default: mockI18n } = await import('../__mocks__/i18n');
  return { default: mockI18n };
});

// Mock canvas for Chart.js
HTMLCanvasElement.prototype.getContext = vi.fn();
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

// Mocked DOM doesn't have resize observers, mock it so chart.js can work
class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    setTimeout(() => {
      this.callback(
        [
          {
            target: document.createElement('div'),
            contentRect: {
              width: 100,
              height: 100,
              top: 0,
              left: 0,
              bottom: 100,
              right: 100,
              x: 0,
              y: 0,
              toJSON: () => ({}),
            },
            borderBoxSize: [{ blockSize: 100, inlineSize: 100 }],
            contentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
            devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 100 }],
          },
        ],
        this,
      );
    }, 0);
  }

  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const annotations = setProjectAnnotations([previewAnnotations]);

// Suppress all console output in snapshot tests
const noop = () => {};
global.console = {
  ...console,
  log: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
