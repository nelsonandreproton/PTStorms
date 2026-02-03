/**
 * Legend Module - Color legend management
 */
const LegendModule = (function() {
    let isCollapsed = false;

    /**
     * Initialize legend
     */
    function init() {
        renderPrecipitationLegend();
        renderWarningsLegend();
        setupToggle();
    }

    /**
     * Render precipitation intensity legend
     */
    function renderPrecipitationLegend() {
        const container = document.getElementById('precipitation-legend');
        if (!container) return;

        const items = CONFIG.precipitationColors
            .filter(item => item.color !== 'transparent')
            .map(item => `
                <div class="legend-item">
                    <span class="legend-color" style="background: ${item.color}"></span>
                    <span>${item.label}</span>
                </div>
            `).join('');

        container.innerHTML = items;
    }

    /**
     * Render IPMA warnings legend
     */
    function renderWarningsLegend() {
        const container = document.getElementById('warnings-legend');
        if (!container) return;

        const levels = ['yellow', 'orange', 'red'];
        const labels = {
            yellow: 'Amarelo',
            orange: 'Laranja',
            red: 'Vermelho'
        };

        const items = levels.map(level => `
            <div class="legend-item">
                <span class="legend-color" style="background: ${CONFIG.warningColors[level].color}"></span>
                <span>${labels[level]}</span>
            </div>
        `).join('');

        container.innerHTML = items;
    }

    /**
     * Setup legend toggle button
     */
    function setupToggle() {
        const toggleBtn = document.getElementById('legend-toggle');
        const content = document.getElementById('legend-content');

        if (!toggleBtn || !content) return;

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            content.classList.toggle('collapsed', isCollapsed);
            toggleBtn.textContent = isCollapsed ? '+' : '−';
        });
    }

    /**
     * Show legend
     */
    function show() {
        const panel = document.getElementById('legend-panel');
        if (panel) panel.style.display = 'block';
    }

    /**
     * Hide legend
     */
    function hide() {
        const panel = document.getElementById('legend-panel');
        if (panel) panel.style.display = 'none';
    }

    return {
        init,
        show,
        hide
    };
})();
