# fix-index-canonical.ps1
# Adds canonical tag and fixes hreflang on all directory (index) pages from sitemap.xml

$projectRoot = $PSScriptRoot
$sitemapPath  = Join-Path $projectRoot "sitemap.xml"
$utf8NoBom    = New-Object System.Text.UTF8Encoding $false

Write-Host "=== fix-index-canonical ===" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"
Write-Host ""

[xml]$sitemap = Get-Content $sitemapPath -Encoding UTF8
$baseUrl = "https://travelradarlk.com"

# Filter only directory URLs (end with /, no .html)
$dirUrls = $sitemap.urlset.url.loc | Where-Object {
    $_ -match "/$" -and $_ -notmatch "\.html"
}

Write-Host "Directory (index) pages found: $($dirUrls.Count)" -ForegroundColor Yellow
Write-Host ""

# Language segment ↔ hreflang code mapping
$langMap = @{
    "ru"        = "ru"
    "en"        = "en"
    "ua"        = "uk"
}
# inverse: hreflang code → url lang segment
$hreflangToLang = @{
    "ru"        = "ru"
    "en"        = "en"
    "uk"        = "ua"
    "x-default" = "en"
}

$fixed   = 0
$skipped = 0

foreach ($url in $dirUrls) {

    # Resolve file path  →  URL "/ru/content/" → file "ru\content\index.html"
    $relPath  = $url.Replace($baseUrl, "").TrimStart("/").TrimEnd("/")
    $filePath = Join-Path $projectRoot ($relPath.Replace("/", "\") + "\index.html")

    if (-not (Test-Path $filePath)) {
        Write-Host "  SKIP (file not found): $url  →  $filePath" -ForegroundColor DarkGray
        continue
    }

    $content  = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
    $original = $content
    $changed  = $false

    # ── STEP 1: Fix / add canonical ───────────────────────────────────────────
    $canonicalPattern = '<link\s+rel="canonical"\s+href="([^"]*)"[^>]*>'

    if ($content -match $canonicalPattern) {
        $currentCanonical = $Matches[1]
        if ($currentCanonical -ne $url) {
            $newTag  = "<link rel=`"canonical`" href=`"$url`">"
            $content = [System.Text.RegularExpressions.Regex]::Replace(
                $content,
                $canonicalPattern,
                $newTag
            )
            Write-Host "  [canonical] fixed: $currentCanonical → $url" -ForegroundColor Yellow
            $changed = $true
        }
    } else {
        # Canonical missing — inject after <meta name="robots"...> if present, else after last <meta ...>
        $insertAfter = '<meta name="robots"[^>]*>'
        if ($content -match $insertAfter) {
            $content = [System.Text.RegularExpressions.Regex]::Replace(
                $content,
                "($insertAfter)",
                "`$1`n    <link rel=`"canonical`" href=`"$url`">"
            )
        } else {
            # Fallback: insert after charset meta
            $content = [System.Text.RegularExpressions.Regex]::Replace(
                $content,
                '(<meta\s+charset="[^"]*"[^>]*>)',
                "`$1`n    <link rel=`"canonical`" href=`"$url`">"
            )
        }
        Write-Host "  [canonical] added: $url" -ForegroundColor Green
        $changed = $true
    }

    # ── STEP 2: Fix hreflang hrefs ────────────────────────────────────────────
    # Determine path suffix after language segment
    # e.g. /ru/content/lifehacks/ → content/lifehacks/
    $urlLang = ""
    if ($url -match "travelradarlk\.com/([a-z]{2})/") {
        $urlLang = $Matches[1]
    }
    $pathSuffix = ""
    if ($urlLang -ne "") {
        $afterLang = $url -replace "^https://travelradarlk\.com/$urlLang", ""
        $pathSuffix = $afterLang.TrimStart("/")   # e.g. "content/lifehacks/"
    }

    $hreflangPattern = '(<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href=")([^"]+)(")'
    $matches2 = [System.Text.RegularExpressions.Regex]::Matches($content, $hreflangPattern)

    foreach ($m in $matches2) {
        $fullTag      = $m.Groups[0].Value
        $prefix       = $m.Groups[1].Value
        $hreflangCode = $m.Groups[2].Value
        $currentHref  = $m.Groups[3].Value
        $suffix       = $m.Groups[4].Value

        if (-not $hreflangToLang.ContainsKey($hreflangCode)) { continue }
        $targetLang = $hreflangToLang[$hreflangCode]

        # Build expected href
        if ($pathSuffix -eq "" -or $pathSuffix -eq "/") {
            $expectedHref = "$baseUrl/$targetLang/"
        } else {
            # Remove any accidental index.html from suffix
            $cleanSuffix = $pathSuffix -replace "index\.html/?$", ""
            $expectedHref = "$baseUrl/$targetLang/$cleanSuffix"
            if (-not $expectedHref.EndsWith("/")) { $expectedHref += "/" }
        }

        if ($currentHref -ne $expectedHref) {
            $newTag  = "$prefix$expectedHref$suffix"
            $escaped = [System.Text.RegularExpressions.Regex]::Escape($fullTag)
            $content = [System.Text.RegularExpressions.Regex]::Replace($content, $escaped, $newTag, 1)
            Write-Host "    [$hreflangCode] $currentHref → $expectedHref" -ForegroundColor Yellow
            $changed = $true
        }
    }

    # ── Save if changed ───────────────────────────────────────────────────────
    if ($changed) {
        [System.IO.File]::WriteAllText($filePath, $content, $utf8NoBom)
        Write-Host "  FIXED: $url" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "  OK:    $url" -ForegroundColor DarkGreen
        $skipped++
    }
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "FIXED:   $fixed pages"   -ForegroundColor Green
Write-Host "SKIPPED: $skipped pages (already correct)" -ForegroundColor DarkGreen
Write-Host "=============================="
