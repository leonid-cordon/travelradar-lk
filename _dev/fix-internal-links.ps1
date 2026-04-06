# fix-internal-links.ps1
# Finds internal links missing .html extension and adds it based on sitemap.xml

$projectRoot = $PSScriptRoot
$sitemapPath  = Join-Path $projectRoot "sitemap.xml"
$utf8NoBom    = New-Object System.Text.UTF8Encoding $false
$baseUrl      = "https://travelradarlk.com"

Write-Host "=== fix-internal-links ===" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"
Write-Host ""

# ── STEP 1: Build set of .html paths from sitemap ─────────────────────────────
[xml]$sitemap = Get-Content $sitemapPath -Encoding UTF8

# Extract paths of .html pages (e.g. "/en/content/hotel-rating-9-trap.html")
$htmlPathsInSitemap = @{}
foreach ($loc in $sitemap.urlset.url.loc) {
    if ($loc -match "\.html$") {
        $path = $loc.Replace($baseUrl, "")
        $htmlPathsInSitemap[$path] = $true

        # Also index the path WITHOUT .html so we can detect missing extension
        $pathWithout = $path -replace "\.html$", ""
        $htmlPathsInSitemap["__without__$pathWithout"] = $path  # maps no-ext → correct path
    }
}

$htmlPageCount = ($htmlPathsInSitemap.Keys | Where-Object { $_ -notmatch "^__without__" }).Count
Write-Host "HTML pages in sitemap: $htmlPageCount" -ForegroundColor Yellow

# ── STEP 2: Scan all HTML files ───────────────────────────────────────────────
$allHtmlFiles = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.html" |
    Where-Object { $_.FullName -notmatch "\\node_modules\\" }

Write-Host "HTML files to scan: $($allHtmlFiles.Count)" -ForegroundColor Yellow
Write-Host ""

$totalLinksFixed = 0
$pagesAffected   = 0

# Regex to match href attributes
$hrefPattern = '(<a\s[^>]*href=")([^"#][^"]*?)(")'

foreach ($file in $allHtmlFiles) {
    $content  = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    $fileFixed = 0

    $matches2 = [System.Text.RegularExpressions.Regex]::Matches($content, $hrefPattern)

    foreach ($m in $matches2) {
        $before = $m.Groups[1].Value
        $href   = $m.Groups[2].Value
        $after  = $m.Groups[3].Value
        $full   = $m.Groups[0].Value

        # Skip: external links, anchors, mailto/tel, already has .html, already is directory (ends /)
        if ($href -match "^https?://" )  { continue }
        if ($href -match "^mailto:"   )  { continue }
        if ($href -match "^tel:"      )  { continue }
        if ($href -match "\.html"     )  { continue }
        if ($href -match "/$"         )  { continue }  # directory link
        if ($href -match "^\."        -and $href -notmatch "^\./[^/]")  { continue }
        if ($href -eq "/"             )  { continue }

        # Normalize to absolute path for lookup
        # href can be absolute (/en/content/foo) or relative (./foo, ../foo, foo)
        $absPath = $null
        if ($href -match "^/") {
            $absPath = $href
        } else {
            # Resolve relative path based on file location
            $fileRelDir = $file.DirectoryName.Replace($projectRoot, "").Replace("\", "/").TrimStart("/")
            if ($fileRelDir -ne "") {
                $combined = "/$fileRelDir/$href"
            } else {
                $combined = "/$href"
            }
            # Resolve .. and . 
            $parts = $combined.Split("/") | Where-Object { $_ -ne "." }
            $resolved = [System.Collections.Generic.List[string]]::new()
            foreach ($part in $parts) {
                if ($part -eq "..") {
                    if ($resolved.Count -gt 0) { $resolved.RemoveAt($resolved.Count - 1) }
                } elseif ($part -ne "") {
                    $resolved.Add($part)
                }
            }
            $absPath = "/" + ($resolved -join "/")
        }

        # Check if this path WITHOUT .html exists as a key mapping to .html version
        $lookupKey = "__without__$absPath"
        if ($htmlPathsInSitemap.ContainsKey($lookupKey)) {
            $correctPath = $htmlPathsInSitemap[$lookupKey]  # e.g. /en/content/hotel-rating-9-trap.html

            # Build the new href: preserve original form (absolute vs relative) + add .html
            $newHref = $href + ".html"
            $newTag  = "$before$newHref$after"

            # Simple exact string replacement (safe, no regex escaping issues)
            $content = $content.Replace($full, $newTag)

            Write-Host "  [$($file.Name)] $href → $newHref" -ForegroundColor Yellow
            $fileFixed++
        }
    }

    if ($fileFixed -gt 0) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
        Write-Host "  FIXED ($fileFixed link(s)): $($file.FullName.Replace($projectRoot,''))" -ForegroundColor Green
        $totalLinksFixed += $fileFixed
        $pagesAffected++
    }
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Links fixed:    $totalLinksFixed" -ForegroundColor Green
Write-Host "Pages affected: $pagesAffected"  -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan
