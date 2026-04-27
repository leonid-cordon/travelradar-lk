/* ===============================
   Travel Radar LK
   Stable Header/Footer System
================================= */

/* ========= BASE PATH (для GitHub Pages) ========= */
function getBasePath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.endsWith('.github.io')) {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
            return '/' + segments[0];
        }
    }

    return '';
}

const BASE = getBasePath();

/* ========= LANGUAGE ========= */
function getCurrentLang() {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const first = segments[0];

    if (['ru', 'ua', 'en'].includes(first)) {
        return first;
    }

    return 'ru';
}

/* ========= EARLY THEME ========= */
(function () {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

/* ========= LOAD PARTIALS ========= */
async function loadPartials() {
    try {
        const lang = getCurrentLang();

        const headerPath = `${BASE}/Partials/header-${lang}.html`;
        const footerPath = `${BASE}/Partials/footer-${lang}.html`;

        const headerPlaceholder = document.getElementById('site-header');
        const footerPlaceholder = document.getElementById('site-footer');

        if (!headerPlaceholder || !footerPlaceholder) {
            console.error('❌ Missing header or footer placeholder');
            return;
        }

        const [headerRes, footerRes] = await Promise.all([
            fetch(headerPath + '?v=' + Date.now(), { cache: 'no-store' }),
            fetch(footerPath + '?v=' + Date.now(), { cache: 'no-store' })
        ]);

        if (!headerRes.ok || !footerRes.ok) {
            console.error('❌ Failed loading partials');
            return;
        }

        headerPlaceholder.innerHTML = await headerRes.text();
        footerPlaceholder.innerHTML = await footerRes.text();

        fixNavigationLinks();
        initLanguageSwitcher();
        initThemeToggle();
        initMobileMenu();
        initActiveNav();

        window.addEventListener('hashchange', initActiveNav);

    } catch (err) {
        console.error('❌ Partials error:', err);
    }
}

/* ========= FIX NAVIGATION ========= */
function fixNavigationLinks() {
    const lang = getCurrentLang();

    // Переписываем ТОЛЬКО header и footer
    document.querySelectorAll('#site-header a, #site-footer a').forEach(link => {
        let href = link.getAttribute('href');
        if (!href) return;

        // Игнорируем внешние ссылки
        if (
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:')
        ) return;

        // Якоря (#about)
        if (href.startsWith('#')) {
            link.setAttribute('href', `/${lang}/${href}`);
            return;
        }

        // Убираем старый языковой префикс
        href = href.replace(/^\/(ru|ua|en)\//, '/');

        // Если абсолютный путь
        if (href.startsWith('/')) {
            link.setAttribute('href', `/${lang}${href}`);
            return;
        }

        // Если относительный (content/, egypt/)
        link.setAttribute('href', `/${lang}/${href}`);
    });

    // Логотип всегда ведёт на главную языка
    const brand = document.querySelector('#site-header .brand');
    if (brand) {
        brand.setAttribute('href', `/${lang}/`);
    }
}

/* ========= LANGUAGE SWITCHER ========= */
function initLanguageSwitcher() {
    const currentLang = getCurrentLang();
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    const cleanPath = pathname.replace(/^\/(ru|ua|en)/, '');

    document.querySelectorAll('.lang-link').forEach(link => {
        const targetLang = link.dataset.lang;

        const newHref = `/${targetLang}${cleanPath}${search}${hash}`;
        link.setAttribute('href', newHref);

        link.classList.toggle('active', currentLang === targetLang);
    });
}

/* ========= ACTIVE NAV ========= */
function initActiveNav() {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const navLinks = document.querySelectorAll('#site-header .nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    if (pathname.includes('/content')) {
        navLinks.forEach(link => {
            if (link.href.includes('content')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        return;
    }

    if (pathname.includes('/about')) {
        navLinks.forEach(link => {
            if (link.href.includes('/about')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        return;
    }

    if (hash === '#destinations') {
        navLinks.forEach(link => {
            if (link.href.includes('#destinations')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}

/* ========= THEME ========= */
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
    if (!toggle) return;

    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ========= MOBILE MENU ========= */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========= INIT ========= */
document.addEventListener('DOMContentLoaded', loadPartials);
