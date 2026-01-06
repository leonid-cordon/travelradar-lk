/* Header & Footer Loader + Theme System */

// Чтение BASE пути из meta-тега
const BASE_META = (document.querySelector('meta[name="site-base"]')?.content || '').replace(/\/$/, '');

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

    // Определяем глубину для вычисления относительных путей
    let depth = 0;
    if (currentLang !== 'ru') depth++; // /ua/ или /en/
    if (currentPage !== 'home') depth++; // /egypt/

    return { currentLang, currentPage, depth };
}

const PAGE_CONTEXT = getPageContext();

// Определение префикса для загрузки Partials (путь к корню)
const PREFIX = (function () {
    // Если BASE задан (GitHub Pages) - используем абсолютные пути
    if (BASE_META) {
        return BASE_META + '/';
    }

    // Для локальной разработки используем относительные пути
    if (PAGE_CONTEXT.depth === 0) return '';
    if (PAGE_CONTEXT.depth === 1) return '../';
    if (PAGE_CONTEXT.depth === 2) return '../../';
    return '';
})();

// BASE для ссылок (используется в навигации)
const BASE = BASE_META;

// Early theme initialization (prevents flash)
(function () {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

// Вспомогательная функция: путь к Home текущего языка
function getLangHomePath() {
    if (BASE_META) {
        // GitHub Pages - абсолютные пути
        if (PAGE_CONTEXT.currentLang === 'ru') return BASE_META + '/';
        return BASE_META + '/' + PAGE_CONTEXT.currentLang + '/';
    }

    // Локальная разработка - относительные пути
    if (PAGE_CONTEXT.currentLang === 'ru') {
        return PREFIX;
    }
    // Для ua/en - нужно вернуться в папку языка
    if (PAGE_CONTEXT.currentPage === 'home') {
        return './'; // уже в /ua/ или /en/
    }
    return '../'; // из /ua/egypt/ → /ua/
}

// Load header and footer
async function loadPartials() {
    try {
        console.log(`🔄 Loading partials with PREFIX: "${PREFIX}", Context:`, PAGE_CONTEXT);

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
            fetch(`${PREFIX}Partials/header.html?_=${timestamp}`, { cache: 'no-store' }),
            fetch(`${PREFIX}Partials/footer.html?_=${timestamp}`, { cache: 'no-store' })
        ]);

        // Header injection
        if (headerRes.ok) {
            headerPlaceholder.innerHTML = await headerRes.text();
            console.log(`✅ Header loaded from ${PREFIX}Partials/header.html`);

            // Fix navigation links to point to current language home
            fixNavigationLinks();
        } else {
            console.error(`❌ Header load failed: ${headerRes.status} ${headerRes.statusText} - URL: ${PREFIX}Partials/header.html`);
            return; // Stop if header fails
        }

        // Footer injection
        if (footerRes.ok) {
            footerPlaceholder.innerHTML = await footerRes.text();
            console.log(`✅ Footer loaded from ${PREFIX}Partials/footer.html`);
        } else {
            console.error(`❌ Footer load failed: ${footerRes.status} ${footerRes.statusText} - URL: ${PREFIX}Partials/footer.html`);
            return; // Stop if footer fails
        }

        // Initialize after loading
        initThemeToggle();
        initLanguageSwitcher();

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
    const { currentLang, currentPage, depth } = PAGE_CONTEXT;

    links.forEach(link => {
        link.classList.remove('active');
        const targetLang = link.getAttribute('data-lang');

        // Mark current language as active
        if (targetLang === currentLang) {
            link.classList.add('active');
        }

        // Calculate correct href preserving current page
        let newHref;

        if (BASE_META) {
            // GitHub Pages - абсолютные пути
            if (targetLang === 'ru') {
                newHref = BASE_META + '/' + (currentPage === 'home' ? '' : currentPage + '/');
            } else {
                newHref = BASE_META + '/' + targetLang + '/' + (currentPage === 'home' ? '' : currentPage + '/');
            }
        } else {
            // Локальная разработка - относительные пути
            // Сначала выходим наверх на нужную глубину
            let pathUp = '';
            for (let i = 0; i < depth; i++) {
                pathUp += '../';
            }
            if (depth === 0) pathUp = './';

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

// Load on DOM ready
document.addEventListener('DOMContentLoaded', loadPartials);
