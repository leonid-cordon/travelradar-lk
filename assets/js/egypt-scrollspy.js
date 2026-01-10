/* Egypt Page Scrollspy for Quick Navigation */

(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const navItems = document.querySelectorAll('.quick-nav-item[href^="#"]');
        if (navItems.length === 0) return;

        // Get all sections referenced by nav items
        const sections = [];
        const navMap = new Map();

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            const sectionId = href.substring(1); // Remove #
            const section = document.getElementById(sectionId);

            if (section) {
                sections.push(section);
                navMap.set(section, item);
            }

            // Handle click - set active immediately
            item.addEventListener('click', function () {
                setActiveItem(this);
            });
        });

        if (sections.length === 0) return;

        // Set up Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -60% 0px', // Account for sticky header/nav
            threshold: 0
        };

        let activeSection = null;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is visible
                    if (!activeSection || entry.target.offsetTop < activeSection.offsetTop ||
                        (activeSection && !isInViewport(activeSection))) {
                        activeSection = entry.target;
                        const navItem = navMap.get(entry.target);
                        if (navItem) {
                            setActiveItem(navItem);
                        }
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.forEach(section => observer.observe(section));

        // Set initial active state
        updateActiveOnScroll();
    }

    function setActiveItem(activeItem) {
        // Remove active class from all items
        document.querySelectorAll('.quick-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current item
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function updateActiveOnScroll() {
        const navItems = document.querySelectorAll('.quick-nav-item[href^="#"]');
        const scrollPosition = window.scrollY + 150; // Offset for header

        let currentSection = null;

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            const sectionId = href.substring(1);
            const section = document.getElementById(sectionId);

            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = item;
                }
            }
        });

        if (currentSection) {
            setActiveItem(currentSection);
        }
    }

    // Fallback: update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveOnScroll, 50);
    }, { passive: true });

})();
