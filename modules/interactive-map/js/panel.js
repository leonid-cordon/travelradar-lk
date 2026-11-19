(function (global) {
    'use strict';

    var cfg = global.MAP_LAB_CONFIG;
    var guidesHelper = global.MAP_LAB_GUIDES;

    function clearEl(node) {
        while (node && node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function createFactCard(item, onSelectFeature) {
        var label = item && item.label ? item.label : '';
        var value = item && item.value ? item.value : '';
        var targets = item && Array.isArray(item.targets) ? item.targets : null;
        var targetId = item && item.targetId ? String(item.targetId) : '';
        var hasMultiTargets = Boolean(targets && targets.length > 0 && typeof onSelectFeature === 'function');
        var isSingleInteractive = Boolean(!hasMultiTargets && targetId && typeof onSelectFeature === 'function');

        var card = document.createElement(isSingleInteractive ? 'button' : 'div');
        if (isSingleInteractive) {
            card.type = 'button';
            card.className = 'tr-fact-card tr-fact-card--interactive';
            card.setAttribute('data-target-id', targetId);
            card.title = 'Focus ' + value + ' on map';
            card.addEventListener('click', function () {
                onSelectFeature(targetId, { source: 'fact-card' });
            });
        } else {
            card.className = hasMultiTargets ? 'tr-fact-card tr-fact-card--multi' : 'tr-fact-card';
        }

        var dt = document.createElement('span');
        dt.className = 'tr-fact-label';
        dt.textContent = label;
        card.appendChild(dt);

        if (hasMultiTargets) {
            var actionsWrap = document.createElement('div');
            actionsWrap.className = 'tr-fact-targets';
            targets.forEach(function (t) {
                if (!t || !t.targetId) return;
                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'tr-fact-target-btn';
                btn.setAttribute('data-target-id', String(t.targetId));
                btn.title = 'Focus ' + (t.label || t.targetId) + ' on map';
                btn.textContent = (t.label || t.targetId) + ' \u2192';
                btn.addEventListener('click', function () {
                    onSelectFeature(String(t.targetId), { source: 'fact-card' });
                });
                actionsWrap.appendChild(btn);
            });
            card.appendChild(actionsWrap);
            return card;
        }

        var dd = document.createElement('span');
        dd.className = 'tr-fact-value';
        dd.textContent = value || '\u2014';

        if (isSingleInteractive) {
            var arrow = document.createElement('span');
            arrow.className = 'tr-fact-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = ' \u2192';
            dd.appendChild(arrow);
        }

        card.appendChild(dd);
        return card;
    }

    function parseJsonArray(val) {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            try {
                var parsed = JSON.parse(val);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    function createPanelController(rootEl, onStateChange, onSelectFeature, panelOptions) {
        panelOptions = panelOptions || {};
        var workspaceEl = rootEl.querySelector('.tr-map-workspace');
        var panelEl = rootEl.querySelector('.tr-info-panel');
        var panelBodyEl = rootEl.querySelector('.tr-panel-body');
        var badgeEl = rootEl.querySelector('.tr-panel-badge');
        var titleEl = rootEl.querySelector('.tr-panel-title');
        var verdictEl = rootEl.querySelector('.tr-panel-verdict');
        var photoWrapEl = rootEl.querySelector('.tr-panel-photo-wrap');
        var photoEl = rootEl.querySelector('.tr-panel-photo');
        var factsEl = rootEl.querySelector('.tr-facts-grid');
        var tabsBarEl = rootEl.querySelector('.tr-panel-tabs');
        var tabBtns = rootEl.querySelectorAll('.tr-tab-btn');
        var tabPanes = rootEl.querySelectorAll('.tr-tab-pane');
        var descEl = rootEl.querySelector('.tr-panel-desc');
        var bestForWrapEl = rootEl.querySelector('[data-role="best-for-wrap"]');
        var bestForEl = rootEl.querySelector('[data-role="best-for-text"]');
        var watchOutWrapEl = rootEl.querySelector('[data-role="watch-out-wrap"]');
        var watchOutEl = rootEl.querySelector('[data-role="watch-out-text"]');
        var logisticsTextEl = rootEl.querySelector('[data-role="logistics-text"]');
        var thirdTabBtn = rootEl.querySelector('[data-tab="details"]');
        var detailsTextEl = rootEl.querySelector('[data-role="details-text"]');
        var transferListEl = rootEl.querySelector('.tr-transfer-list');
        var guidesBlockEl = rootEl.querySelector('.tr-guides-block');
        var guidesListEl = rootEl.querySelector('.tr-guides-list');
        var hubCtaEl = rootEl.querySelector('.tr-hub-cta');
        var coordsEl = rootEl.querySelector('.tr-panel-coords');
        var expandBtn = rootEl.querySelector('.tr-panel-expand-btn');
        var closeBtn = rootEl.querySelector('.tr-panel-close-btn');

        var currentFeatureToken = 0;

        function setActiveTab(tabName) {
            tabBtns.forEach(function (btn) {
                var active = btn.getAttribute('data-tab') === tabName;
                btn.classList.toggle('is-active', active);
                btn.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            tabPanes.forEach(function (pane) {
                pane.hidden = pane.getAttribute('data-pane') !== tabName;
            });
        }

        if (tabsBarEl) {
            tabsBarEl.addEventListener('click', function (e) {
                var btn = e.target.closest('.tr-tab-btn');
                if (!btn) return;
                setActiveTab(btn.getAttribute('data-tab'));
            });
        }

        if (expandBtn) {
            expandBtn.addEventListener('click', function () {
                var expanded = panelEl.classList.toggle('is-expanded');
                expandBtn.textContent = expanded ? 'Map \u2193' : 'More & Guides \u2191';
            });
        }

        function closePanel(meta) {
            if (!panelEl || panelEl.hidden) return;
            panelEl.hidden = true;
            panelEl.classList.remove('is-expanded');
            if (expandBtn) expandBtn.textContent = 'More & Guides \u2191';
            if (workspaceEl) workspaceEl.classList.remove('has-open-panel');
            if (typeof onStateChange === 'function') onStateChange(false, meta || {});
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closePanel({ source: 'close-btn' });
            });
        }

        if (hubCtaEl) {
            hubCtaEl.addEventListener('click', function (e) {
                var inPageTarget = hubCtaEl.getAttribute('data-in-page-target');
                if (!inPageTarget) return;
                var targetEl = document.querySelector(inPageTarget);
                if (!targetEl) return;
                e.preventDefault();
                if (typeof panelOptions.onInPageHubCta === 'function') {
                    panelOptions.onInPageHubCta(targetEl);
                } else {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        function renderFacts(props) {
            clearEl(factsEl);
            var facts = parseJsonArray(props.facts);
            if (!facts.length) {
                factsEl.hidden = true;
                return;
            }
            factsEl.hidden = false;
            facts.forEach(function (item) {
                factsEl.appendChild(createFactCard(item, onSelectFeature));
            });
        }

        function renderTransfers(props) {
            clearEl(transferListEl);
            var rows = parseJsonArray(props.transferTimes);
            if (!rows.length) {
                transferListEl.hidden = true;
                return;
            }
            transferListEl.hidden = false;
            rows.forEach(function (row) {
                var targetId = row && row.targetId ? String(row.targetId) : '';
                var isInteractive = Boolean(targetId && typeof onSelectFeature === 'function');
                var rowEl = document.createElement(isInteractive ? 'button' : 'div');

                if (isInteractive) {
                    rowEl.type = 'button';
                    rowEl.className = 'tr-transfer-row tr-transfer-row--interactive';
                    rowEl.setAttribute('data-target-id', targetId);
                    rowEl.addEventListener('click', function () {
                        onSelectFeature(targetId, { source: 'transfer-row' });
                    });
                } else {
                    rowEl.className = 'tr-transfer-row';
                }

                var dest = document.createElement('span');
                dest.className = 'tr-transfer-dest';
                dest.textContent = row.dest;

                var meta = document.createElement('span');
                meta.className = 'tr-transfer-meta';

                var time = document.createElement('span');
                time.className = 'tr-transfer-time';
                time.textContent = row.time;
                meta.appendChild(time);

                if (isInteractive) {
                    var arrow = document.createElement('span');
                    arrow.className = 'tr-transfer-arrow';
                    arrow.setAttribute('aria-hidden', 'true');
                    arrow.textContent = '\u2192';
                    meta.appendChild(arrow);
                }

                rowEl.appendChild(dest);
                rowEl.appendChild(meta);
                transferListEl.appendChild(rowEl);
            });
        }

        function renderGuides(props, indexData) {
            clearEl(guidesListEl);
            var normalizedProps = Object.assign({}, props, {
                featuredSlugs: parseJsonArray(props.featuredSlugs),
                matchDestinations: parseJsonArray(props.matchDestinations)
            });

            var guides = guidesHelper.pickGuidesForFeature(indexData, normalizedProps, 4);

            guides.forEach(function (g) {
                var link = document.createElement('a');
                link.className = 'tr-guide-link';
                link.href = g.url;

                var meta = document.createElement('span');
                meta.className = 'tr-guide-meta';

                var tag = document.createElement('span');
                tag.className = 'tr-guide-tag';
                tag.textContent = g.section;

                var title = document.createElement('span');
                title.className = 'tr-guide-title';
                title.textContent = g.title;

                meta.appendChild(tag);
                meta.appendChild(title);

                var arrow = document.createElement('span');
                arrow.className = 'tr-guide-arrow';
                arrow.setAttribute('aria-hidden', 'true');
                arrow.textContent = '\u2192';

                link.appendChild(meta);
                link.appendChild(arrow);
                guidesListEl.appendChild(link);
            });

            var isSameHubRegion = Boolean(
                panelOptions.hubRegion &&
                props.region === panelOptions.hubRegion &&
                document.getElementById('mh-guides')
            );

            if (isSameHubRegion) {
                var regionShort = props.region === 'mexico' ? 'Mexico' : (props.regionLabel || 'Hub');
                hubCtaEl.href = '#mh-guides';
                hubCtaEl.setAttribute('data-in-page-target', '#mh-guides');
                hubCtaEl.textContent = 'Browse all ' + regionShort + ' guides below \u2193';
            } else {
                var baseHubUrl = cfg.hubUrls[props.region] || '/en/mexico/';
                var activeLang = panelOptions.linkLang || 'en';
                var hubUrl = baseHubUrl.replace(/^\/(en|ru|ua)\//i, '/' + activeLang + '/');
                var hubLabel = cfg.hubLabels[props.region] || 'Explore Planning Hub';
                hubCtaEl.removeAttribute('data-in-page-target');
                hubCtaEl.href = hubUrl;
                hubCtaEl.textContent = hubLabel + ' \u2192';
            }
            guidesBlockEl.hidden = false;
        }

        function openPanel(props, coordinates, indexPromise) {
            if (!panelEl || !props) return;

            var token = ++currentFeatureToken;
            var isFull = props.detailLevel === 'full';

            badgeEl.textContent = (props.categoryLabel || props.category) + ' \u00b7 ' + (props.regionLabel || '');
            titleEl.textContent = props.name || 'Location';

            if (props.verdict) {
                verdictEl.textContent = props.verdict;
                verdictEl.hidden = false;
            } else {
                verdictEl.hidden = true;
            }

            if (props.image) {
                photoEl.src = props.image;
                photoEl.alt = props.name ? props.name + ' photo' : '';
                photoWrapEl.hidden = false;
            } else {
                photoWrapEl.hidden = true;
            }

            renderFacts(props);

            descEl.textContent = props.description || '';

            if (isFull) {
                tabsBarEl.hidden = false;
                setActiveTab('overview');

                bestForEl.textContent = props.bestFor || '';
                bestForWrapEl.hidden = !props.bestFor;

                watchOutEl.textContent = props.watchOut || '';
                watchOutWrapEl.hidden = !props.watchOut;

                logisticsTextEl.textContent = props.logistics || '';

                if (props.category === 'airport') {
                    thirdTabBtn.textContent = 'Transfers';
                    detailsTextEl.textContent = props.seasonsNote || '';
                    detailsTextEl.hidden = !props.seasonsNote;
                    renderTransfers(props);
                } else {
                    thirdTabBtn.textContent = 'Coast & Season';
                    detailsTextEl.textContent = props.seasonsNote || '';
                    detailsTextEl.hidden = false;
                    clearEl(transferListEl);
                    transferListEl.hidden = true;
                }
            } else {
                // Basic geographical point (DR / Caribbean for now)
                tabsBarEl.hidden = true;
                setActiveTab('overview');
                bestForWrapEl.hidden = true;
                watchOutWrapEl.hidden = true;
                clearEl(transferListEl);
                transferListEl.hidden = true;
            }

            if (Array.isArray(coordinates) && coordinates.length === 2) {
                coordsEl.textContent = 'Coordinates: ' + coordinates[1].toFixed(4) + ', ' + coordinates[0].toFixed(4);
            } else {
                coordsEl.textContent = '';
            }

            // Show panel immediately, then populate Guides when index resolves
            renderGuides(props, null);
            if (indexPromise && typeof indexPromise.then === 'function') {
                indexPromise.then(function (indexData) {
                    if (token !== currentFeatureToken) return;
                    renderGuides(props, indexData);
                });
            }

            var wasOpen = !panelEl.hidden;
            panelEl.hidden = false;
            panelEl.classList.remove('is-expanded');
            if (panelBodyEl) panelBodyEl.scrollTop = 0;
            if (expandBtn) expandBtn.textContent = 'More & Guides \u2191';
            if (workspaceEl) workspaceEl.classList.add('has-open-panel');
            if (typeof onStateChange === 'function') onStateChange(true, { alreadyOpen: wasOpen });
        }

        return {
            open: openPanel,
            close: closePanel,
            isOpen: function () { return Boolean(panelEl && !panelEl.hidden); }
        };
    }

    global.MAP_LAB_PANEL = {
        create: createPanelController
    };
})(window);
