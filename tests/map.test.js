/**
 * Tests for MapModule
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { resetMocks, mockMap, mockLayer, loadScript } from './setup.js';

beforeAll(() => {
  // Set up DOM element
  document.body.innerHTML = '<div id="map"></div>';

  // Load modules in order
  loadScript('js/config.js');
  loadScript('js/map.js');
});

beforeEach(() => {
  resetMocks();
});

describe('MapModule', () => {
  describe('init', () => {
    it('should create a Leaflet map', () => {
      MapModule.init();
      expect(L.map).toHaveBeenCalledWith('map', expect.objectContaining({
        center: CONFIG.map.center,
        zoom: CONFIG.map.zoom,
      }));
    });

    it('should set min and max zoom from config', () => {
      MapModule.init();
      expect(L.map).toHaveBeenCalledWith('map', expect.objectContaining({
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom,
      }));
    });

    it('should add CartoDB dark tile layer', () => {
      MapModule.init();
      expect(L.tileLayer).toHaveBeenCalledWith(
        expect.stringContaining('cartocdn.com'),
        expect.any(Object)
      );
    });

    it('should add Portugal border polyline', () => {
      MapModule.init();
      expect(L.polyline).toHaveBeenCalled();
    });

    it('should include noopener noreferrer in attribution', () => {
      MapModule.init();
      const tileLayerCall = L.tileLayer.mock.calls[0];
      expect(tileLayerCall[1].attribution).toContain('noopener');
      expect(tileLayerCall[1].attribution).toContain('noreferrer');
    });

    it('should return the map instance', () => {
      const result = MapModule.init();
      expect(result).toBeDefined();
    });
  });

  describe('getMap', () => {
    it('should return the map instance after init', () => {
      MapModule.init();
      const map = MapModule.getMap();
      expect(map).toBeDefined();
    });
  });

  describe('flyTo', () => {
    it('should call map.flyTo with coordinates', () => {
      MapModule.init();
      MapModule.flyTo(38.72, -9.14, 10);
      expect(mockMap.flyTo).toHaveBeenCalledWith(
        [38.72, -9.14],
        10,
        expect.objectContaining({ duration: 1.5 })
      );
    });

    it('should use default zoom if not specified', () => {
      MapModule.init();
      MapModule.flyTo(38.72, -9.14);
      expect(mockMap.flyTo).toHaveBeenCalledWith(
        [38.72, -9.14],
        10,
        expect.any(Object)
      );
    });
  });

  describe('resetView', () => {
    it('should fly to Portugal center', () => {
      MapModule.init();
      MapModule.resetView();
      expect(mockMap.flyTo).toHaveBeenCalledWith(
        CONFIG.map.center,
        CONFIG.map.zoom,
        expect.objectContaining({ duration: 1 })
      );
    });
  });

  describe('addLayer', () => {
    it('should add layer to map', () => {
      MapModule.init();
      MapModule.addLayer(mockLayer);
      expect(mockLayer.addTo).toHaveBeenCalled();
    });

    it('should handle null layer gracefully', () => {
      MapModule.init();
      expect(() => MapModule.addLayer(null)).not.toThrow();
    });
  });

  describe('removeLayer', () => {
    it('should remove layer from map', () => {
      MapModule.init();
      MapModule.removeLayer(mockLayer);
      expect(mockMap.removeLayer).toHaveBeenCalledWith(mockLayer);
    });

    it('should handle null layer gracefully', () => {
      MapModule.init();
      expect(() => MapModule.removeLayer(null)).not.toThrow();
    });
  });
});
