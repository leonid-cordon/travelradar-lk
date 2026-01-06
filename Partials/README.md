# Partials Directory

This directory contains HTML partials that are dynamically loaded by `/js/load-header.js`.

## 🟢 Active Files (NEW System)

These files are loaded on all active pages:

- **`header.html`** - Site header with navigation, language switcher, theme toggle
  - Loaded into: `<div id="site-header"></div>`
  - Contains: Logo, navigation menu, social links (Telegram/YouTube), language switcher (RU/UA/EN), theme toggle

- **`footer.html`** - Site footer with links and copyright
  - Loaded into: `<div id="site-footer"></div>`
  - Contains: Footer navigation, copyright info

## 🔴 Obsolete Files (OLD System)

- **`egypt.html`** - ❌ **DO NOT USE**
  - This is an OLD standalone page that uses the legacy `assets/js/app.js` system
  - Use `/egypt/index.html` instead (which uses the NEW system)
  - Kept for reference only

## How It Works

1. Each HTML page includes:
   ```html
   <div id="site-header"></div>
   <!-- page content -->
   <div id="site-footer"></div>
   <script src="/js/load-header.js"></script>
   ```

2. The script loads partials via fetch:
   ```javascript
   fetch('/Partials/header.html')
   fetch('/Partials/footer.html')
   ```

3. Partials are injected into the placeholders

## Active Pages Using NEW System

- ✅ `/index.html` - Main page
- ✅ `/egypt/index.html` - Egypt country page
- ✅ `/en/index.html` - English version
- ✅ `/ua/index.html` - Ukrainian version

All pages use **root-relative paths** (`/assets/...`, `/js/...`) for consistency.
