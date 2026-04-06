$base = "D:\Projects\WEB_Travel_Radar_LK"

$metaMap = @{
    "https://travelradarlk.com/ua/"                                = "Travel Radar — путивник для мандривникив: готели, курорти, поради та огляди напрямкив по всьому свиту."
    "https://travelradarlk.com/ua/about.html"                      = "Про проект Travel Radar: незалежний путивник для самостийних мандривникив. Чесни огляди та перевирена информация."
    "https://travelradarlk.com/ua/content/"                        = "Статти про подорожи: готели, авиаперельоти, напрямки та лайфхаки. Кориснi поради для мандривникив з усього свиту."
    "https://travelradarlk.com/ua/content/collections/"            = "Тематичнi добирки готелив i напрямкив для видпочинку. Найкращий вибир курортив у 2026 роци вид Travel Radar."
    "https://travelradarlk.com/ua/content/countries/"              = "Огляди туристичних напрямкив: Єгипет, Туреччина, Мексика та иншi. Все для вибору идеального видпочинку."
    "https://travelradarlk.com/ua/content/countries/egypt/"        = "Практична информацiя для подорожи до Єгипту: курорти, готели, пляжи та поради туристам у 2026 роцi."
    "https://travelradarlk.com/ua/content/countries/mexico/"       = "Мексика для мандривникив: Канкун, Тулум, курорти Карибського узбережжя та поради щодо вибору готелю."
    "https://travelradarlk.com/ua/content/countries/turkey/"       = "Видпочинок у Туреччинi 2026: кращi курорти, готели Стамбула та Аталii, поради мандривникам."
    "https://travelradarlk.com/ua/content/flights/"                = "Кориснi поради щодо авiаперельотив: як вибрати рейс, знайти вигiднi квитки та пiдготуватися до подорожi."
    "https://travelradarlk.com/ua/content/lifehacks/"              = "Лайфхаки для мандривникив: як заощадити на перельотах, готелях та турах. Перевiренi поради досвiдчених туристiв."
    "https://travelradarlk.com/ua/content/news/"                   = "Новини туризму: актуальнi оновлення правил виiзду, знижки та важлива iнформацiя для мандривникiв."
    "https://travelradarlk.com/ua/disclaimer.html"                 = "Вiдмова вiд вiдповiдальностi Travel Radar: умови використання iнформацiї, розмiщеної на сайтi."
    "https://travelradarlk.com/ua/egypt/"                          = "Єгипет для туристiв: Шарм-ель-Шейх, Хургада, готелi та пляжi. Усе про вiдпочинок у Єгиптi у 2026 роцi."
    "https://travelradarlk.com/ua/mexico/"                         = "Мексика: Канкун, Тулум, Рiв-єра-Майя. Найкращi готелi, пляжi та поради для незабутнього вiдпочинку."
    "https://travelradarlk.com/ua/privacy.html"                    = "Полiтика конфiденцiйностi сайту Travel Radar: як ми обробляємо та захищаємо персональнi данi користувачiв."
    "https://travelradarlk.com/ua/terms.html"                      = "Умови використання сайту Travel Radar: правила та обмеження при роботi з матерiалами ресурсу."
    "https://travelradarlk.com/ua/turkey/"                         = "Туреччина для мандривникiв: Стамбул, Анталiя, Каппадокiя. Готелi, курорти та практичнi поради туристам."
    "https://travelradarlk.com/en/disclaimer.html"                 = "Travel Radar disclaimer: terms and conditions for using information and materials published on this website."
    "https://travelradarlk.com/en/privacy.html"                    = "Travel Radar privacy policy: how we collect, use and protect personal data of our website visitors."
    "https://travelradarlk.com/en/terms.html"                      = "Terms of use for Travel Radar: rules and limitations when accessing and using content on this website."
}

[xml]$sitemap = Get-Content "$base\sitemap.xml" -Raw -Encoding UTF8
$urls = $sitemap.urlset.url.loc

$fixedOg = 0; $fixedDesc = 0; $skipped = 0; $log = @()

foreach ($url in $urls) {
    $rel = $url -replace 'https://travelradarlk\.com/', ''
    if ($rel -match '/$') { $rel += 'index.html' }
    $rel = $rel -replace '/', '\'
    $fp = "$base\$rel"
    if (-not (Test-Path $fp)) { $log += "NOT FOUND: $url"; continue }

    $html = [System.IO.File]::ReadAllText($fp, [System.Text.Encoding]::UTF8)
    $changed = $false

    # og:url
    if (-not $html.Contains('og:url')) {
        $m = [regex]::Match($html, 'rel="canonical" href="([^"]+)"')
        if (-not $m.Success) { $m = [regex]::Match($html, 'href="([^"]+)" rel="canonical"') }
        $cval = if ($m.Success) { $m.Groups[1].Value } else { $url }
        $tag = '    <meta property="og:url" content="' + $cval + '">'
        if ($m.Success) {
            $i = $html.IndexOf($m.Value); $nl = $html.IndexOf("`n", $i)
            if ($nl -ge 0) { $html = $html.Substring(0,$nl+1) + $tag + "`n" + $html.Substring($nl+1) }
            else { $html = $html.Replace('</head>', $tag + "`n</head>") }
        } else { $html = $html.Replace('</head>', $tag + "`n</head>") }
        $fixedOg++; $changed = $true; $log += "og:url ADDED: $url"
    }

    # meta description
    if (-not ($html.Contains('name="description"') -or $html.Contains("name='description'"))) {
        $dt = if ($metaMap.ContainsKey($url)) { $metaMap[$url] }
              elseif ($url -match '/ua/') { "Travel Radar — korysnі statti ta porady dlia mandrivnykiv. Hoteli, napriamky ta laifkh." }
              elseif ($url -match '/en/') { "Travel Radar — travel guides, hotel reviews and tips for independent travelers worldwide." }
              else { "Travel Radar — sovety dlia puteshestvennikov: oteli, napravleniia i laifkhaki dlia otdykha." }
        $tag2 = '    <meta name="description" content="' + $dt + '">'
        $ti = $html.IndexOf('</title>')
        if ($ti -ge 0) {
            $nl2 = $html.IndexOf("`n", $ti)
            if ($nl2 -ge 0) { $html = $html.Substring(0,$nl2+1) + $tag2 + "`n" + $html.Substring($nl2+1) }
            else { $html = $html.Replace('</head>', $tag2 + "`n</head>") }
        } else { $html = $html.Replace('</head>', $tag2 + "`n</head>") }
        $fixedDesc++; $changed = $true; $log += "meta desc ADDED: $url"
    }

    if ($changed) { [System.IO.File]::WriteAllText($fp, $html, [System.Text.Encoding]::UTF8) }
    else { $skipped++ }
}

Write-Host ""
Write-Host "=========================================="
Write-Host "ИСПРАВЛЕНО:"
Write-Host "  og:url:           $fixedOg страниц"
Write-Host "  meta description: $fixedDesc страниц"
Write-Host "ПРОПУЩЕНО (корректные): $skipped страниц"
Write-Host "=========================================="
$log | ForEach-Object { Write-Host "  $_" }
