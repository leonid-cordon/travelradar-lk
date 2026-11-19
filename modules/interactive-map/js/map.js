(function (global) {
    'use strict';

    var cfg = global.MAP_LAB_CONFIG;
    var guidesHelper = global.MAP_LAB_GUIDES;
    var panelFactory = global.MAP_LAB_PANEL;

    function buildWidgetMarkup(options) {
        var presets = cfg.presets;
        var initialPreset = options.initialPreset || 'overview';
        var showBrand = !options.embedded;
        var mobileFocusEnabled = Boolean(options.embedded && options.mobileFocus);
        var widgetClasses = [
            'tr-map-widget',
            options.embedded ? 'tr-map-widget--embedded' : 'tr-map-widget--fullscreen',
            mobileFocusEnabled ? 'tr-map-widget--mobile-focus-enabled' : ''
        ].filter(Boolean).join(' ');

        return [
            '<div class="' + widgetClasses + '">',
            '  <div class="tr-map-toolbar">',
            '    <div class="tr-toolbar-left">',
            showBrand
                ? '      <span class="tr-brand-pill">MAP LAB · TravelRadarLK</span>'
                : '      <span class="tr-brand-pill">INTERACTIVE MAP</span>',
            mobileFocusEnabled
                ? '      <button type="button" class="tr-focus-btn" data-role="mobile-focus-toggle" aria-expanded="false">Map Focus &#x2922;</button>'
                : '',
            '    </div>',
            '    <div class="tr-toolbar-groups">',
            '      <div class="tr-chip-row" data-group="presets" role="group" aria-label="Region views">',
            Object.keys(presets).map(function (key) {
                var p = presets[key];
                var activeClass = key === initialPreset ? ' is-active' : '';
                return '<button type="button" class="tr-chip' + activeClass + '" data-preset="' + key + '" title="' + p.fullLabel + '" aria-label="' + p.fullLabel + '">' + p.shortLabel + '</button>';
            }).join(''),
            '      </div>',
            '      <span class="tr-toolbar-divider" aria-hidden="true"></span>',
            '      <div class="tr-chip-row" data-group="filters" role="group" aria-label="Category filter">',
            '        <button type="button" class="tr-chip is-active" data-category="all">All<span class="tr-chip-count" data-count="all"></span></button>',
            '        <button type="button" class="tr-chip" data-category="resort">Resorts</button>',
            '        <button type="button" class="tr-chip" data-category="island">Islands</button>',
            '        <button type="button" class="tr-chip" data-category="airport">Airports</button>',
            '      </div>',
            '    </div>',
            '  </div>',
            '  <div class="tr-map-workspace">',
            '    <div class="tr-map-stage">',
            '      <div class="tr-map-canvas"></div>',
            '      <div class="tr-map-hud">',
            '        <div class="tr-hud-row">',
            options.showDebugHud
                ? [
                    '          <div class="tr-hud-pill tr-debug-pill" data-role="debug-hud" aria-live="polite">',
                    '            <span class="tr-zoom-val">Zoom: --</span>',
                    '            <span>·</span>',
                    '            <span class="tr-zoom-detail">Loading...</span>',
                    '          </div>'
                ].join('\n')
                : '',
            '          <div class="tr-hud-pill tr-hint-pill" data-role="onboarding-hint">',
            '            <i class="tr-dot tr-dot-resort" aria-hidden="true"></i>',
            '            <span>Select any destination for transfer times &amp; guides</span>',
            '          </div>',
            options.embedded
                ? '          <button type="button" class="tr-hud-pill tr-hud-btn" data-role="scroll-toggle" title="Click map or toggle to enable mouse-wheel zoom">Wheel: Page scroll</button>'
                : '',
            '        </div>',
            '        <div class="tr-hud-pill tr-legend-pill">',
            '          <span class="tr-legend-item"><i class="tr-dot tr-dot-resort"></i>Resort / Town</span>',
            '          <span class="tr-legend-item"><i class="tr-dot tr-dot-island"></i>Island</span>',
            '          <span class="tr-legend-item"><i class="tr-dot tr-dot-airport"></i>Airport</span>',
            '        </div>',
            '      </div>',
            '      <div class="tr-map-toast" hidden></div>',
            '    </div>',
            '    <aside class="tr-info-panel" aria-label="Location details" hidden>',
            '      <div class="tr-panel-header">',
            '        <span class="tr-panel-badge">Category · Region</span>',
            '        <div class="tr-panel-actions">',
            '          <button type="button" class="tr-panel-expand-btn">More &amp; Guides &uarr;</button>',
            '          <button type="button" class="tr-panel-close-btn" aria-label="Close details panel">&times;</button>',
            '        </div>',
            '      </div>',
            '      <div class="tr-panel-body">',
            '        <h3 class="tr-panel-title">Select a location</h3>',
            '        <p class="tr-panel-verdict" hidden></p>',
            '        <div class="tr-panel-photo-wrap"><img class="tr-panel-photo" src="" alt=""></div>',
            '        <div class="tr-facts-grid"></div>',
            '        <div class="tr-panel-tabs" role="tablist">',
            '          <button type="button" class="tr-tab-btn is-active" data-tab="overview" role="tab" aria-selected="true">Overview</button>',
            '          <button type="button" class="tr-tab-btn" data-tab="logistics" role="tab" aria-selected="false">Logistics</button>',
            '          <button type="button" class="tr-tab-btn" data-tab="details" role="tab" aria-selected="false">Coast &amp; Season</button>',
            '        </div>',
            '        <div class="tr-tab-pane" data-pane="overview">',
            '          <p class="tr-panel-desc"></p>',
            '          <div class="tr-callout tr-callout--good" data-role="best-for-wrap" hidden>',
            '            <span class="tr-callout-title">Best for</span>',
            '            <p class="tr-callout-text" data-role="best-for-text"></p>',
            '          </div>',
            '          <div class="tr-callout tr-callout--warn" data-role="watch-out-wrap" hidden>',
            '            <span class="tr-callout-title">Watch out</span>',
            '            <p class="tr-callout-text" data-role="watch-out-text"></p>',
            '          </div>',
            '        </div>',
            '        <div class="tr-tab-pane" data-pane="logistics" hidden>',
            '          <p class="tr-panel-desc" data-role="logistics-text"></p>',
            '        </div>',
            '        <div class="tr-tab-pane" data-pane="details" hidden>',
            '          <p class="tr-panel-desc" data-role="details-text"></p>',
            '          <div class="tr-transfer-list" hidden></div>',
            '        </div>',
            '        <div class="tr-guides-block" hidden>',
            '          <h4 class="tr-guides-heading">TravelRadarLK Guides</h4>',
            '          <div class="tr-guides-list"></div>',
            '          <a class="tr-hub-cta" href="/en/mexico/">Explore Planning Hub &rarr;</a>',
            '        </div>',
            '        <p class="tr-panel-coords"></p>',
            '      </div>',
            '    </aside>',
            '  </div>',
            '</div>'
        ].join('\n');
    }

    function isNameTextField(expr) {
        if (!expr) return false;
        if (typeof expr === 'string') return /\{name/i.test(expr);
        return /\bname(?::|_|\b)/i.test(JSON.stringify(expr));
    }

    function applyEnglishLabels(targetMap) {
        var style = targetMap.getStyle();
        if (!style || !Array.isArray(style.layers)) return;

        var englishExpr = [
            'case',
            ['!=', ['coalesce', ['get', 'name:en'], ''], ''],
            ['get', 'name:en'],
            ['!=', ['coalesce', ['get', 'name_en'], ''], ''],
            ['get', 'name_en'],
            ['!=', ['coalesce', ['get', 'name:latin'], ''], ''],
            ['get', 'name:latin'],
            ['get', 'name']
        ];

        style.layers.forEach(function (layer) {
            if (layer.type !== 'symbol' || !layer.layout || !layer.layout['text-field']) return;
            if (isNameTextField(layer.layout['text-field'])) {
                targetMap.setLayoutProperty(layer.id, 'text-field', englishExpr);
            }
        });
    }

    function mount(containerEl, userOptions) {
        if (!containerEl) throw new Error('TravelRadarMap.mount: container element is required.');

        var options = Object.assign({
            initialPreset: 'overview',
            embedded: false,
            mobileFocus: undefined,
            showDebugHud: undefined,
            hubRegion: undefined,
            linkLang: undefined,
            headerSelector: '#site-header .header, #site-header',
            dataUrl: cfg.dataUrl,
            contentIndexUrl: cfg.contentIndexUrl
        }, userOptions || {});

        if (typeof options.mobileFocus === 'undefined') {
            options.mobileFocus = Boolean(options.embedded);
        }
        if (typeof options.showDebugHud === 'undefined') {
            options.showDebugHud = !options.embedded;
        }
        if (typeof options.hubRegion === 'undefined') {
            options.hubRegion = (options.embedded && options.initialPreset && options.initialPreset !== 'overview')
                ? options.initialPreset
                : null;
        }
        options.linkLang = guidesHelper.normalizeLinkLang
            ? guidesHelper.normalizeLinkLang(options.linkLang)
            : (options.linkLang || 'en');

        containerEl.innerHTML = buildWidgetMarkup(options);

        var widgetEl = containerEl.querySelector('.tr-map-widget');
        var canvasEl = widgetEl.querySelector('.tr-map-canvas');
        var stageEl = widgetEl.querySelector('.tr-map-stage');
        var zoomValEl = widgetEl.querySelector('.tr-zoom-val');
        var zoomDetailEl = widgetEl.querySelector('.tr-zoom-detail');
        var onboardingHintEl = widgetEl.querySelector('[data-role="onboarding-hint"]');
        var toastEl = widgetEl.querySelector('.tr-map-toast');
        var scrollToggleBtn = widgetEl.querySelector('[data-role="scroll-toggle"]');
        var mobileFocusBtn = widgetEl.querySelector('[data-role="mobile-focus-toggle"]');
        var presetsRow = widgetEl.querySelector('[data-group="presets"]');
        var filtersRow = widgetEl.querySelector('[data-group="filters"]');

        var selectedId = null;
        var activePreset = options.initialPreset || 'overview';
        var activeCategory = 'all';
        var featuresById = Object.create(null);
        var allFeatures = [];
        var pendingFocus = null;
        var map = null;
        var isMobileFocus = false;
        var savedScrollY = 0;
        var pushedFocusHistory = false;
        var pushedPanelHistory = false;
        var skipPopstateCount = 0;
        var indexPromise = guidesHelper.loadIndex(options.contentIndexUrl, options.linkLang);

        function showError(msg) {
            if (!toastEl) return;
            toastEl.textContent = msg;
            toastEl.hidden = false;
        }

        function getFeaturesForPreset(presetKey) {
            if (!presetKey || presetKey === 'overview') return allFeatures;
            return allFeatures.filter(function (f) {
                return f && f.properties && f.properties.region === presetKey;
            });
        }

        function updateFilterCounts() {
            var countBadge = widgetEl.querySelector('[data-count="all"]');
            if (!countBadge) return;
            var regionFeatures = getFeaturesForPreset(activePreset);
            countBadge.textContent = ' (' + regionFeatures.length + ')';
        }

        function setSelectedFeature(id) {
            selectedId = id || null;
            if (!map || !map.getLayer('places-selected')) return;
            map.setFilter('places-selected', ['==', ['get', 'id'], selectedId || '__none__']);
        }

        function setCategoryFilter(category) {
            activeCategory = category || 'all';
            if (filtersRow) {
                filtersRow.querySelectorAll('.tr-chip').forEach(function (c) {
                    c.classList.toggle('is-active', c.getAttribute('data-category') === activeCategory);
                });
            }
            var filterExpr = activeCategory === 'all' ? null : ['==', ['get', 'category'], activeCategory];
            if (map && map.getLayer('places-circle')) map.setFilter('places-circle', filterExpr);
            if (map && map.getLayer('places-label')) map.setFilter('places-label', filterExpr);
        }

        function pushFocusHistory() {
            if (!global.history || typeof global.history.pushState !== 'function') return;
            if (!pushedFocusHistory && (!global.history.state || !global.history.state.trMapFocus)) {
                global.history.pushState({ trMapFocus: true }, '');
                pushedFocusHistory = true;
            }
        }

        function pushPanelHistory() {
            if (!isMobileFocus || !global.history || typeof global.history.pushState !== 'function') return;
            if (!pushedPanelHistory && (!global.history.state || !global.history.state.trMapPanel)) {
                global.history.pushState({ trMapFocus: true, trMapPanel: true }, '');
                pushedPanelHistory = true;
            }
        }

        var panel = panelFactory.create(
            widgetEl,
            function (isOpen, meta) {
                meta = meta || {};
                if (isOpen) {
                    pushPanelHistory();
                    if (!meta.alreadyOpen && map) {
                        map.resize();
                    }
                } else {
                    setSelectedFeature(null);
                    if (!meta.fromPopstate && !meta.keepHistory && pushedPanelHistory) {
                        pushedPanelHistory = false;
                        if (global.history && typeof global.history.back === 'function' && global.history.state && global.history.state.trMapPanel) {
                            skipPopstateCount += 1;
                            global.history.back();
                        }
                    } else if (meta.fromPopstate) {
                        pushedPanelHistory = false;
                    }
                    if (map) {
                        map.resize();
                    }
                }
            },
            function (targetId, meta) {
                focusFeature(targetId, meta);
            },
            {
                hubRegion: options.hubRegion,
                linkLang: options.linkLang,
                onInPageHubCta: function (targetEl) {
                    var wasMobileFocus = isMobileFocus;
                    if (wasMobileFocus) {
                        exitMobileFocus(false);
                    }
                    if (targetEl && typeof targetEl.scrollIntoView === 'function') {
                        if (wasMobileFocus) {
                            setTimeout(function () {
                                targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
                            }, 60);
                        } else {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }
            }
        );

        function focusFeature(id, focusOpts) {
            if (!id) return false;
            focusOpts = focusOpts || {};

            if (!map || !allFeatures.length) {
                pendingFocus = { id: id, options: focusOpts };
                return false;
            }

            var feature = featuresById[id];
            if (!feature) return false;

            var props = feature.properties || {};
            var coords = feature.geometry && feature.geometry.coordinates;

            if (onboardingHintEl && !onboardingHintEl.hidden) {
                onboardingHintEl.hidden = true;
            }

            if (activeCategory !== 'all' && props.category && props.category !== activeCategory) {
                setCategoryFilter('all');
            }

            if (props.region && cfg.presets[props.region]) {
                if (activePreset !== 'overview' && activePreset !== props.region) {
                    activePreset = props.region;
                    if (presetsRow) {
                        presetsRow.querySelectorAll('.tr-chip').forEach(function (c) {
                            c.classList.toggle('is-active', c.getAttribute('data-preset') === props.region);
                        });
                    }
                    updateFilterCounts();
                }
            }

            setSelectedFeature(props.id);

            // Open panel FIRST (triggers synchronous map.resize() when opening from hidden state)
            panel.open(props, coords, indexPromise);

            if (Array.isArray(coords) && coords.length === 2) {
                var currentZoom = map.getZoom();
                var targetZoom;
                if (typeof focusOpts.zoom === 'number') {
                    targetZoom = focusOpts.zoom;
                } else if (focusOpts.source === 'map-click') {
                    targetZoom = currentZoom < 9.5 ? 9.5 : currentZoom;
                } else {
                    targetZoom = currentZoom < 9.8 ? 9.8 : (currentZoom > 12 ? 11.2 : currentZoom);
                }

                var easeOpts = {
                    center: coords,
                    zoom: targetZoom,
                    duration: typeof focusOpts.duration === 'number' ? focusOpts.duration : 550
                };

                if (mobileMq && mobileMq.matches && stageEl) {
                    easeOpts.padding = {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: Math.round(stageEl.clientHeight * 0.42)
                    };
                } else {
                    easeOpts.padding = { top: 0, left: 0, right: 0, bottom: 0 };
                }

                map.easeTo(easeOpts);
            }

            return true;
        }

        function updateZoomHud() {
            if (!map || !zoomValEl || !zoomDetailEl) return;
            var z = map.getZoom();
            zoomValEl.textContent = 'Zoom: ' + z.toFixed(2);
            if (z > cfg.nativeMaxZoom) {
                zoomDetailEl.textContent = 'Overzoom (scaled from z' + cfg.nativeMaxZoom + ')';
                zoomDetailEl.classList.add('is-overzoom');
            } else {
                zoomDetailEl.textContent = 'Native tiles (max z' + cfg.nativeMaxZoom + ')';
                zoomDetailEl.classList.remove('is-overzoom');
            }
        }

        function setScrollZoomActive(active) {
            if (!map || !options.embedded) return;
            if (active) {
                map.scrollZoom.enable();
            } else {
                map.scrollZoom.disable();
            }
            if (scrollToggleBtn) {
                scrollToggleBtn.classList.toggle('is-active', active);
                scrollToggleBtn.textContent = active ? 'Wheel: Map zoom' : 'Wheel: Page scroll';
            }
        }

        var initialPresetObj = cfg.presets[options.initialPreset] || cfg.presets.overview;

        map = new maplibregl.Map({
            container: canvasEl,
            style: cfg.styleUrl,
            bounds: initialPresetObj.bounds,
            fitBoundsOptions: { padding: initialPresetObj.padding },
            minZoom: cfg.minZoom,
            maxZoom: cfg.maxZoom,
            maxBounds: cfg.maxBounds,
            scrollZoom: !options.embedded,
            attributionControl: true
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
        map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-right');

        if (options.embedded) {
            if (scrollToggleBtn) {
                scrollToggleBtn.addEventListener('click', function () {
                    setScrollZoomActive(!map.scrollZoom.isEnabled());
                });
            }
            canvasEl.addEventListener('click', function () {
                if (!map.scrollZoom.isEnabled()) {
                    setScrollZoomActive(true);
                }
            });
            stageEl.addEventListener('mouseleave', function () {
                if (map.scrollZoom.isEnabled()) {
                    setScrollZoomActive(false);
                }
            });
        }

        map.on('zoom', updateZoomHud);
        map.on('load', updateZoomHud);

        map.on('error', function (e) {
            if (e && e.error && !map.loaded()) {
                showError('Map loading error: ' + e.error.message);
            }
        });

        map.on('style.load', function () {
            applyEnglishLabels(map);

            fetch(options.dataUrl)
                .then(function (resp) {
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    return resp.json();
                })
                .then(function (geojson) {
                    allFeatures = Array.isArray(geojson.features) ? geojson.features : [];
                    featuresById = Object.create(null);
                    allFeatures.forEach(function (f) {
                        if (f && f.properties && f.properties.id) {
                            featuresById[f.properties.id] = f;
                        }
                    });

                    updateFilterCounts();

                    map.addSource('places', {
                        type: 'geojson',
                        data: geojson
                    });

                    map.addLayer({
                        id: 'places-selected',
                        type: 'circle',
                        source: 'places',
                        filter: ['==', ['get', 'id'], '__none__'],
                        paint: {
                            'circle-radius': 15,
                            'circle-color': 'rgba(212, 169, 106, 0.25)',
                            'circle-stroke-width': 2.5,
                            'circle-stroke-color': '#ffffff'
                        }
                    });

                    map.addLayer({
                        id: 'places-circle',
                        type: 'circle',
                        source: 'places',
                        paint: {
                            'circle-radius': [
                                'interpolate', ['linear'], ['zoom'],
                                4, 5.5,
                                9, 7.5,
                                14, 9.5
                            ],
                            'circle-color': [
                                'match', ['get', 'category'],
                                'resort', '#d4a96a',
                                'island', '#38bdf8',
                                'airport', '#e07a5f',
                                '#d4a96a'
                            ],
                            'circle-stroke-width': 2,
                            'circle-stroke-color': '#0a0e27'
                        }
                    });

                    map.addLayer({
                        id: 'places-label',
                        type: 'symbol',
                        source: 'places',
                        layout: {
                            'text-field': ['get', 'shortName'],
                            'text-font': ['Noto Sans Bold'],
                            'text-size': [
                                'interpolate', ['linear'], ['zoom'],
                                4, 10.5,
                                10, 12.2
                            ],
                            'text-anchor': ['coalesce', ['get', 'labelAnchor'], 'top'],
                            'text-offset': [
                                'match', ['coalesce', ['get', 'labelAnchor'], 'top'],
                                'bottom', ['literal', [0, -1.05]],
                                'left', ['literal', [0.95, 0]],
                                'right', ['literal', [-0.95, 0]],
                                'bottom-left', ['literal', [0.75, -0.75]],
                                'top-left', ['literal', [0.75, 0.75]],
                                ['literal', [0, 1.1]]
                            ],
                            'text-padding': 3,
                            'text-allow-overlap': false,
                            'text-optional': true
                        },
                        paint: {
                            'text-color': '#0f172a',
                            'text-halo-color': 'rgba(255, 255, 255, 0.92)',
                            'text-halo-width': 1.8
                        }
                    });

                    var interactiveLayers = ['places-circle', 'places-label'];

                    function updateHoverCursor(e) {
                        if (!map) return;
                        var hits = map.queryRenderedFeatures(e.point, { layers: interactiveLayers });
                        map.getCanvas().style.cursor = hits.length > 0 ? 'pointer' : '';
                    }

                    interactiveLayers.forEach(function (layerId) {
                        map.on('mouseenter', layerId, updateHoverCursor);
                        map.on('mouseleave', layerId, updateHoverCursor);
                    });

                    map.on('click', function (e) {
                        var hits = map.queryRenderedFeatures(e.point, { layers: interactiveLayers });
                        if (hits.length > 0) {
                            var hitProps = hits[0].properties || {};
                            if (hitProps.id) {
                                focusFeature(hitProps.id, { source: 'map-click' });
                            }
                            return;
                        }
                        if (selectedId) {
                            panel.close();
                        }
                    });

                    updateZoomHud();

                    if (pendingFocus && pendingFocus.id) {
                        var pf = pendingFocus;
                        pendingFocus = null;
                        focusFeature(pf.id, pf.options);
                    }
                })
                .catch(function (err) {
                    showError('Failed to load places.geojson: ' + err.message);
                });
        });

        function activatePreset(presetKey) {
            var preset = cfg.presets[presetKey];
            if (!preset || !map) return;

            activePreset = presetKey;

            if (presetsRow) {
                presetsRow.querySelectorAll('.tr-chip').forEach(function (c) {
                    c.classList.toggle('is-active', c.getAttribute('data-preset') === presetKey);
                });
            }

            updateFilterCounts();

            if (selectedId && presetKey !== 'overview') {
                var selFeature = featuresById[selectedId];
                var selRegion = selFeature && selFeature.properties && selFeature.properties.region;
                if (selRegion && selRegion !== presetKey) {
                    panel.close();
                }
            }

            if (activeCategory !== 'all' && allFeatures.length > 0) {
                var regionFeatures = getFeaturesForPreset(presetKey);
                var hasCategoryInRegion = regionFeatures.some(function (f) {
                    return f && f.properties && f.properties.category === activeCategory;
                });
                if (!hasCategoryInRegion) {
                    setCategoryFilter('all');
                }
            }

            map.fitBounds(preset.bounds, {
                padding: preset.padding,
                duration: 700,
                maxZoom: 12
            });
        }

        // Region preset buttons
        if (presetsRow) {
            presetsRow.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-preset]');
                if (!btn) return;
                activatePreset(btn.getAttribute('data-preset'));
            });
        }

        // Category filter buttons
        if (filtersRow) {
            filtersRow.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-category]');
                if (!btn) return;
                var category = btn.getAttribute('data-category');

                setCategoryFilter(category);

                if (selectedId && category !== 'all') {
                    var selectedFeature = featuresById[selectedId];
                    var selectedCategory = selectedFeature && selectedFeature.properties && selectedFeature.properties.category;
                    if (selectedCategory !== category) {
                        panel.close();
                    }
                }
            });
        }

        function onKeyDown(e) {
            if (e.key === 'Escape') {
                if (panel.isOpen()) {
                    panel.close();
                } else if (isMobileFocus) {
                    exitMobileFocus(false);
                }
            }
        }
        document.addEventListener('keydown', onKeyDown);

        function measureHeaderOffset() {
            if (options.headerSelector) {
                var selectors = String(options.headerSelector).split(',');
                for (var i = 0; i < selectors.length; i++) {
                    var sel = selectors[i].trim();
                    if (!sel) continue;
                    var headerEl = document.querySelector(sel);
                    if (!headerEl) continue;
                    var rect = headerEl.getBoundingClientRect();
                    if (rect && rect.height > 0) {
                        return Math.round(rect.height);
                    }
                }
            }
            var rootHeight = parseInt(global.getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
            return rootHeight > 0 ? rootHeight : 0;
        }

        function syncMobileFocusViewport() {
            if (!isMobileFocus) return;
            var headerOffset = measureHeaderOffset();
            widgetEl.style.setProperty('--tr-header-offset', headerOffset + 'px');
            if (map) {
                setTimeout(function () { if (map) map.resize(); }, 40);
            }
        }

        function lockBackgroundScroll() {
            savedScrollY = window.scrollY || window.pageYOffset || 0;
            document.documentElement.classList.add('tr-map-scroll-lock');
            document.body.classList.add('tr-map-scroll-lock');
            document.body.style.position = 'fixed';
            document.body.style.top = (-savedScrollY) + 'px';
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
        }

        function unlockBackgroundScroll() {
            var htmlEl = document.documentElement;
            var bodyEl = document.body;
            var prevScrollBehavior = htmlEl.style.scrollBehavior;

            htmlEl.classList.remove('tr-map-scroll-lock');
            bodyEl.classList.remove('tr-map-scroll-lock');
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            bodyEl.style.left = '';
            bodyEl.style.right = '';
            bodyEl.style.width = '';

            htmlEl.style.scrollBehavior = 'auto';
            window.scrollTo(0, savedScrollY);
            htmlEl.style.scrollBehavior = prevScrollBehavior;
        }

        function enterMobileFocus() {
            if (isMobileFocus || !options.embedded || !options.mobileFocus) return;
            isMobileFocus = true;

            // Capture hub scroll & push history entries BEFORE locking body (fixed body collapses scrollY to 0)
            pushFocusHistory();
            if (panel.isOpen()) {
                pushPanelHistory();
            }

            lockBackgroundScroll();
            widgetEl.style.setProperty('--tr-header-offset', measureHeaderOffset() + 'px');
            widgetEl.classList.add('is-mobile-focus');

            if (mobileFocusBtn) {
                mobileFocusBtn.setAttribute('aria-expanded', 'true');
                mobileFocusBtn.innerHTML = '&larr; Back to Hub';
            }

            setTimeout(function () { if (map) map.resize(); }, 50);
        }

        function exitMobileFocus(fromPopstate) {
            if (!isMobileFocus) return;
            isMobileFocus = false;
            widgetEl.classList.remove('is-mobile-focus');
            widgetEl.style.removeProperty('--tr-header-offset');
            unlockBackgroundScroll();

            if (mobileFocusBtn) {
                mobileFocusBtn.setAttribute('aria-expanded', 'false');
                mobileFocusBtn.innerHTML = 'Map Focus &#x2922;';
            }

            if (panel.isOpen()) {
                panel.close({ fromPopstate: true, keepHistory: true });
            }

            var stepsBack = 0;
            if (!fromPopstate) {
                if (pushedPanelHistory) stepsBack += 1;
                if (pushedFocusHistory) stepsBack += 1;
            }
            pushedPanelHistory = false;
            pushedFocusHistory = false;

            if (stepsBack > 0 && global.history && typeof global.history.go === 'function') {
                if (global.history.state && global.history.state.trMapFocus) {
                    skipPopstateCount += 1;
                    global.history.go(-stepsBack);
                }
            }

            setTimeout(function () { if (map) map.resize(); }, 50);
        }

        if (mobileFocusBtn) {
            mobileFocusBtn.addEventListener('click', function () {
                if (isMobileFocus) {
                    exitMobileFocus(false);
                } else {
                    enterMobileFocus();
                }
            });
        }

        function onPopState(e) {
            if (skipPopstateCount > 0) {
                skipPopstateCount -= 1;
                return;
            }
            if (!isMobileFocus) return;

            var state = (e && e.state) || (global.history && global.history.state);
            if (panel.isOpen() && state && state.trMapFocus && !state.trMapPanel) {
                pushedPanelHistory = false;
                panel.close({ fromPopstate: true });
                return;
            }

            exitMobileFocus(true);
        }
        global.addEventListener('popstate', onPopState);

        var mobileMq = global.matchMedia ? global.matchMedia('(max-width: 900px)') : null;
        function onViewportChange() {
            if (isMobileFocus && mobileMq && !mobileMq.matches) {
                exitMobileFocus(false);
                return;
            }
            syncMobileFocusViewport();
        }
        global.addEventListener('resize', onViewportChange);
        if (global.visualViewport) {
            global.visualViewport.addEventListener('resize', syncMobileFocusViewport);
        }

        return {
            focusFeature: focusFeature,
            getSelectedId: function () { return selectedId; },
            goToPreset: activatePreset,
            enterMobileFocus: enterMobileFocus,
            exitMobileFocus: function () { exitMobileFocus(false); },
            destroy: function () {
                if (isMobileFocus) exitMobileFocus(true);
                document.removeEventListener('keydown', onKeyDown);
                global.removeEventListener('popstate', onPopState);
                global.removeEventListener('resize', onViewportChange);
                if (global.visualViewport) {
                    global.visualViewport.removeEventListener('resize', syncMobileFocusViewport);
                }
                if (map) map.remove();
                containerEl.innerHTML = '';
            }
        };
    }

    global.TravelRadarMap = {
        mount: mount
    };
})(window);
