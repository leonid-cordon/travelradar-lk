/* Country hub scrollspy */

(function () {
    'use strict';

    function init() {
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

            item.addEventListener('click', function () {
                setActive(item);
            });
        });

        if (!sections.length) return;

        function setActive(activeItem) {
            navItems.forEach(function (item) {
                item.classList.toggle('active', item === activeItem);
            });
        }

        function updateActive() {
            var current = sections[0];
            var offset = window.scrollY + 160;

            sections.forEach(function (section) {
                if (section.offsetTop <= offset) {
                    current = section;
                }
            });

            setActive(navMap.get(current));
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActive(navMap.get(entry.target));
                    }
                });
            }, {
                root: null,
                rootMargin: '-120px 0px -58% 0px',
                threshold: 0
            });

            sections.forEach(function (section) {
                observer.observe(section);
            });
        }

        updateActive();

        var scrollTimer;
        window.addEventListener('scroll', function () {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateActive, 60);
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
