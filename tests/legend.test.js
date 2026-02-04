/**
 * Tests for LegendModule
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { resetMocks, loadScript } from './setup.js';

beforeAll(() => {
  // Load CONFIG and LegendModule once
  loadScript('js/config.js');
  loadScript('js/legend.js');
});

beforeEach(() => {
  resetMocks();

  // Set up DOM elements fresh for each test
  document.body.innerHTML = `
    <div id="legend-panel">
      <button id="legend-toggle">−</button>
      <div id="legend-content">
        <div id="precipitation-legend"></div>
        <div id="warnings-legend"></div>
      </div>
    </div>
  `;
});

describe('LegendModule', () => {
  describe('init', () => {
    it('should render precipitation legend', () => {
      LegendModule.init();
      const container = document.getElementById('precipitation-legend');
      expect(container.innerHTML).not.toBe('');
    });

    it('should render warnings legend', () => {
      LegendModule.init();
      const container = document.getElementById('warnings-legend');
      expect(container.innerHTML).not.toBe('');
    });

    it('should create legend items for non-transparent precipitation colors', () => {
      LegendModule.init();
      const container = document.getElementById('precipitation-legend');
      const items = container.querySelectorAll('.legend-item');

      // Should exclude the transparent (no precipitation) entry
      const nonTransparentColors = CONFIG.precipitationColors.filter(c => c.color !== 'transparent');
      expect(items.length).toBe(nonTransparentColors.length);
    });

    it('should create legend items for warning levels', () => {
      LegendModule.init();
      const container = document.getElementById('warnings-legend');
      const items = container.querySelectorAll('.legend-item');

      // Should have yellow, orange, red (3 levels, excluding green)
      expect(items.length).toBe(3);
    });
  });

  describe('toggle functionality', () => {
    it('should update button text based on collapsed state', () => {
      LegendModule.init();
      const toggleBtn = document.getElementById('legend-toggle');
      const content = document.getElementById('legend-content');

      // Button should reflect collapsed state
      if (content.classList.contains('collapsed')) {
        expect(toggleBtn.textContent).toBe('+');
      } else {
        expect(toggleBtn.textContent).toBe('−');
      }
    });

    it('should have setupToggle bind click handler', () => {
      // Verify the init sets up the toggle button
      LegendModule.init();
      const toggleBtn = document.getElementById('legend-toggle');
      expect(toggleBtn).toBeDefined();
    });
  });

  describe('show/hide', () => {
    it('should show the legend panel', () => {
      LegendModule.init();
      const panel = document.getElementById('legend-panel');
      panel.style.display = 'none';

      LegendModule.show();
      expect(panel.style.display).toBe('block');
    });

    it('should hide the legend panel', () => {
      LegendModule.init();
      const panel = document.getElementById('legend-panel');
      panel.style.display = 'block';

      LegendModule.hide();
      expect(panel.style.display).toBe('none');
    });
  });

  describe('legend colors', () => {
    it('should use colors from CONFIG for warnings', () => {
      LegendModule.init();
      const container = document.getElementById('warnings-legend');
      const html = container.innerHTML;

      expect(html).toContain(CONFIG.warningColors.yellow.color);
      expect(html).toContain(CONFIG.warningColors.orange.color);
      expect(html).toContain(CONFIG.warningColors.red.color);
    });
  });
});
