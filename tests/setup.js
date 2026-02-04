/**
 * Test setup - Mocks for browser globals and Leaflet
 */
import { vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import vm from 'vm';

// Mock Leaflet
const mockLayer = {
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn().mockReturnThis(),
  bindPopup: vi.fn().mockReturnThis(),
};

const mockMap = {
  hasLayer: vi.fn().mockReturnValue(false),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  setMaxBounds: vi.fn(),
  flyTo: vi.fn(),
};

global.L = {
  map: vi.fn().mockReturnValue(mockMap),
  tileLayer: vi.fn().mockReturnValue(mockLayer),
  polyline: vi.fn().mockReturnValue(mockLayer),
  marker: vi.fn().mockReturnValue(mockLayer),
  divIcon: vi.fn().mockReturnValue({}),
};

// Mock fetch
global.fetch = vi.fn();

// Helper to reset all mocks
export function resetMocks() {
  vi.clearAllMocks();
  global.fetch.mockReset();
  mockMap.hasLayer.mockReturnValue(false);
}

// Helper to mock successful fetch response
export function mockFetchResponse(data) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

// Helper to mock failed fetch response
export function mockFetchError(status = 500) {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
  });
}

/**
 * Load a JS file and execute it in the global context
 * This properly handles IIFEs that create global variables
 */
export function loadScript(filename) {
  const code = readFileSync(join(process.cwd(), filename), 'utf-8');
  const script = new vm.Script(code, { filename });
  script.runInThisContext();
}

/**
 * Load CONFIG into global scope
 */
export function loadConfig() {
  loadScript('js/config.js');
}

// Export mocks for test assertions
export { mockMap, mockLayer };
