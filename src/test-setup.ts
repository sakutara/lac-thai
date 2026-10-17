import '@testing-library/jest-dom/vitest';

// Mock window.scrollTo for SPA navigation and scroll-to-top tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Default matchMedia mock (can be overridden in individual tests for prefers-reduced-motion)
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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
}
