/**
 * Map Module - Leaflet map initialization and management
 */
const MapModule = (function() {
    let map = null;
    let baseLayer = null;

    /**
     * Initialize the Leaflet map
     */
    function init() {
        // Create map instance
        map = L.map('map', {
            center: CONFIG.map.center,
            zoom: CONFIG.map.zoom,
            minZoom: CONFIG.map.minZoom,
            maxZoom: CONFIG.map.maxZoom,
            zoomControl: true,
            attributionControl: true
        });

        // Set max bounds to keep focus on Portugal
        map.setMaxBounds([
            [CONFIG.map.bounds[0][0] - 5, CONFIG.map.bounds[0][1] - 5],
            [CONFIG.map.bounds[1][0] + 5, CONFIG.map.bounds[1][1] + 5]
        ]);

        // Add dark base layer (CartoDB Dark Matter)
        baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" rel="noopener noreferrer">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Add Portugal border highlight
        addPortugalBorder();

        return map;
    }

    /**
     * Add a subtle border around Portugal
     */
    function addPortugalBorder() {
        // Simplified Portugal mainland bounds
        const portugalBounds = [
            [42.15, -8.89], [42.08, -8.16], [41.87, -6.93], [41.64, -6.19],
            [41.30, -6.42], [40.96, -6.81], [40.24, -6.86], [39.67, -7.04],
            [39.45, -7.00], [39.03, -6.96], [38.73, -7.16], [38.02, -7.02],
            [37.95, -7.44], [37.02, -7.41], [36.96, -7.93], [36.97, -8.67],
            [37.13, -8.99], [37.85, -8.79], [38.72, -9.47], [38.78, -9.50],
            [39.36, -9.38], [39.58, -9.03], [40.03, -8.90], [40.56, -8.77],
            [41.14, -8.64], [41.87, -8.88], [42.15, -8.89]
        ];

        L.polyline(portugalBounds, {
            color: '#1a73e8',
            weight: 2,
            opacity: 0.5,
            dashArray: '5, 10'
        }).addTo(map);
    }

    /**
     * Get the map instance
     */
    function getMap() {
        return map;
    }

    /**
     * Fly to specific location
     */
    function flyTo(lat, lng, zoom = 10) {
        if (map) {
            map.flyTo([lat, lng], zoom, {
                duration: 1.5
            });
        }
    }

    /**
     * Reset view to Portugal
     */
    function resetView() {
        if (map) {
            map.flyTo(CONFIG.map.center, CONFIG.map.zoom, {
                duration: 1
            });
        }
    }

    /**
     * Add a layer to the map
     */
    function addLayer(layer) {
        if (map && layer) {
            layer.addTo(map);
        }
    }

    /**
     * Remove a layer from the map
     */
    function removeLayer(layer) {
        if (map && layer) {
            map.removeLayer(layer);
        }
    }

    return {
        init,
        getMap,
        flyTo,
        resetView,
        addLayer,
        removeLayer
    };
})();
