# fix-hreflang-sync.ps1
# Synchronizes hreflang href values with canonical URL pattern for all pages in sitemap.xml

$projectRoot = $PSScriptRoot
$sitemapPath = Join-Path $projectRoot "sitemap.xml"
$utf8NoBom   = New-Object System.Text.UTF8Encoding $false

Write-Host "=== hreflang sync ===" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"

# ── Load sitemap ───────────────────────────────────────────────────────────────
[xml]$sitemap = Get-Content $sitemapPath -Encoding UTF8
$baseUrl = "https://travelradarlk.com"
$urls = $sitemap.urlset.url.loc

Write-Host "URLs in sitemap: $($urls.Count)"
Write-Host ""

# ── Language prefix mapping ────────────────────────────────────────────────────
# hreflang code → URL language segment
$langMap = @{
    "ru"        = "ru"
    "en"        = "en"
    "uk"        = "ua"
    "x-default" = "en"
}

$fixed   = 0
$skipped = 0

foreach ($url in $urls) {

    # ── Resolve file path ──────────────────────────────────────────────────────
    $relPath = $url.Replace($baseUrl, "").TrimStart("/")

    if ($relPath -eq "" -or $relPath -eq "/") {
        $filePath = Join-Path $projectRoot "index.html"
    } elseif ($relPath.EndsWith("/")) {
        $filePath = Join-Path $projectRoot ($relPath.TrimEnd("/") + "\index.html")
    } elseif ($relPath.EndsWith(".html")) {
        $filePath = Join-Path $projectRoot $relPath
    } else {
        $filePath = Join-Path $projectRoot ($relPath + "\index.html")
    }

    $filePath = $filePath.Replace("/", "\")

    if (-not (Test-Path $filePath)) {
        Write-Host "  SKIP (file not found): $url" -ForegroundColor DarkGray
        continue
    }

    # ── Read file ──────────────────────────────────────────────────────────────
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # ── Extract canonical ──────────────────────────────────────────────────────
    if ($content -notmatch '<link\s+rel="canonical"\s+href="([^"]+)"') {
        Write-Host "  SKIP (no canonical): $url" -ForegroundColor DarkGray
        continue
    }
    $canonicalUrl = $Matches[1].TrimEnd("/") # strip any trailing slash temporarily

    # Determine if canonical is a directory (ends with /) or file (.html)
    $originalCanonical = if ($content -match '<link\s+rel="canonical"\s+href="([^"]+)"') { $Matches[1] } else { "" }
    $isDir = $originalCanonical.EndsWith("/")

    # ── Extract lang prefix from canonical (e.g. "ru", "en", "ua") ────────────
    # Pattern: https://travelradarlk.com/{lang}/...
    $canonicalLang = ""
    if ($originalCanonical -match "travelradarlk\.com/([a-z]{2})/") {
        $canonicalLang = $Matches[1]
    }

    # ── Extract the path suffix after the lang prefix ──────────────────────────
    # e.g. /ru/content/page.html → content/page.html
    #      /ru/                  → (empty)
    $pathSuffix = ""
    if ($canonicalLang -ne "") {
        $afterLang = $originalCanonical -replace "^https://travelradarlk\.com/$canonicalLang", ""
        # afterLang is like /content/page.html  or  /  or  /content/
        $pathSuffix = $afterLang.TrimStart("/")
    }

    # ── Build expected hreflang href for each lang ─────────────────────────────
    # Rule: same path, same trailing-slash / .html suffix as canonical
    # Replace lang segment in URL

    # Find all hreflang tags in file
    $hreflangPattern = '(<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href=")([^"]+)(")'

    $newContent = $content
    $anyChange  = $false

    $matches2 = [System.Text.RegularExpressions.Regex]::Matches($content, $hreflangPattern)

    foreach ($m in $matches2) {
        $fullTag     = $m.Groups[0].Value
        $prefix      = $m.Groups[1].Value   # <link ... href="
        $hreflangCode = $m.Groups[2].Value  # ru / en / uk / x-default
        $currentHref = $m.Groups[3].Value   # current href value
        $suffix      = $m.Groups[4].Value   # closing "

        # Determine what lang segment this hreflang code maps to
        if (-not $langMap.ContainsKey($hreflangCode)) {
            continue  # unknown code, skip
        }
        $targetLang = $langMap[$hreflangCode]

        # Build expected href
        if ($pathSuffix -eq "") {
            # Directory root like /ru/
            $expectedHref = "$baseUrl/$targetLang/"
        } elseif ($isDir) {
            # Sub-directory like /ru/egypt/
            $expectedHref = "$baseUrl/$targetLang/$pathSuffix"
            if (-not $expectedHref.EndsWith("/")) { $expectedHref += "/" }
        } else {
            # File page like /ru/content/page.html
            $expectedHref = "$baseUrl/$targetLang/$pathSuffix"
        }

        if ($currentHref -ne $expectedHref) {
            $newTag = "$prefix$expectedHref$suffix"
            # Replace exactly this occurrence (escape for regex)
            $escapedTag = [System.Text.RegularExpressions.Regex]::Escape($fullTag)
            $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, $escapedTag, $newTag, 1)
            $anyChange  = $true
            Write-Host "    [$hreflangCode] $currentHref → $expectedHref" -ForegroundColor Yellow
        }
    }

    if ($anyChange) {
        [System.IO.File]::WriteAllText($filePath, $newContent, $utf8NoBom)
        Write-Host "  FIXED: $url" -ForegroundColor Green
        $fixed++
    } else {
        Write-Host "  OK:    $url" -ForegroundColor DarkGreen
        $skipped++
    }
}

Write-Host ""
Write-Host "===========================" -ForegroundColor Cyan
Write-Host "FIXED:   $fixed pages" -ForegroundColor Green
Write-Host "SKIPPED: $skipped pages (already correct)" -ForegroundColor DarkGreen
Write-Host "==========================="
