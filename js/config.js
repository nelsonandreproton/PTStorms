/**
 * PTStorms Configuration
 */
const CONFIG = {
    // Map settings
    map: {
        center: [39.5, -8.0],  // Centro de Portugal
        zoom: 7,
        minZoom: 5,
        maxZoom: 12,
        bounds: [
            [36.5, -10.5],  // SW corner
            [42.5, -6.0]    // NE corner
        ]
    },

    // RainViewer API
    rainviewer: {
        apiUrl: 'https://api.rainviewer.com/public/weather-maps.json',
        tileSize: 256,
        opacity: 0.7,
        colorScheme: 4,  // 1-8, different color schemes
        smoothData: 1,
        snowColors: 1
    },

    // IPMA API
    ipma: {
        warningsUrl: 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json',
        locationsUrl: 'https://api.ipma.pt/open-data/distrits-islands.json'
    },

    // Update intervals (ms)
    intervals: {
        radar: 5 * 60 * 1000,      // 5 minutes
        warnings: 10 * 60 * 1000,   // 10 minutes
        animation: 500              // Animation frame rate
    },

    // Precipitation intensity colors (dBZ scale)
    precipitationColors: [
        { min: 0, max: 5, color: 'transparent', label: 'Sem precipitação' },
        { min: 5, max: 20, color: '#88DDFF', label: 'Muito leve' },
        { min: 20, max: 30, color: '#0088FF', label: 'Leve' },
        { min: 30, max: 40, color: '#00FF00', label: 'Moderada' },
        { min: 40, max: 50, color: '#FFFF00', label: 'Forte' },
        { min: 50, max: 60, color: '#FF8800', label: 'Muito forte' },
        { min: 60, max: 100, color: '#FF0000', label: 'Extrema' }
    ],

    // IPMA warning colors
    warningColors: {
        green: { color: '#48bb78', label: 'Verde - Normal' },
        yellow: { color: '#ecc94b', label: 'Amarelo - Atenção' },
        orange: { color: '#ed8936', label: 'Laranja - Moderado' },
        red: { color: '#f56565', label: 'Vermelho - Extremo' }
    },

    // IPMA warning types translation
    warningTypes: {
        'Precipitação': 'Precipitação',
        'Trovoada': 'Trovoada',
        'Agitação Marítima': 'Agitação Marítima',
        'Vento': 'Vento',
        'Nevoeiro': 'Nevoeiro',
        'Neve': 'Neve',
        'Tempo Quente': 'Tempo Quente',
        'Tempo Frio': 'Tempo Frio'
    },

    // Portuguese districts for mapping
    districts: {
        'AVR': { name: 'Aveiro', coords: [40.64, -8.65] },
        'BJA': { name: 'Beja', coords: [38.02, -7.87] },
        'BRG': { name: 'Braga', coords: [41.55, -8.43] },
        'BGC': { name: 'Bragança', coords: [41.81, -6.76] },
        'CBR': { name: 'Castelo Branco', coords: [39.82, -7.49] },
        'COI': { name: 'Coimbra', coords: [40.21, -8.43] },
        'EVR': { name: 'Évora', coords: [38.57, -7.91] },
        'FAR': { name: 'Faro', coords: [37.02, -7.93] },
        'GDA': { name: 'Guarda', coords: [40.54, -7.27] },
        'LRA': { name: 'Leiria', coords: [39.75, -8.81] },
        'LSB': { name: 'Lisboa', coords: [38.72, -9.14] },
        'PTG': { name: 'Portalegre', coords: [39.29, -7.43] },
        'PTO': { name: 'Porto', coords: [41.15, -8.61] },
        'STM': { name: 'Santarém', coords: [39.24, -8.69] },
        'STB': { name: 'Setúbal', coords: [38.52, -8.89] },
        'VCT': { name: 'Viana do Castelo', coords: [41.69, -8.83] },
        'VRL': { name: 'Vila Real', coords: [41.30, -7.74] },
        'VSE': { name: 'Viseu', coords: [40.66, -7.91] },
        'MCN': { name: 'Madeira - Costa Norte', coords: [32.75, -17.0] },
        'MCS': { name: 'Madeira - Costa Sul', coords: [32.65, -16.9] },
        'MRM': { name: 'Madeira - Regiões Montanhosas', coords: [32.72, -16.95] },
        'MPS': { name: 'Porto Santo', coords: [33.07, -16.34] },
        'AOR': { name: 'Açores - Grupo Oriental', coords: [37.78, -25.5] },
        'ACE': { name: 'Açores - Grupo Central', coords: [38.72, -27.22] },
        'AOC': { name: 'Açores - Grupo Ocidental', coords: [39.45, -31.13] }
    }
};
