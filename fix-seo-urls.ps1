<#
.SYNOPSIS
    Fix SEO URL consistency: canonical / og:url / JSON-LD @id
    
    Rules:
    1. URL with "index.html" -> replace with directory (remove index.html, keep /)
    2. URL ending with ".html/" -> remove trailing slash (keep .html, no /)
    3. Directory URL without trailing slash -> add trailing slash
    4. Sync: canonical = og:url = @id
#>

$projectRoot = "d:\Projects\WEB_Travel_Radar_LK"
$sitemapPath  = Join-Path $projectRoot "sitemap.xml"

[xml]$sitemap = Get-Content $sitemapPath -Encoding UTF8
$urls = $sitemap.urlset.url | ForEach-Object { $_.loc }

Write-Host ""
Write-Host "=== SEO URL Fix v2: correct canonical/og:url/@id ===" -ForegroundColor Cyan
Write-Host "Pages in sitemap: $($urls.Count)" -ForegroundColor Gray
Write-Host ""

$fixed   = 0
$skipped = 0
$missing = 0

# -------------------------------------------------------
# Compute correct canonical URL from sitemap URL
# -------------------------------------------------------
function Get-CorrectUrl($url) {
    # CASE 1: contains index.html -> replace with directory
    if ($url -match 'index\.html') {
        return ($url -replace 'index\.html', '')
    }
    # CASE 2: ends with .html/ -> remove trailing slash
    if ($url -match '\.html/$') {
        return ($url -replace '/$', '')
    }
    # CASE 3: .html without slash -> keep as is
    if ($url -match '\.html$') {
        return $url
    }
    # CASE 4: directory -> ensure trailing slash
    if (-not $url.EndsWith('/')) {
        return $url + '/'
    }
    return $url
}

# -------------------------------------------------------
# Map sitemap URL -> local file
# -------------------------------------------------------
function Get-LocalFile($url, $root) {
    $path = $url -replace '^https://travelradarlk\.com', ''

    # Root
    if ($path -eq '' -or $path -eq '/') {
        return Join-Path $root "index.html"
    }

    # Direct .html file
    if ($path -match '\.html') {
        # Strip any trailing slash after .html
        $path = $path -replace '\.html.*$', '.html'
        $localPath = $path -replace '/', '\'
        return Join-Path $root $localPath.TrimStart('\')
    }

    # Directory -> index.html
    $localPath = $path.TrimEnd('/') -replace '/', '\'
    return Join-Path $root ($localPath.TrimStart('\') + '\index.html')
}

foreach ($url in $urls) {

    $canonicalUrl = Get-CorrectUrl $url
    $localFile    = Get-LocalFile $url $projectRoot

    if (-not (Test-Path $localFile)) {
        Write-Host "  [SKIP-NOFILE] $url" -ForegroundColor DarkGray
        Write-Host "                -> $localFile" -ForegroundColor DarkGray
        $missing++
        continue
    }

    $content = Get-Content $localFile -Raw -Encoding UTF8
    $changed = $false

    # ---------- 1. canonical ----------
    $canonRegex = '(<link\s+rel="canonical"\s+href=")([^"]+)(")'
    if ($content -match $canonRegex) {
        $currentHref = [regex]::Match($content, $canonRegex).Groups[2].Value
        if ($currentHref -ne $canonicalUrl) {
            $content = [regex]::Replace($content, $canonRegex, "`${1}$canonicalUrl`${3}")
            $changed = $true
            Write-Host "  [canonical] $currentHref" -ForegroundColor DarkYellow
            Write-Host "           -> $canonicalUrl" -ForegroundColor Yellow
        }
    }

    # ---------- 2. og:url ----------
    $ogUrlRegex = '(<meta\s+property="og:url"\s+content=")([^"]+)(")'
    if ($content -match $ogUrlRegex) {
        $currentOg = [regex]::Match($content, $ogUrlRegex).Groups[2].Value
        if ($currentOg -ne $canonicalUrl) {
            $content = [regex]::Replace($content, $ogUrlRegex, "`${1}$canonicalUrl`${3}")
            $changed = $true
            Write-Host "  [og:url]    $currentOg" -ForegroundColor DarkYellow
            Write-Host "           -> $canonicalUrl" -ForegroundColor Yellow
        }
    }

    # ---------- 3. JSON-LD @id ----------
    $scriptRegex = '(?s)(<script\s+type="application/ld\+json">)(.*?)(</script>)'
    $scriptMatches = [regex]::Matches($content, $scriptRegex)

    foreach ($sm in $scriptMatches) {
        $jsonBlock = $sm.Groups[2].Value
        $idRegex   = '("@id"\s*:\s*")([^"]+)(")'
        $idMatch   = [regex]::Match($jsonBlock, $idRegex)

        if ($idMatch.Success) {
            $currentId = $idMatch.Groups[2].Value
            if ($currentId -ne $canonicalUrl) {
                $newJsonBlock = [regex]::Replace($jsonBlock, $idRegex, "`${1}$canonicalUrl`${3}")
                $newScript    = $sm.Groups[1].Value + $newJsonBlock + $sm.Groups[3].Value
                $content      = $content.Replace($sm.Value, $newScript)
                $changed      = $true
                Write-Host "  [@id]       $currentId" -ForegroundColor DarkYellow
                Write-Host "           -> $canonicalUrl" -ForegroundColor Yellow
            }
        }
    }

    # ---------- Save ----------
    if ($changed) {
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($localFile, $content, $utf8NoBom)
        $relPath = $localFile -replace [regex]::Escape($projectRoot), ''
        Write-Host "  [SAVED]$relPath" -ForegroundColor Green
        $fixed++
    } else {
        $relPath = $localFile -replace [regex]::Escape($projectRoot), ''
        Write-Host "  [OK]$relPath" -ForegroundColor DarkGreen
        $skipped++
    }

    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "FIXED (pages modified):   $fixed" -ForegroundColor Green
Write-Host "OK    (no changes):       $skipped" -ForegroundColor DarkGreen
Write-Host "SKIP  (file not found):   $missing" -ForegroundColor DarkYellow
Write-Host "================================================" -ForegroundColor Cyan
