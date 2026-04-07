# Article Card Automation

This folder contains the helper script used from chat to add a new article card in stages.

Main script:

- `add-article-cards.ps1`

What it can update for one locale at a time:

- `/<locale>/content/index.html`
- `/<locale>/content/countries/<country>/index.html`
- `/<locale>/index.html` inside Latest Content / Ostan ni materialy / Poslednie materialy

How the chat flow is expected to work:

1. User gives the article path.
2. User gives the card categories for the current locale.
3. User gives the card href that must be removed from the home latest section.
4. The script is run for `ru`.
5. User checks the result and replies to continue.
6. The script is run for `en`.
7. User checks the result and replies to continue.
8. The script is run for `ua`.

Example runs:

```powershell
powershell -ExecutionPolicy Bypass -File .\_dev\SCRIPT\add-article-cards.ps1 `
  -Locale ru `
  -ArticlePath ru/content/cancun-budget-2026.html `
  -Categories 'Мексика','Канкун' `
  -CountrySlug mexico `
  -RemoveLatestHref content/hotel-check-before-booking.html
```

```powershell
powershell -ExecutionPolicy Bypass -File .\_dev\SCRIPT\add-article-cards.ps1 `
  -Locale en `
  -ArticlePath ru/content/cancun-budget-2026.html `
  -Categories 'Mexico','Cancun' `
  -RemoveLatestHref content/hotel-check-before-booking.html
```

```powershell
powershell -ExecutionPolicy Bypass -File .\_dev\SCRIPT\add-article-cards.ps1 `
  -Locale ua `
  -ArticlePath ru/content/cancun-budget-2026.html `
  -Categories 'Мексика','Канкун' `
  -CountrySlug mexico `
  -RemoveLatestHref content/hotel-check-before-booking.html
```

Useful switches:

- `-CountrySlug mexico` to force a country page
- use `-CountrySlug` when card categories are localized and not plain English
- `-SkipCountryIndex` to skip the country page update
- `-SkipHomeLatest` to skip the home page latest materials block
- `-SkipContentIndex` to skip the content index page
- `-CardTitle '...'` to override the card title
- `-CardExcerpt '...'` to override the card excerpt
- `-DryRun` to validate the run without writing files

Logs:

- every run writes a file to `_dev/SCRIPT/logs/`
- file name format: `article-addition-YYYY-MM-DD_HHMMSS-<locale>.log`
