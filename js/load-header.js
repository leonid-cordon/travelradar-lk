/* Header & Footer Loader + Theme System */

// Определение BASE пути
function getBasePath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Проверяем, это GitHub Pages или нет
    if (hostname.endsWith('.github.io')) {
        // GitHub Pages: путь вида /<repo-name>/...
        const segments = pathname.split('/').filter(s => s);
        if (segments.length > 0) {
            // Первый сегмент - это имя репозитория
            return '/' + segments[0];
        }
    }

    // Локальный сервер или обычный домен
    return '';
}

const BASE = getBasePath();

// Определение текущего языка и страницы из pathname
function getPageContext() {
    const pathname = window.location.pathname;

    // Определяем текущий язык
    let currentLang = 'ru';
    if (pathname.includes('/ua/')) currentLang = 'ua';
    else if (pathname.includes('/en/')) currentLang = 'en';

    // Определяем текущую страницу (country) 
    let currentPage = 'home';
    if (pathname.includes('/egypt/')) currentPage = 'egypt';

    return { currentLang, currentPage };
}

const PAGE_CONTEXT = getPageContext();

// Early theme initialization (prevents flash)
(function () {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

// Вспомогательная функция: путь к Home текущего языка
function getLangHomePath() {
    if (BASE) {
        // GitHub Pages - абсолютные пути
        if (PAGE_CONTEXT.currentLang === 'ru') return BASE + '/';
        return BASE + '/' + PAGE_CONTEXT.currentLang + '/';
    }

    // Локальная разработка - относительный путь к корню
    const pathname = window.location.pathname;
    const depth = (pathname.match(/\//g) || []).length - 1;

    if (depth === 0) return './';
    return '../'.repeat(depth);
}

// Load header and footer
async function loadPartials() {
    try {
        // Определяем пути к Partials
        const headerPath = BASE + '/Partials/header.html';
        const footerPath = BASE + '/Partials/footer.html';

        console.log(`🔄 Loading partials from BASE: "${BASE}"`);
        console.log(`   Header: ${headerPath}`);
        console.log(`   Footer: ${footerPath}`);

        // Check for required placeholders FIRST
        const headerPlaceholder = document.getElementById('site-header') || document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('site-footer') || document.getElementById('footer-placeholder');

        if (!headerPlaceholder) {
            console.error('❌ Missing placeholder: <div id="site-header"></div> not found in HTML!');
            return; // Stop execution
        }

        if (!footerPlaceholder) {
            console.error('❌ Missing placeholder: <div id="site-footer"></div> not found in HTML!');
            return; // Stop execution
        }

        // Fetch with no-store to bypass Live Server cache
        const timestamp = Date.now();
        const [headerRes, footerRes] = await Promise.all([
            fetch(`${headerPath}?_=${timestamp}`, { cache: 'no-store' }),
            fetch(`${footerPath}?_=${timestamp}`, { cache: 'no-store' })
        ]);

        // Header injection
        if (headerRes.ok) {
            headerPlaceholder.innerHTML = await headerRes.text();
            console.log(`✅ Header loaded from ${headerPath}`);

            // Fix navigation links to point to current language home
            fixNavigationLinks();
            initActiveNav();
            window.addEventListener('hashchange', initActiveNav);

            // ===== Active nav highlight (strict & correct) =====
            const pathname = window.location.pathname;
            const hash = window.location.hash;

            // Сначала снимаем всё
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Контент (список и статьи)
            if (pathname.includes('/content')) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href')?.includes('content')) {
                        link.classList.add('active');
                    }
                });
            }

            // О проекте — ТОЛЬКО если есть #about
            else if (hash === '#about') {
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href')?.includes('#about')) {
                        link.classList.add('active');
                    }
                });
            }

            // Страны — ТОЛЬКО если есть #destinations
            else if (hash === '#destinations') {
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href')?.includes('#destinations')) {
                        link.classList.add('active');
                    }
                });
            }

            // Главная (Travel Radar) — НИЧЕГО не подсвечиваем



        } else {
            console.error(`❌ Header load failed: ${headerRes.status} ${headerRes.statusText} - URL: ${headerPath}`);
            return; // Stop if header fails
        }

        // Footer injection
        if (footerRes.ok) {
            footerPlaceholder.innerHTML = await footerRes.text();
            console.log(`✅ Footer loaded from ${footerPath}`);
        } else {
            console.error(`❌ Footer load failed: ${footerRes.status} ${footerRes.statusText} - URL: ${footerPath}`);
            return; // Stop if footer fails
        }

        // Initialize after loading
        initThemeToggle();
        initLanguageSwitcher();
        initMobileMenu();

        console.log('✅ Partials loaded successfully');
    } catch (err) {
        console.error('❌ Partials load error:', err);
    }
}

// Fix navigation links to point to current language home
function fixNavigationLinks() {
    const langHome = getLangHomePath();

    // Fix brand/logo link
    const brand = document.querySelector('.brand');
    if (brand) {
        brand.setAttribute('href', langHome);
    }

    // Fix nav menu links (Страны, Контент, О проекте)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('./')) {
            // Replace "./" with path to current language home
            const newHref = langHome + href.substring(2);
            link.setAttribute('href', newHref);
        }
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeIcon(currentTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = current === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
    }
}

// Language switcher - preserves page context
function initLanguageSwitcher() {
    const links = document.querySelectorAll('.lang-link');
    const { currentLang, currentPage } = PAGE_CONTEXT;

    links.forEach(link => {
        link.classList.remove('active');
        const targetLang = link.getAttribute('data-lang');

        // Mark current language as active
        if (targetLang === currentLang) {
            link.classList.add('active');
        }

        // Calculate correct href preserving current page
        let newHref;

        if (BASE) {
            // GitHub Pages - абсолютные пути
            if (targetLang === 'ru') {
                newHref = BASE + '/' + (currentPage === 'home' ? '' : currentPage + '/');
            } else {
                newHref = BASE + '/' + targetLang + '/' + (currentPage === 'home' ? '' : currentPage + '/');
            }
        } else {
            // Локальная разработка - относительный путь к корню
            const pathname = window.location.pathname;
            const depth = (pathname.match(/\//g) || []).length - 1;
            const pathUp = depth === 0 ? './' : '../'.repeat(depth);

            // Затем строим путь к целевому языку/странице
            if (targetLang === 'ru') {
                newHref = pathUp + (currentPage === 'home' ? '' : currentPage + '/');
            } else {
                newHref = pathUp + targetLang + '/' + (currentPage === 'home' ? '' : currentPage + '/');
            }
        }

        link.setAttribute('href', newHref);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileToggle || !navMenu) return;

    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Handle dropdown toggle on mobile
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown, .nav-item:has(.has-dropdown)');

    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link.has-dropdown');

        if (link) {
            link.addEventListener('click', (e) => {
                // Only prevent default on mobile (when menu is visible as off-canvas)
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('dropdown-open');
                }
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const isClickInsideMenu = navMenu.contains(e.target);
            const isClickOnToggle = mobileToggle.contains(e.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Initialize aria-expanded
    mobileToggle.setAttribute('aria-expanded', 'false');
}
function initActiveNav() {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Сброс
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Контент (список + статьи)
    if (pathname.includes('/content')) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href')?.includes('content')) {
                link.classList.add('active');
            }
        });
        return;
    }

    // О проекте
    if (hash === '#about') {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href')?.includes('#about')) {
                link.classList.add('active');
            }
        });
        return;
    }

    // Страны
    if (hash === '#destinations') {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href')?.includes('#destinations')) {
                link.classList.add('active');
            }
        });
        return;
    }

    // Главная (Travel Radar) — НИЧЕГО не активно
}

// Load on DOM ready
document.addEventListener('DOMContentLoaded', loadPartials);
