/**
 * Tests for CONFIG object
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { loadScript } from './setup.js';

beforeAll(() => {
  loadScript('js/config.js');
});

describe('CONFIG', () => {
  describe('map settings', () => {
    it('should have valid center coordinates for Portugal', () => {
      expect(CONFIG.map.center).toEqual([39.5, -8.0]);
    });

    it('should have reasonable zoom levels', () => {
      expect(CONFIG.map.zoom).toBe(7);
      expect(CONFIG.map.minZoom).toBeLessThan(CONFIG.map.zoom);
      expect(CONFIG.map.maxZoom).toBeGreaterThan(CONFIG.map.zoom);
    });

    it('should have valid bounds covering Portugal', () => {
      const [sw, ne] = CONFIG.map.bounds;
      expect(sw[0]).toBeLessThan(ne[0]); // SW lat < NE lat
      expect(sw[1]).toBeLessThan(ne[1]); // SW lng < NE lng
    });
  });

  describe('API URLs', () => {
    it('should have valid RainViewer API URL', () => {
      expect(CONFIG.rainviewer.apiUrl).toMatch(/^https:\/\/api\.rainviewer\.com/);
    });

    it('should have valid IPMA warnings URL', () => {
      expect(CONFIG.ipma.warningsUrl).toMatch(/^https:\/\/api\.ipma\.pt/);
    });
  });

  describe('intervals', () => {
    it('should have radar refresh interval of 5 minutes', () => {
      expect(CONFIG.intervals.radar).toBe(5 * 60 * 1000);
    });

    it('should have warnings refresh interval of 10 minutes', () => {
      expect(CONFIG.intervals.warnings).toBe(10 * 60 * 1000);
    });

    it('should have reasonable animation frame rate', () => {
      expect(CONFIG.intervals.animation).toBeGreaterThan(100);
      expect(CONFIG.intervals.animation).toBeLessThan(2000);
    });
  });

  describe('districts', () => {
    it('should have all mainland Portuguese districts', () => {
      const mainlandDistricts = ['AVR', 'BJA', 'BRG', 'BGC', 'CBR', 'COI', 'EVR',
        'FAR', 'GDA', 'LRA', 'LSB', 'PTG', 'PTO', 'STM', 'STB', 'VCT', 'VRL', 'VSE'];
      mainlandDistricts.forEach(code => {
        expect(CONFIG.districts).toHaveProperty(code);
        expect(CONFIG.districts[code]).toHaveProperty('name');
        expect(CONFIG.districts[code]).toHaveProperty('coords');
      });
    });

    it('should have Madeira regions', () => {
      expect(CONFIG.districts).toHaveProperty('MCN');
      expect(CONFIG.districts).toHaveProperty('MCS');
      expect(CONFIG.districts).toHaveProperty('MRM');
      expect(CONFIG.districts).toHaveProperty('MPS');
    });

    it('should have Azores regions', () => {
      expect(CONFIG.districts).toHaveProperty('AOR');
      expect(CONFIG.districts).toHaveProperty('ACE');
      expect(CONFIG.districts).toHaveProperty('AOC');
    });

    it('should have valid coordinates for all districts', () => {
      Object.values(CONFIG.districts).forEach(district => {
        expect(district.coords).toHaveLength(2);
        expect(district.coords[0]).toBeGreaterThan(30); // latitude
        expect(district.coords[0]).toBeLessThan(45);
        expect(district.coords[1]).toBeGreaterThan(-35); // longitude
        expect(district.coords[1]).toBeLessThan(-6);
      });
    });
  });

  describe('warning colors', () => {
    it('should have all warning levels defined', () => {
      expect(CONFIG.warningColors).toHaveProperty('green');
      expect(CONFIG.warningColors).toHaveProperty('yellow');
      expect(CONFIG.warningColors).toHaveProperty('orange');
      expect(CONFIG.warningColors).toHaveProperty('red');
    });

    it('should have valid hex colors', () => {
      Object.values(CONFIG.warningColors).forEach(warning => {
        expect(warning.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('precipitation colors', () => {
    it('should have precipitation levels in ascending order', () => {
      for (let i = 1; i < CONFIG.precipitationColors.length; i++) {
        expect(CONFIG.precipitationColors[i].min).toBe(CONFIG.precipitationColors[i-1].max);
      }
    });

    it('should start from 0 dBZ', () => {
      expect(CONFIG.precipitationColors[0].min).toBe(0);
    });
  });
});
