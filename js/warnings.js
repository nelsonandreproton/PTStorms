/**
 * Warnings Module - IPMA warnings integration
 */
const WarningsModule = (function() {
    let warnings = [];
    let warningMarkers = [];
    let isVisible = false;

    /**
     * Fetch warnings from IPMA API
     */
    async function fetchWarnings() {
        try {
            const response = await fetch(CONFIG.ipma.warningsUrl);
            if (!response.ok) throw new Error('Failed to fetch warnings');

            const data = await response.json();
            warnings = processWarnings(data);
            return warnings;
        } catch (error) {
            console.error('Error fetching IPMA warnings:', error);
            // Return empty array on error to not break the app
            warnings = [];
            return warnings;
        }
    }

    /**
     * Process raw IPMA warnings data
     */
    function processWarnings(data) {
        if (!data || !Array.isArray(data)) return [];

        const now = new Date();

        return data
            .filter(warning => {
                // Filter active warnings only
                const endTime = new Date(warning.endTime);
                return endTime > now && warning.awarenessLevelID !== 'green';
            })
            .map(warning => ({
                id: warning.idAreaAviso,
                type: warning.awarenessTypeName,
                level: mapWarningLevel(warning.awarenessLevelID),
                levelId: warning.awarenessLevelID,
                region: getRegionName(warning.idAreaAviso),
                coords: getRegionCoords(warning.idAreaAviso),
                startTime: new Date(warning.startTime),
                endTime: new Date(warning.endTime),
                text: warning.text || ''
            }))
            .sort((a, b) => {
                // Sort by severity (red > orange > yellow)
                const levelOrder = { red: 0, orange: 1, yellow: 2 };
                return levelOrder[a.level] - levelOrder[b.level];
            });
    }

    /**
     * Map IPMA awareness level to color
     */
    function mapWarningLevel(levelId) {
        const levelMap = {
            'yellow': 'yellow',
            'orange': 'orange',
            'red': 'red',
            'green': 'green'
        };
        return levelMap[levelId] || 'yellow';
    }

    /**
     * Get region name from ID
     */
    function getRegionName(id) {
        const district = CONFIG.districts[id];
        return district ? district.name : id;
    }

    /**
     * Get region coordinates from ID
     */
    function getRegionCoords(id) {
        const district = CONFIG.districts[id];
        return district ? district.coords : null;
    }

    /**
     * Initialize warnings
     */
    async function init() {
        try {
            await fetchWarnings();
            updateWarningsPanel();
            return true;
        } catch (error) {
            console.error('Error initializing warnings:', error);
            return false;
        }
    }

    /**
     * Create warning marker icon
     */
    function createWarningIcon(level) {
        const colors = {
            yellow: '#ecc94b',
            orange: '#ed8936',
            red: '#f56565'
        };

        return L.divIcon({
            className: 'warning-marker',
            html: `
                <div style="
                    width: 28px;
                    height: 28px;
                    background: ${colors[level] || colors.yellow};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="${level === 'red' ? 'white' : '#1a1a2e'}">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
    }

    /**
     * Add warning markers to map
     */
    function addMarkersToMap() {
        const map = MapModule.getMap();

        // Clear existing markers
        clearMarkers();

        warnings.forEach(warning => {
            if (!warning.coords) return;

            const marker = L.marker(warning.coords, {
                icon: createWarningIcon(warning.level)
            });

            // Create popup content
            const popupContent = `
                <div class="popup-title">${warning.type}</div>
                <div class="popup-info">
                    <strong>Região:</strong> ${warning.region}<br>
                    <strong>Nível:</strong> <span style="color: ${CONFIG.warningColors[warning.level].color}">${warning.level.toUpperCase()}</span><br>
                    <strong>Início:</strong> ${formatDateTime(warning.startTime)}<br>
                    <strong>Fim:</strong> ${formatDateTime(warning.endTime)}
                    ${warning.text ? `<br><br>${warning.text}` : ''}
                </div>
            `;

            marker.bindPopup(popupContent);
            warningMarkers.push(marker);

            if (isVisible) {
                marker.addTo(map);
            }
        });
    }

    /**
     * Clear all warning markers
     */
    function clearMarkers() {
        const map = MapModule.getMap();
        warningMarkers.forEach(marker => {
            if (map.hasLayer(marker)) {
                map.removeLayer(marker);
            }
        });
        warningMarkers = [];
    }

    /**
     * Format date time for display
     */
    function formatDateTime(date) {
        return date.toLocaleString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Update warnings panel in UI
     */
    function updateWarningsPanel() {
        const warningsList = document.getElementById('warnings-list');
        const warningsCount = document.getElementById('warnings-count');

        if (!warningsList) return;

        // Update count badge
        if (warningsCount) {
            warningsCount.textContent = warnings.length;
            warningsCount.classList.toggle('none', warnings.length === 0);
        }

        // Update list
        if (warnings.length === 0) {
            warningsList.innerHTML = '<p class="no-warnings">Sem avisos ativos</p>';
            return;
        }

        warningsList.innerHTML = warnings.map(warning => `
            <div class="warning-item ${warning.level}">
                <div class="warning-item-header">
                    <span class="warning-type">${warning.type}</span>
                    <span class="warning-level ${warning.level}">${warning.level}</span>
                </div>
                <div class="warning-region">${warning.region}</div>
                <div class="warning-time">
                    ${formatDateTime(warning.startTime)} - ${formatDateTime(warning.endTime)}
                </div>
            </div>
        `).join('');
    }

    /**
     * Toggle warnings visibility
     */
    function toggleVisibility() {
        isVisible = !isVisible;
        const map = MapModule.getMap();
        const panel = document.getElementById('warnings-panel');
        const btn = document.getElementById('btn-warnings');

        if (isVisible) {
            // Add markers to map
            warningMarkers.forEach(marker => marker.addTo(map));
            if (panel) panel.classList.add('visible');
        } else {
            // Remove markers from map
            warningMarkers.forEach(marker => {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            });
            if (panel) panel.classList.remove('visible');
        }

        if (btn) btn.classList.toggle('active', isVisible);

        return isVisible;
    }

    /**
     * Refresh warnings data
     */
    async function refresh() {
        await fetchWarnings();
        addMarkersToMap();
        updateWarningsPanel();
    }

    /**
     * Get warnings data
     */
    function getWarnings() {
        return warnings;
    }

    /**
     * Get warning count by level
     */
    function getWarningCounts() {
        return {
            total: warnings.length,
            red: warnings.filter(w => w.level === 'red').length,
            orange: warnings.filter(w => w.level === 'orange').length,
            yellow: warnings.filter(w => w.level === 'yellow').length
        };
    }

    return {
        init,
        refresh,
        toggleVisibility,
        getWarnings,
        getWarningCounts,
        addMarkersToMap
    };
})();
