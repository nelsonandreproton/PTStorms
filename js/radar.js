/**
 * Radar Module - RainViewer API integration
 */
const RadarModule = (function() {
    let radarLayers = [];
    let currentLayerIndex = 0;
    let radarData = null;
    let animationTimer = null;
    let isAnimating = false;
    let isVisible = true;

    /**
     * Fetch radar data from RainViewer API
     */
    async function fetchRadarData() {
        try {
            const response = await fetch(CONFIG.rainviewer.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch radar data');

            radarData = await response.json();
            return radarData;
        } catch (error) {
            console.error('Error fetching radar data:', error);
            throw error;
        }
    }

    /**
     * Create radar tile layer
     */
    function createRadarLayer(path, opacity = CONFIG.rainviewer.opacity) {
        const colorScheme = CONFIG.rainviewer.colorScheme;
        const smooth = CONFIG.rainviewer.smoothData;
        const snow = CONFIG.rainviewer.snowColors;

        return L.tileLayer(
            `https://tilecache.rainviewer.com${path}/${CONFIG.rainviewer.tileSize}/{z}/{x}/{y}/${colorScheme}/${smooth}_${snow}.png`,
            {
                opacity: opacity,
                zIndex: 100,
                attribution: '<a href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer">RainViewer</a>'
            }
        );
    }

    /**
     * Initialize radar layers
     */
    async function init() {
        try {
            await fetchRadarData();
            await loadRadarLayers();
            showCurrentLayer();
            return true;
        } catch (error) {
            console.error('Error initializing radar:', error);
            return false;
        }
    }

    /**
     * Load all radar layers (past + nowcast)
     */
    async function loadRadarLayers() {
        // Clear existing layers
        clearLayers();

        if (!radarData || !radarData.radar) return;

        const map = MapModule.getMap();
        const { past, nowcast } = radarData.radar;

        // Load past frames
        if (past && past.length > 0) {
            past.forEach(frame => {
                const layer = createRadarLayer(frame.path);
                radarLayers.push({
                    layer,
                    time: frame.time * 1000,
                    type: 'past'
                });
            });
        }

        // Load nowcast (forecast) frames
        if (nowcast && nowcast.length > 0) {
            nowcast.forEach(frame => {
                const layer = createRadarLayer(frame.path);
                radarLayers.push({
                    layer,
                    time: frame.time * 1000,
                    type: 'nowcast'
                });
            });
        }

        // Set current layer to most recent past frame
        currentLayerIndex = past ? past.length - 1 : 0;
    }

    /**
     * Clear all radar layers
     */
    function clearLayers() {
        const map = MapModule.getMap();
        if (!map) return;
        radarLayers.forEach(({ layer }) => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
        radarLayers = [];
    }

    /**
     * Show specific layer by index
     */
    function showLayer(index) {
        const map = MapModule.getMap();
        if (!map) return;

        // Hide all layers
        radarLayers.forEach(({ layer }) => {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });

        // Show requested layer if visible
        if (isVisible && radarLayers[index]) {
            radarLayers[index].layer.addTo(map);
            currentLayerIndex = index;
            updateTimeLabel(radarLayers[index].time, radarLayers[index].type);
        }
    }

    /**
     * Show current (most recent) layer
     */
    function showCurrentLayer() {
        const pastCount = radarData?.radar?.past?.length || 0;
        currentLayerIndex = Math.max(0, pastCount - 1);
        showLayer(currentLayerIndex);
    }

    /**
     * Update time label display
     */
    function updateTimeLabel(timestamp, type) {
        const timeLabel = document.getElementById('time-label');
        const timeRange = document.getElementById('time-range');

        if (!timeLabel) return;

        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.round((timestamp - now.getTime()) / 60000);

        let label;
        if (Math.abs(diffMinutes) < 2) {
            label = 'Agora';
        } else if (diffMinutes < 0) {
            label = `Há ${Math.abs(diffMinutes)} min`;
        } else {
            label = `+${diffMinutes} min (previsão)`;
        }

        timeLabel.textContent = label;

        if (timeRange) {
            timeRange.value = currentLayerIndex;
            timeRange.max = radarLayers.length - 1;
        }
    }

    /**
     * Start animation
     */
    function startAnimation() {
        if (isAnimating || radarLayers.length === 0) return;

        isAnimating = true;
        const timeSlider = document.getElementById('time-slider');
        if (timeSlider) timeSlider.style.display = 'flex';

        let index = 0;
        animationTimer = setInterval(() => {
            showLayer(index);
            index = (index + 1) % radarLayers.length;
        }, CONFIG.intervals.animation);

        // Update button state
        const btn = document.getElementById('btn-animation');
        if (btn) btn.classList.add('active');
    }

    /**
     * Stop animation
     */
    function stopAnimation() {
        if (!isAnimating) return;

        isAnimating = false;
        if (animationTimer) {
            clearInterval(animationTimer);
            animationTimer = null;
        }

        // Show current layer
        showCurrentLayer();

        // Hide time slider
        const timeSlider = document.getElementById('time-slider');
        if (timeSlider) timeSlider.style.display = 'none';

        // Update button state
        const btn = document.getElementById('btn-animation');
        if (btn) btn.classList.remove('active');
    }

    /**
     * Toggle animation
     */
    function toggleAnimation() {
        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }

    /**
     * Toggle radar visibility
     */
    function toggleVisibility() {
        isVisible = !isVisible;
        const map = MapModule.getMap();

        if (isVisible) {
            showLayer(currentLayerIndex);
        } else if (map) {
            radarLayers.forEach(({ layer }) => {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
        }

        // Update button state
        const btn = document.getElementById('btn-radar');
        if (btn) {
            btn.classList.toggle('active', isVisible);
        }

        return isVisible;
    }

    /**
     * Refresh radar data
     */
    async function refresh() {
        const wasAnimating = isAnimating;
        if (wasAnimating) stopAnimation();

        await fetchRadarData();
        await loadRadarLayers();
        showCurrentLayer();

        if (wasAnimating) startAnimation();
    }

    /**
     * Set layer by time slider
     */
    function setLayerBySlider(value) {
        showLayer(parseInt(value, 10));
    }

    /**
     * Get radar status
     */
    function getStatus() {
        return {
            isVisible,
            isAnimating,
            layerCount: radarLayers.length,
            currentIndex: currentLayerIndex,
            lastUpdate: radarData?.generated ? new Date(radarData.generated * 1000) : null
        };
    }

    return {
        init,
        refresh,
        toggleAnimation,
        toggleVisibility,
        setLayerBySlider,
        getStatus,
        startAnimation,
        stopAnimation
    };
})();
