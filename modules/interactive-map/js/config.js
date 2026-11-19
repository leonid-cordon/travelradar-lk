(function (global) {
    'use strict';

    global.MAP_LAB_CONFIG = {
        styleUrl: 'https://tiles.openfreemap.org/styles/liberty',
        dataUrl: '/modules/interactive-map/data/places.geojson',
        contentIndexUrl: '/assets/data/content-index.en.json',
        localizedIndexUrls: {
            en: '/assets/data/content-index.en.json',
            ru: '/assets/data/content-index.ru.json',
            ua: '/assets/data/content-index.uk.json'
        },
        nativeMaxZoom: 14,
        minZoom: 4,
        maxZoom: 17,
        maxBounds: [
            [-93.5, 8.5],
            [-57.5, 28.5]
        ],
        hubUrls: {
            mexico: '/en/mexico/',
            'dominican-republic': '/en/dominican-republic/',
            caribbean: '/en/caribbean/'
        },
        hubLabels: {
            mexico: 'Explore Mexico Planning Hub',
            'dominican-republic': 'Explore Dominican Republic Hub',
            caribbean: 'Explore Caribbean Hub'
        },
        presets: {
            overview: {
                shortLabel: 'Overview',
                fullLabel: 'Overview: Eastern Mexico, Dominican Republic & Caribbean',
                bounds: [
                    [-90.2, 11.4],
                    [-59.4, 26.8]
                ],
                padding: 36
            },
            mexico: {
                shortLabel: 'E. Mexico',
                fullLabel: 'Eastern Mexico (Cancun, Holbox, Riviera Maya, Tulum)',
                bounds: [
                    [-87.95, 20.0],
                    [-86.45, 21.65]
                ],
                padding: 40
            },
            'dominican-republic': {
                shortLabel: 'DR',
                fullLabel: 'Dominican Republic',
                bounds: [
                    [-72.05, 17.45],
                    [-68.25, 20.05]
                ],
                padding: 40
            },
            caribbean: {
                shortLabel: 'Caribbean',
                fullLabel: 'Caribbean Islands',
                bounds: [
                    [-80.2, 11.8],
                    [-59.4, 26.8]
                ],
                padding: 36
            }
        }
    };
})(window);
