# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PTStorms is a real-time storm tracking web application for Portugal. It displays interactive maps with precipitation radar overlays (RainViewer) and meteorological warnings (IPMA - Instituto Português do Mar e da Atmosfera).

## Running the Application

No build step required - this is a static HTML/CSS/JS application.

```bash
# Option 1: Direct file open
# Just open index.html in a browser

# Option 2: Python server
python3 -m http.server 8000

# Option 3: Node.js
npx serve
```

Then visit http://localhost:8000

## Architecture

The application uses the **Revealing Module Pattern** (IIFE) with isolated concerns:

```
App (js/app.js)           - Main controller, event listeners, auto-refresh
├── MapModule (js/map.js)      - Leaflet initialization, layer management
├── RadarModule (js/radar.js)  - RainViewer API, animated tile layers
├── WarningsModule (js/warnings.js) - IPMA API, warning markers/panels
├── LegendModule (js/legend.js)     - UI legend rendering
└── CONFIG (js/config.js)      - Central configuration object
```

**Module communication**: Modules expose public APIs via return objects. App orchestrates initialization and coordinates between modules.

**Script loading order** (index.html): config.js → map.js → radar.js → warnings.js → legend.js → app.js

## Key Technical Details

**Data Sources**:
- RainViewer API: `https://api.rainviewer.com/public/weather-maps.json` - radar tiles, 5min refresh
- IPMA API: `https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json` - warnings, 10min refresh

**Map**: Leaflet.js with CartoDB Dark Matter tiles, centered on Portugal `[39.5, -8.0]`

**Districts mapping**: `CONFIG.districts` maps IPMA district codes (e.g., 'LSB') to names and coordinates for marker placement.

## Testing

```bash
npm install      # Install dependencies (first time only)
npm test         # Run all tests
npm run test:watch   # Run tests in watch mode
```

Tests use Vitest with jsdom. Test files are in `tests/` directory covering CONFIG, MapModule, RadarModule, WarningsModule, and LegendModule.

## Security

- **XSS Protection**: All API data is escaped via `escapeHtml()` before DOM insertion
- **CSP**: Content-Security-Policy meta tag restricts scripts/connections
- **External Links**: All `target="_blank"` links have `rel="noopener noreferrer"`

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on push to `main`.
