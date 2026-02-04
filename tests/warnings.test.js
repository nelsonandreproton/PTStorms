/**
 * Tests for WarningsModule
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { resetMocks, mockFetchResponse, mockFetchError, mockMap, loadScript } from './setup.js';

beforeAll(() => {
  // Set up DOM elements
  document.body.innerHTML = `
    <div id="map"></div>
    <div id="warnings-list"></div>
    <span id="warnings-count"></span>
    <div id="warnings-panel"></div>
    <button id="btn-warnings"></button>
  `;

  // Load modules in order
  loadScript('js/config.js');
  loadScript('js/map.js');
  loadScript('js/warnings.js');
});

beforeEach(() => {
  resetMocks();
  // Re-initialize MapModule for each test
  MapModule.init();
});

describe('WarningsModule', () => {
  describe('init', () => {
    it('should return true on successful initialization', async () => {
      mockFetchResponse([]);
      const result = await WarningsModule.init();
      expect(result).toBe(true);
    });

    it('should return true even when API fails (graceful degradation)', async () => {
      mockFetchError(500);
      const result = await WarningsModule.init();
      expect(result).toBe(true);
    });

    it('should fetch from IPMA API', async () => {
      mockFetchResponse([]);
      await WarningsModule.init();
      expect(fetch).toHaveBeenCalledWith(CONFIG.ipma.warningsUrl);
    });
  });

  describe('getWarnings', () => {
    it('should return empty array when no warnings', async () => {
      mockFetchResponse([]);
      await WarningsModule.init();
      expect(WarningsModule.getWarnings()).toEqual([]);
    });

    it('should filter out green level warnings', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      mockFetchResponse([
        { idAreaAviso: 'LSB', awarenessLevelID: 'green', awarenessTypeName: 'Test', startTime: new Date().toISOString(), endTime: futureDate },
        { idAreaAviso: 'PTO', awarenessLevelID: 'yellow', awarenessTypeName: 'Precipitação', startTime: new Date().toISOString(), endTime: futureDate },
      ]);
      await WarningsModule.init();
      const warnings = WarningsModule.getWarnings();
      expect(warnings).toHaveLength(1);
      expect(warnings[0].levelId).toBe('yellow');
    });

    it('should filter out expired warnings', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      mockFetchResponse([
        { idAreaAviso: 'LSB', awarenessLevelID: 'yellow', awarenessTypeName: 'Test', startTime: pastDate, endTime: pastDate },
      ]);
      await WarningsModule.init();
      expect(WarningsModule.getWarnings()).toHaveLength(0);
    });
  });

  describe('getWarningCounts', () => {
    it('should return correct counts by level', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const now = new Date().toISOString();
      mockFetchResponse([
        { idAreaAviso: 'LSB', awarenessLevelID: 'red', awarenessTypeName: 'Test', startTime: now, endTime: futureDate },
        { idAreaAviso: 'PTO', awarenessLevelID: 'orange', awarenessTypeName: 'Test', startTime: now, endTime: futureDate },
        { idAreaAviso: 'FAR', awarenessLevelID: 'yellow', awarenessTypeName: 'Test', startTime: now, endTime: futureDate },
        { idAreaAviso: 'BRG', awarenessLevelID: 'yellow', awarenessTypeName: 'Test', startTime: now, endTime: futureDate },
      ]);
      await WarningsModule.init();
      const counts = WarningsModule.getWarningCounts();
      expect(counts.total).toBe(4);
      expect(counts.red).toBe(1);
      expect(counts.orange).toBe(1);
      expect(counts.yellow).toBe(2);
    });
  });

  describe('toggleVisibility', () => {
    it('should toggle visibility state', async () => {
      mockFetchResponse([]);
      await WarningsModule.init();

      const first = WarningsModule.toggleVisibility();
      expect(first).toBe(true);

      const second = WarningsModule.toggleVisibility();
      expect(second).toBe(false);
    });

    it('should update panel visibility class', async () => {
      mockFetchResponse([]);
      await WarningsModule.init();

      const panel = document.getElementById('warnings-panel');

      WarningsModule.toggleVisibility(); // visible
      expect(panel.classList.contains('visible')).toBe(true);

      WarningsModule.toggleVisibility(); // hidden
      expect(panel.classList.contains('visible')).toBe(false);
    });
  });

  describe('XSS protection', () => {
    it('should escape HTML in warning text when rendered', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      mockFetchResponse([
        {
          idAreaAviso: 'LSB',
          awarenessLevelID: 'yellow',
          awarenessTypeName: '<script>alert("xss")</script>',
          startTime: new Date().toISOString(),
          endTime: futureDate,
          text: '<img src=x onerror=alert("xss")>'
        },
      ]);
      await WarningsModule.init();

      const warningsList = document.getElementById('warnings-list');
      expect(warningsList.innerHTML).not.toContain('<script>');
      expect(warningsList.innerHTML).not.toContain('onerror');
    });
  });
});
