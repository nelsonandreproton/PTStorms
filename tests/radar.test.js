/**
 * Tests for RadarModule
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { resetMocks, mockFetchResponse, mockFetchError, mockMap, mockLayer, loadScript } from './setup.js';

const mockRadarData = {
  generated: Math.floor(Date.now() / 1000),
  radar: {
    past: [
      { time: Math.floor(Date.now() / 1000) - 600, path: '/v2/radar/past1' },
      { time: Math.floor(Date.now() / 1000) - 300, path: '/v2/radar/past2' },
      { time: Math.floor(Date.now() / 1000), path: '/v2/radar/now' },
    ],
    nowcast: [
      { time: Math.floor(Date.now() / 1000) + 300, path: '/v2/radar/forecast1' },
    ],
  },
};

beforeAll(() => {
  // Set up DOM elements
  document.body.innerHTML = `
    <div id="map"></div>
    <div id="time-slider" style="display: none;"></div>
    <input type="range" id="time-range" min="0" max="12" value="0">
    <span id="time-label">Agora</span>
    <button id="btn-animation"></button>
    <button id="btn-radar" class="active"></button>
  `;

  // Load modules in order
  loadScript('js/config.js');
  loadScript('js/map.js');
  loadScript('js/radar.js');
});

beforeEach(() => {
  resetMocks();
  // Re-initialize MapModule for each test
  MapModule.init();
});

describe('RadarModule', () => {
  describe('init', () => {
    it('should return true on successful initialization', async () => {
      mockFetchResponse(mockRadarData);
      const result = await RadarModule.init();
      expect(result).toBe(true);
    });

    it('should return false when API fails', async () => {
      mockFetchError(500);
      const result = await RadarModule.init();
      expect(result).toBe(false);
    });

    it('should fetch from RainViewer API', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();
      expect(fetch).toHaveBeenCalledWith(CONFIG.rainviewer.apiUrl);
    });

    it('should create tile layers with correct attribution', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      const tileLayerCalls = L.tileLayer.mock.calls;
      expect(tileLayerCalls.length).toBeGreaterThan(0);

      // Check that attribution includes rel="noopener noreferrer"
      const lastCall = tileLayerCalls[tileLayerCalls.length - 1];
      expect(lastCall[1].attribution).toContain('noopener');
      expect(lastCall[1].attribution).toContain('noreferrer');
    });
  });

  describe('getStatus', () => {
    it('should return current status', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      const status = RadarModule.getStatus();
      expect(status).toHaveProperty('isVisible');
      expect(status).toHaveProperty('isAnimating');
      expect(status).toHaveProperty('layerCount');
      expect(status).toHaveProperty('currentIndex');
    });

    it('should have correct layer count', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      const status = RadarModule.getStatus();
      // 3 past + 1 nowcast = 4 layers
      expect(status.layerCount).toBe(4);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle visibility state', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      // Starts visible (isVisible = true in module)
      const afterFirst = RadarModule.toggleVisibility();
      expect(afterFirst).toBe(false);

      const afterSecond = RadarModule.toggleVisibility();
      expect(afterSecond).toBe(true);
    });

    it('should update button active state', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      const btn = document.getElementById('btn-radar');

      RadarModule.toggleVisibility(); // now false
      expect(btn.classList.contains('active')).toBe(false);

      RadarModule.toggleVisibility(); // now true
      expect(btn.classList.contains('active')).toBe(true);
    });
  });

  describe('animation', () => {
    it('should not start animation with empty layers', async () => {
      mockFetchResponse({ radar: { past: [], nowcast: [] } });
      await RadarModule.init();

      RadarModule.startAnimation();
      const status = RadarModule.getStatus();
      expect(status.isAnimating).toBe(false);
    });

    it('should toggle animation state', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      RadarModule.toggleAnimation();
      expect(RadarModule.getStatus().isAnimating).toBe(true);

      RadarModule.toggleAnimation();
      expect(RadarModule.getStatus().isAnimating).toBe(false);
    });

    it('should show time slider when animating', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      const timeSlider = document.getElementById('time-slider');

      RadarModule.startAnimation();
      expect(timeSlider.style.display).toBe('flex');

      RadarModule.stopAnimation();
      expect(timeSlider.style.display).toBe('none');
    });
  });

  describe('setLayerBySlider', () => {
    it('should accept string values from slider', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      // Should not throw when passed string value
      expect(() => RadarModule.setLayerBySlider('2')).not.toThrow();
    });
  });

  describe('refresh', () => {
    it('should fetch new data', async () => {
      mockFetchResponse(mockRadarData);
      await RadarModule.init();

      mockFetchResponse(mockRadarData);
      await RadarModule.refresh();

      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty past array', async () => {
      mockFetchResponse({ radar: { past: [], nowcast: [{ time: Date.now() / 1000, path: '/test' }] } });
      const result = await RadarModule.init();
      expect(result).toBe(true);
    });
  });
});
