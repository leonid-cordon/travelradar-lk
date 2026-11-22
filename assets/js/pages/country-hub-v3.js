/* ==========================================================================
   TravelRadarLK — Country Hub Architecture v3 Controller (country-hub-v3.js)
   Pure Vanilla JS, zero external dependencies, ARIA-accessible, Mobile-First.
   Handles:
   1. 7-Zone Deep-Dive Explorer Tabs (zero off-screen updates)
   2. Mobile-First Problem Solver / Trip Helper Tabs
   3. Guide Library Cluster Filtering
   4. Sticky Section Nav Scrollspy with Mobile Horizontal Auto-Center
   ========================================================================== */

(function () {
    'use strict';

    function initZoneExplorer() {
        var tabList = document.querySelector('[data-role="zone-tabs"]');
        if (!tabList) return;

        var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[data-zone-tab]'));
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-zone-panel]'));
        if (!tabs.length || !panels.length) return;

        function activateZoneTab(zoneKey, shouldScrollIntoViewOnMobile) {
            tabs.forEach(function (tab) {
                var isMatch = tab.getAttribute('data-zone-tab') === zoneKey;
                tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
                if (isMatch && typeof tab.scrollIntoView === 'function') {
                    tabList.scrollTo({
                        left: tab.offsetLeft - tabList.clientWidth / 2 + tab.clientWidth / 2,
                        behavior: 'smooth'
                    });
                }
            });

            var activePanel = null;
            panels.forEach(function (panel) {
                var isMatch = panel.getAttribute('data-zone-panel') === zoneKey;
                panel.hidden = !isMatch;
                if (isMatch) activePanel = panel;
            });

            if (shouldScrollIntoViewOnMobile && activePanel && window.innerWidth < 768) {
                var rect = activePanel.getBoundingClientRect();
                if (rect.top < 110 || rect.top > window.innerHeight * 0.65) {
                    activePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                activateZoneTab(this.getAttribute('data-zone-tab'), true);
            });
        });
    }

    function initProblemSolver() {
        var scenarioBtns = Array.prototype.slice.call(document.querySelectorAll('[data-scenario-btn]'));
        var scenarioPanels = Array.prototype.slice.call(document.querySelectorAll('[data-scenario-panel]'));
        if (!scenarioBtns.length || !scenarioPanels.length) return;

        function activateScenario(key, userTriggered) {
            scenarioBtns.forEach(function (btn) {
                var isMatch = btn.getAttribute('data-scenario-btn') === key;
                btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
            });

            var activePanel = null;
            scenarioPanels.forEach(function (panel) {
                var isMatch = panel.getAttribute('data-scenario-panel') === key;
                panel.hidden = !isMatch;
                if (isMatch) activePanel = panel;
            });

            // On mobile (<900px), ensure the updated answer card is immediately visible in viewport
            if (userTriggered && activePanel && window.innerWidth < 900) {
                var rect = activePanel.getBoundingClientRect();
                var stickyOffset = 128;
                if (rect.top > window.innerHeight * 0.58 || rect.top < stickyOffset) {
                    var targetY = window.pageYOffset + rect.top - stickyOffset;
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
            }
        }

        scenarioBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                activateScenario(this.getAttribute('data-scenario-btn'), true);
            });
        });
    }

    function initLibraryFilters() {
        var filterBar = document.querySelector('[data-role="library-filters"]');
        if (!filterBar) return;

        var filterBtns = Array.prototype.slice.call(filterBar.querySelectorAll('[data-cluster-filter]'));
        var clusterCards = Array.prototype.slice.call(document.querySelectorAll('[data-cluster-id]'));
        if (!filterBtns.length || !clusterCards.length) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = this.getAttribute('data-cluster-filter') || 'all';

                filterBtns.forEach(function (b) {
                    var active = b === btn;
                    b.classList.toggle('is-active', active);
                    b.setAttribute('aria-pressed', active ? 'true' : 'false');
                });

                clusterCards.forEach(function (card) {
                    var cardCluster = card.getAttribute('data-cluster-id');
                    card.hidden = target !== 'all' && cardCluster !== target;
                });
            });
        });
    }

    function initScrollSpy() {
        var navList = document.querySelector('.country-nav-list');
        var navItems = Array.prototype.slice.call(document.querySelectorAll('.country-nav-item[href^="#"]'));
        if (!navItems.length) return;

        var navMap = new Map();
        var sections = [];

        navItems.forEach(function (item) {
            var id = item.getAttribute('href').slice(1);
            var section = document.getElementById(id);
            if (!section) return;
            sections.push(section);
            navMap.set(section, item);
        });

        if (!sections.length) return;

        function setActive(activeItem) {
            if (!activeItem) return;
            navItems.forEach(function (item) {
                var isMatch = item === activeItem;
                item.classList.toggle('active', isMatch);
                if (isMatch && navList && navList.scrollWidth > navList.clientWidth) {
                    var targetLeft = item.offsetLeft - navList.clientWidth / 2 + item.clientWidth / 2;
                    navList.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
                }
            });
        }

        function updateActive() {
            var current = sections[0];
            var offset = (window.scrollY || window.pageYOffset || 0) + 165;

            for (var i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop <= offset) {
                    current = sections[i];
                }
            }
            setActive(navMap.get(current));
        }

        var scrollTimer = null;
        window.addEventListener('scroll', function () {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActive, 50);
        }, { passive: true });

        updateActive();
    }

    function boot() {
        initZoneExplorer();
        initProblemSolver();
        initLibraryFilters();
        initScrollSpy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
