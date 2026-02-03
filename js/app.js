/**
 * PTStorms - Main Application
 * Real-time storm tracking for Portugal
 */
const App = (function() {
    let refreshInterval = null;
    let warningsRefreshInterval = null;

    /**
     * Initialize the application
     */
    async function init() {
        console.log('PTStorms: Initializing...');

        showLoading(true);
        setStatus('loading', 'A carregar...');

        try {
            // Initialize map
            MapModule.init();
            console.log('PTStorms: Map initialized');

            // Initialize legend
            LegendModule.init();
            console.log('PTStorms: Legend initialized');

            // Initialize radar (parallel with warnings)
            const [radarSuccess, warningsSuccess] = await Promise.all([
                RadarModule.init(),
                WarningsModule.init()
            ]);

            if (radarSuccess) {
                console.log('PTStorms: Radar initialized');
            } else {
                console.warn('PTStorms: Radar initialization failed');
            }

            if (warningsSuccess) {
                console.log('PTStorms: Warnings initialized');
                WarningsModule.addMarkersToMap();
            } else {
                console.warn('PTStorms: Warnings initialization failed');
            }

            // Setup event listeners
            setupEventListeners();

            // Setup auto-refresh
            setupAutoRefresh();

            // Update status
            updateLastUpdate();
            setStatus('online', formatLastUpdate());

            showLoading(false);
            console.log('PTStorms: Ready!');

        } catch (error) {
            console.error('PTStorms: Initialization error', error);
            setStatus('error', 'Erro ao carregar');
            showLoading(false);
        }
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Refresh button
        const btnRefresh = document.getElementById('btn-refresh');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', handleRefresh);
        }

        // Animation button
        const btnAnimation = document.getElementById('btn-animation');
        if (btnAnimation) {
            btnAnimation.addEventListener('click', () => {
                RadarModule.toggleAnimation();
            });
        }

        // Radar toggle button
        const btnRadar = document.getElementById('btn-radar');
        if (btnRadar) {
            btnRadar.addEventListener('click', () => {
                RadarModule.toggleVisibility();
            });
        }

        // Warnings toggle button
        const btnWarnings = document.getElementById('btn-warnings');
        if (btnWarnings) {
            btnWarnings.addEventListener('click', () => {
                WarningsModule.toggleVisibility();
            });
        }

        // Time slider
        const timeRange = document.getElementById('time-range');
        if (timeRange) {
            timeRange.addEventListener('input', (e) => {
                RadarModule.setLayerBySlider(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboard(e) {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT') return;

        switch(e.key.toLowerCase()) {
            case 'r':
                handleRefresh();
                break;
            case ' ':
            case 'p':
                e.preventDefault();
                RadarModule.toggleAnimation();
                break;
            case 'l':
                RadarModule.toggleVisibility();
                break;
            case 'w':
                WarningsModule.toggleVisibility();
                break;
        }
    }

    /**
     * Handle refresh action
     */
    async function handleRefresh() {
        const btn = document.getElementById('btn-refresh');
        if (btn) btn.classList.add('loading');

        setStatus('loading', 'A atualizar...');

        try {
            await Promise.all([
                RadarModule.refresh(),
                WarningsModule.refresh()
            ]);

            updateLastUpdate();
            setStatus('online', formatLastUpdate());
        } catch (error) {
            console.error('Refresh error:', error);
            setStatus('error', 'Erro ao atualizar');
        } finally {
            if (btn) btn.classList.remove('loading');
        }
    }

    /**
     * Setup auto-refresh intervals
     */
    function setupAutoRefresh() {
        // Refresh radar every 5 minutes
        refreshInterval = setInterval(async () => {
            try {
                await RadarModule.refresh();
                updateLastUpdate();
                setStatus('online', formatLastUpdate());
            } catch (error) {
                console.error('Auto-refresh radar error:', error);
            }
        }, CONFIG.intervals.radar);

        // Refresh warnings every 10 minutes
        warningsRefreshInterval = setInterval(async () => {
            try {
                await WarningsModule.refresh();
            } catch (error) {
                console.error('Auto-refresh warnings error:', error);
            }
        }, CONFIG.intervals.warnings);
    }

    /**
     * Update last update timestamp
     */
    let lastUpdate = new Date();
    function updateLastUpdate() {
        lastUpdate = new Date();
    }

    /**
     * Format last update for display
     */
    function formatLastUpdate() {
        return `Atualizado: ${lastUpdate.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    /**
     * Set status indicator
     */
    function setStatus(status, text) {
        const indicator = document.getElementById('status-indicator');
        const updateText = document.getElementById('last-update');

        if (indicator) {
            indicator.className = 'status-indicator';
            if (status === 'loading') indicator.classList.add('loading');
            if (status === 'error') indicator.classList.add('error');
        }

        if (updateText) {
            updateText.textContent = text;
        }
    }

    /**
     * Show/hide loading overlay
     */
    function showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }

    /**
     * Cleanup on page unload
     */
    function cleanup() {
        if (refreshInterval) clearInterval(refreshInterval);
        if (warningsRefreshInterval) clearInterval(warningsRefreshInterval);
        RadarModule.stopAnimation();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        refresh: handleRefresh
    };
})();
