(function (global) {
    'use strict';

    function boot() {
        var root = document.getElementById('map-lab-root');
        if (!root || !global.TravelRadarMap) return;

        var preset = root.getAttribute('data-preset') || 'overview';
        var embedded = root.getAttribute('data-embedded') === 'true';
        var focusAttr = root.getAttribute('data-mobile-focus');
        var mobileFocus = focusAttr === null ? embedded : focusAttr === 'true';
        var debugAttr = root.getAttribute('data-debug-hud');
        var showDebugHud = debugAttr === null ? !embedded : debugAttr === 'true';
        var hubRegionAttr = root.getAttribute('data-hub-region');
        var linkLangAttr = root.getAttribute('data-link-lang');

        var instance = global.TravelRadarMap.mount(root, {
            initialPreset: preset,
            embedded: embedded,
            mobileFocus: mobileFocus,
            showDebugHud: showDebugHud,
            hubRegion: hubRegionAttr || undefined,
            linkLang: linkLangAttr || undefined
        });

        global.TravelRadarMapInstance = instance;
        root._trMapInstance = instance;

        document.addEventListener('click', function (e) {
            var trigger = e.target.closest('[data-map-focus]');
            if (!trigger) return;
            var targetId = trigger.getAttribute('data-map-focus');
            if (!targetId || !instance || typeof instance.focusFeature !== 'function') return;

            e.preventDefault();

            var mapSection = document.getElementById('mh-choose-base') || root;
            if (mapSection && !root.contains(trigger)) {
                var rect = root.getBoundingClientRect();
                var vh = global.innerHeight || document.documentElement.clientHeight || 800;
                if (rect.top < 50 || rect.bottom > vh) {
                    mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            instance.focusFeature(targetId, { source: 'page-trigger' });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})(window);
