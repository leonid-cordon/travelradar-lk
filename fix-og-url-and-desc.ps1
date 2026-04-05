param()
Set-StrictMode -Off
$base = 'D:\Projects\WEB_Travel_Radar_LK'

# Meta descriptions lookup
$metaMap = @{}
$metaMap['https://travelradarlk.com/ua/'] = 'Travel Radar — путівник для мандрівників: готелі, курорти, поради та огляди напрямків по всьому світу.'
$metaMap['https://travelradarlk.com/ua/about.html'] = 'Про проєкт Travel Radar: незалежний путівник для самостійних мандрівників. Чесні огляди та перевірена інформація.'
$metaMap['https://travelradarlk.com/ua/content/'] = 'Статті про подорожі: готелі, авіаперельоти, напрямки та лайфхаки. Корисні поради для мандрівників з усього світу.'
$metaMap['https://travelradarlk.com/ua/content/collections/'] = 'Тематичні добірки готелів і напрямків для відпочинку. Найкращий вибір курортів у 2026 році від Travel Radar.'
$metaMap['https://travelradarlk.com/ua/content/countries/'] = 'Огляди туристичних напрямків: Єгипет, Туреччина, Мексика та інші. Все для вибору ідеального відпочинку.'
$metaMap['https://travelradarlk.com/ua/content/countries/egypt/'] = 'Практична інформація для подорожі до Єгипту: курорти, готелі, пляжі та поради туристам у 2026 році.'
$metaMap['https://travelradarlk.com/ua/content/countries/mexico/'] = 'Мексика для мандрівників: Канкун, Тулум, курорти Карибського узбережжя та поради щодо вибору готелю.'
$metaMap['https://travelradarlk.com/ua/content/countries/turkey/'] = 'Відпочинок у Туреччині 2026: кращі курорти, готелі Стамбула та Анталії, поради мандрівникам.'
$metaMap['https://travelradarlk.com/ua/content/flights/'] = 'Корисні поради щодо авіаперельотів: як вибрати рейс, знайти вигідні квитки та підготуватися до подорожі.'
$metaMap['https://travelradarlk.com/ua/content/lifehacks/'] = 'Лайфхаки для мандрівників: як заощадити на перельотах готелях та турах. Перевірені поради досвідчених туристів.'
$metaMap['https://travelradarlk.com/ua/content/news/'] = 'Новини туризму: актуальні оновлення правил виїзду, знижки та важлива інформація для мандрівників.'
$metaMap['https://travelradarlk.com/ua/disclaimer.html'] = 'Відмова від відповідальності Travel Radar: умови використання інформації, розміщеної на сайті.'
$metaMap['https://travelradarlk.com/ua/egypt/'] = 'Єгипет для туристів: Шарм-ель-Шейх, Хургада, готелі та пляжі. Усе про відпочинок у Єгипті у 2026 році.'
$metaMap['https://travelradarlk.com/ua/mexico/'] = 'Мексика: Канкун, Тулум, Рів’єра-Майя. Найкращі готелі, пляжі та поради для незабутнього відпочинку.'
$metaMap['https://travelradarlk.com/ua/privacy.html'] = 'Політика конфіденційності сайту Travel Radar: як ми обробляємо та захищаємо персональні дані користувачів.'
$metaMap['https://travelradarlk.com/ua/terms.html'] = 'Умови використання сайту Travel Radar: правила та обмеження при роботі з матеріалами ресурсу.'
$metaMap['https://travelradarlk.com/ua/turkey/'] = 'Туреччина для мандрівників: Стамбул, Анталія, Каппадокія. Готелі, курорти та практичні поради туристам.'
$metaMap['https://travelradarlk.com/en/disclaimer.html'] = 'Travel Radar disclaimer: terms and conditions for using information and materials published on this website.'
$metaMap['https://travelradarlk.com/en/privacy.html'] = 'Travel Radar privacy policy: how we collect, use and protect personal data of our website visitors.'
$metaMap['https://travelradarlk.com/en/terms.html'] = 'Terms of use for Travel Radar: rules and limitations when accessing and using content on this website.'

# Parse sitemap
[xml]$sitemap = Get-Content "$base\sitemap.xml" -Raw -Encoding UTF8
$urls = $sitemap.urlset.url.loc

$fixedOgUrl    = 0
$fixedMetaDesc = 0
$skipped       = 0
$reportLines   = @()

foreach ($url in $urls) {
    $rel = $url -replace 'https://travelradarlk\.com/', ''
    if ($rel -match '/$') { $rel = $rel + 'index.html' }
    $rel = $rel -replace '/', '\'
    $filePath = "$base\$rel"

    if (-not (Test-Path $filePath)) {
        $reportLines += "SKIP (not found): $url"
        continue
    }

    $html = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $changed = $false

    # --- 1. og:url ---
    $hasOgUrl = $html.Contains('og:url')
    if (-not $hasOgUrl) {
        $canMatch = [regex]::Match($html, 'rel="canonical"\s+href="([^"]+)"')
        if (-not $canMatch.Success) {
            $canMatch = [regex]::Match($html, 'href="([^"]+)"\s+rel="canonical"')
        }
        $canonicalVal = if ($canMatch.Success) { $canMatch.Groups[1].Value } else { $url }

        $ogTag = '    <meta property="og:url" content="' + $canonicalVal + '">'

        if ($canMatch.Success) {
            $idx = $html.IndexOf($canMatch.Value)
            $lineEnd = $html.IndexOf("`n", $idx)
            if ($lineEnd -ge 0) {
                $html = $html.Substring(0, $lineEnd + 1) + $ogTag + "`n" + $html.Substring($lineEnd + 1)
            } else {
                $html = $html.Replace('</head>', $ogTag + "`n" + '</head>')
            }
        } else {
            $html = $html.Replace('</head>', $ogTag + "`n" + '</head>')
        }

        $fixedOgUrl++
        $changed = $true
        $reportLines += "og:url ADDED: $url"
    }

    # --- 2. meta description ---
    $hasDesc = $html.Contains('name="description"') -or $html.Contains("name='description'")
    if (-not $hasDesc) {
        if ($metaMap.ContainsKey($url)) {
            $descText = $metaMap[$url]
        } elseif ($url -match '/ua/') {
            $descText = 'Travel Radar — корисні статті та поради для мандрівників. Готелі, напрямки та лайфхаки для відпочинку.'
        } elseif ($url -match '/en/') {
            $descText = 'Travel Radar — travel guides, hotel reviews and tips for independent travelers worldwide.'
        } else {
            $descText = 'Travel Radar — советы для путешественников: отели, направления и лайфхаки для отдыха.'
        }

        $descTag = '    <meta name="description" content="' + $descText + '">'

        $titleEnd = $html.IndexOf('</title>')
        if ($titleEnd -ge 0) {
            $lineEnd2 = $html.IndexOf("`n", $titleEnd)
            if ($lineEnd2 -ge 0) {
                $html = $html.Substring(0, $lineEnd2 + 1) + $descTag + "`n" + $html.Substring($lineEnd2 + 1)
            } else {
                $html = $html.Replace('</head>', $descTag + "`n" + '</head>')
            }
        } else {
            $html = $html.Replace('</head>', $descTag + "`n" + '</head>')
        }

        $fixedMetaDesc++
        $changed = $true
        $reportLines += "meta desc ADDED: $url"
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($filePath, $html, [System.Text.Encoding]::UTF8)
    } else {
        $skipped++
    }
}

Write-Host ''
Write-Host '=========================================='
Write-Host 'ИСПРАВЛЕНО:'
Write-Host "  og:url:           $fixedOgUrl страниц"
Write-Host "  meta description: $fixedMetaDesc страниц"
Write-Host ''
Write-Host "ПРОПУЩЕНО (уже корректные): $skipped страниц"
Write-Host '=========================================='
Write-Host ''
Write-Host 'ДЕТАЛИ:'
$reportLines | ForEach-Object { Write-Host "  $_" }
