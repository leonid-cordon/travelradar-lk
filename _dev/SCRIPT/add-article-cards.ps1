param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('ru', 'en', 'ua')]
    [string]$Locale,

    [Parameter(Mandatory = $true)]
    [string]$ArticlePath,

    [Parameter(Mandatory = $true)]
    [string[]]$Categories,

    [string]$CountrySlug,
    [string]$RemoveLatestHref,
    [string]$CardTitle,
    [string]$CardExcerpt,
    [switch]$SkipContentIndex,
    [switch]$SkipCountryIndex,
    [switch]$SkipHomeLatest,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
$logDir = Join-Path $PSScriptRoot 'logs'
$null = New-Item -ItemType Directory -Path $logDir -Force

$timestamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$logPath = Join-Path $logDir ("article-addition-{0}-{1}.log" -f $timestamp, $Locale)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

$script:ChangeCount = 0
$script:SkipCount = 0
$script:WarnCount = 0

function Write-Log {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,

        [ValidateSet('INFO', 'STEP', 'WARN', 'DONE')]
        [string]$Level = 'INFO'
    )

    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Level, $Message
    Write-Host $line
    [System.IO.File]::AppendAllText($logPath, $line + [Environment]::NewLine, $utf8NoBom)
}

function Get-Newline {
    param([string]$Text)

    if ($Text -match "`r`n") { return "`r`n" }
    return "`n"
}

function Read-TextFile {
    param([string]$Path)

    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Write-TextFile {
    param(
        [string]$Path,
        [string]$Content
    )

    if ($DryRun) {
        Write-Log "Dry run: skipped writing $Path"
        return
    }

    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Normalize-Whitespace {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return ''
    }

    $decoded = [System.Net.WebUtility]::HtmlDecode($Text)
    $decoded = [regex]::Replace($decoded, '<[^>]+>', ' ')
    $decoded = [regex]::Replace($decoded, '\s+', ' ')
    return $decoded.Trim()
}

function Get-FileSlug {
    param([string]$PathText)

    $trimmed = $PathText.Trim().Trim('"').Trim("'")
    $fileName = [System.IO.Path]::GetFileName($trimmed.Replace('/', '\'))
    if ([string]::IsNullOrWhiteSpace($fileName) -or -not $fileName.EndsWith('.html')) {
        throw "Could not extract an .html file name from input: $PathText"
    }

    return $fileName
}

function Normalize-HomeHref {
    param([string]$HrefText)

    if ([string]::IsNullOrWhiteSpace($HrefText)) {
        return $null
    }

    $slug = Get-FileSlug -PathText $HrefText
    return "content/$slug"
}

function Infer-CountrySlug {
    param([string[]]$CategoryList)

    foreach ($category in $CategoryList) {
        $normalized = $category.Trim().ToLowerInvariant()
        switch -Regex ($normalized) {
            '^mexico$' { return 'mexico' }
            '^egypt$' { return 'egypt' }
            '^turkey$' { return 'turkey' }
        }
    }

    return $null
}

function Get-ArticleInfo {
    param(
        [string]$ArticleFile,
        [string]$Slug,
        [string]$TitleOverride,
        [string]$ExcerptOverride
    )

    if (-not (Test-Path $ArticleFile)) {
        throw "Article file not found: $ArticleFile"
    }

    $html = Read-TextFile -Path $ArticleFile

    $h1Match = [regex]::Match(
        $html,
        '<h1[^>]*>(.*?)</h1>',
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )
    $titleMatch = [regex]::Match(
        $html,
        '<title[^>]*>(.*?)</title>',
        [System.Text.RegularExpressions.RegexOptions]::Singleline
    )
    $ogDescMatch = [regex]::Match(
        $html,
        '<meta\s+property="og:description"\s+content="([^"]*)"',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    $metaDescMatch = [regex]::Match(
        $html,
        '<meta\s+name="description"\s+content="([^"]*)"',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )

    $resolvedTitle = $TitleOverride
    if ([string]::IsNullOrWhiteSpace($resolvedTitle)) {
        if ($h1Match.Success) {
            $resolvedTitle = Normalize-Whitespace -Text $h1Match.Groups[1].Value
        }
        elseif ($titleMatch.Success) {
            $resolvedTitle = Normalize-Whitespace -Text $titleMatch.Groups[1].Value
            $resolvedTitle = $resolvedTitle -replace '\s+\|\s*Travel Radar LK\s*$', ''
        }
    }

    $resolvedExcerpt = $ExcerptOverride
    if ([string]::IsNullOrWhiteSpace($resolvedExcerpt)) {
        if ($ogDescMatch.Success) {
            $resolvedExcerpt = Normalize-Whitespace -Text $ogDescMatch.Groups[1].Value
        }
        elseif ($metaDescMatch.Success) {
            $resolvedExcerpt = Normalize-Whitespace -Text $metaDescMatch.Groups[1].Value
        }
    }

    if ([string]::IsNullOrWhiteSpace($resolvedTitle)) {
        throw "Could not resolve card title from article: $ArticleFile"
    }

    if ([string]::IsNullOrWhiteSpace($resolvedExcerpt)) {
        throw "Could not resolve card excerpt from article: $ArticleFile"
    }

    $slugName = [System.IO.Path]::GetFileNameWithoutExtension($Slug)
    $imageRelative = "assets\images\content\$slugName\card_1200x600.jpg"
    $imageFile = Join-Path $projectRoot $imageRelative
    if (-not (Test-Path $imageFile)) {
        throw "Card image not found: $imageFile"
    }

    return @{
        Title = $resolvedTitle
        Excerpt = $resolvedExcerpt
        Slug = $Slug
        SlugName = $slugName
        ImageFile = $imageFile
    }
}

function Build-CardHtml {
    param(
        [string]$Href,
        [string]$ImageUrl,
        [string[]]$CategoryList,
        [string]$Title,
        [string]$Excerpt,
        [string]$Newline
    )

    $i0 = '                '
    $i1 = '                    '
    $i2 = '                        '
    $i3 = '                            '

    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add("$i0<a href=`"$Href`" class=`"content-card`">")
    $lines.Add($i1 + '<div class="content-image"')
    $lines.Add($i2 + "style=`"background-image: url('$ImageUrl');`">")
    $lines.Add($i1 + '</div>')
    $lines.Add('')
    $lines.Add($i1 + '<div class="content-body">')

    foreach ($category in $CategoryList) {
        $safeCategory = [System.Net.WebUtility]::HtmlEncode($category.Trim())
        $lines.Add($i2 + '<span class="content-category">' + $safeCategory + '</span>')
    }

    $lines.Add('')
    $lines.Add($i2 + '<h3 class="content-title">')
    $lines.Add($i3 + [System.Net.WebUtility]::HtmlEncode($Title))
    $lines.Add($i2 + '</h3>')
    $lines.Add('')
    $lines.Add($i2 + '<p class="content-excerpt">')
    $lines.Add($i3 + [System.Net.WebUtility]::HtmlEncode($Excerpt))
    $lines.Add($i2 + '</p>')
    $lines.Add($i1 + '</div>')
    $lines.Add($i0 + '</a>')
    $lines.Add('')

    return ($lines -join $Newline)
}

function Insert-CardAtTop {
    param(
        [string]$TargetFile,
        [string]$GridClass,
        [string]$CardHref,
        [string]$CardHtml
    )

    if (-not (Test-Path $TargetFile)) {
        throw "Target file not found: $TargetFile"
    }

    $content = Read-TextFile -Path $TargetFile
    $newline = Get-Newline -Text $content

    if ($content.Contains("href=`"$CardHref`" class=`"content-card`"")) {
        Write-Log "Skip insert in $TargetFile because card already exists: $CardHref"
        $script:SkipCount++
        return
    }

    $marker = '<div class="' + $GridClass + '">'
    $index = $content.IndexOf($marker)
    if ($index -lt 0) {
        throw "Could not find grid marker $marker in $TargetFile"
    }

    $insertAt = $index + $marker.Length
    $normalizedCard = $CardHtml.Replace("`r`n", "`n").Replace("`n", $newline)
    $updated = $content.Insert($insertAt, $newline + $normalizedCard)

    Write-TextFile -Path $TargetFile -Content $updated
    Write-Log "Inserted new card at top of $TargetFile"
    $script:ChangeCount++
}

function Remove-CardByHref {
    param(
        [string]$TargetFile,
        [string]$CardHref
    )

    if ([string]::IsNullOrWhiteSpace($CardHref)) {
        Write-Log "No RemoveLatestHref provided for $TargetFile; skip removal"
        $script:SkipCount++
        return
    }

    $content = Read-TextFile -Path $TargetFile
    $escapedHref = [regex]::Escape($CardHref)
    $pattern = '(?ms)^[ \t]*<a href="' + $escapedHref + '" class="content-card">.*?^[ \t]*</a>\r?\n?'

    $match = [regex]::Match($content, $pattern)
    if (-not $match.Success) {
        Write-Log "Card to remove not found in ${TargetFile}: $CardHref" 'WARN'
        $script:WarnCount++
        return
    }

    $updated = $content.Remove($match.Index, $match.Length)
    Write-TextFile -Path $TargetFile -Content $updated
    Write-Log "Removed card from ${TargetFile}: $CardHref"
    $script:ChangeCount++
}

Write-Log "Starting article card automation for locale $Locale" 'STEP'
Write-Log "Project root: $projectRoot"
Write-Log "Log file: $logPath"

$slug = Get-FileSlug -PathText $ArticlePath
$articleRelative = "$Locale\content\$slug"
$articleFile = Join-Path $projectRoot $articleRelative
$normalizedRemoveHref = Normalize-HomeHref -HrefText $RemoveLatestHref

Write-Log "Resolved article file: $articleRelative"
if ($normalizedRemoveHref) {
    Write-Log "Normalized home removal href: $normalizedRemoveHref"
}

$articleInfo = Get-ArticleInfo -ArticleFile $articleFile -Slug $slug -TitleOverride $CardTitle -ExcerptOverride $CardExcerpt
Write-Log "Card title: $($articleInfo.Title)"
Write-Log "Card excerpt: $($articleInfo.Excerpt)"

if ([string]::IsNullOrWhiteSpace($CountrySlug)) {
    $CountrySlug = Infer-CountrySlug -CategoryList $Categories
    if ($CountrySlug) {
        Write-Log "Inferred country slug: $CountrySlug"
    }
    else {
        Write-Log 'Country slug was not supplied and could not be inferred' 'WARN'
        $script:WarnCount++
    }
}
else {
    Write-Log "Using explicit country slug: $CountrySlug"
}

if (-not $SkipContentIndex) {
    Write-Log 'Stage: update locale content index' 'STEP'
    $target = Join-Path $projectRoot "$Locale\content\index.html"
    $cardHtml = Build-CardHtml `
        -Href ("./" + $slug) `
        -ImageUrl ("../../assets/images/content/{0}/card_1200x600.jpg" -f $articleInfo.SlugName) `
        -CategoryList $Categories `
        -Title $articleInfo.Title `
        -Excerpt $articleInfo.Excerpt `
        -Newline "`n"
    Insert-CardAtTop -TargetFile $target -GridClass 'destinations-grid' -CardHref ("./" + $slug) -CardHtml $cardHtml
}

if (-not $SkipCountryIndex) {
    if ([string]::IsNullOrWhiteSpace($CountrySlug)) {
        Write-Log 'Skip country page update because country slug is missing' 'WARN'
        $script:WarnCount++
    }
    else {
        Write-Log 'Stage: update locale country page' 'STEP'
        $target = Join-Path $projectRoot "$Locale\content\countries\$CountrySlug\index.html"
        if (-not (Test-Path $target)) {
            Write-Log "Country page does not exist, skipping: $target" 'WARN'
            $script:WarnCount++
        }
        else {
            $cardHtml = Build-CardHtml `
                -Href ("/{0}/content/{1}" -f $Locale, $slug) `
                -ImageUrl ("/assets/images/content/{0}/card_1200x600.jpg" -f $articleInfo.SlugName) `
                -CategoryList $Categories `
                -Title $articleInfo.Title `
                -Excerpt $articleInfo.Excerpt `
                -Newline "`n"
            Insert-CardAtTop -TargetFile $target -GridClass 'destinations-grid' -CardHref ("/{0}/content/{1}" -f $Locale, $slug) -CardHtml $cardHtml
        }
    }
}

if (-not $SkipHomeLatest) {
    Write-Log 'Stage: update locale home latest materials' 'STEP'
    $target = Join-Path $projectRoot "$Locale\index.html"
    Remove-CardByHref -TargetFile $target -CardHref $normalizedRemoveHref
    $cardHtml = Build-CardHtml `
        -Href ("content/" + $slug) `
        -ImageUrl ("../assets/images/content/{0}/card_1200x600.jpg" -f $articleInfo.SlugName) `
        -CategoryList $Categories `
        -Title $articleInfo.Title `
        -Excerpt $articleInfo.Excerpt `
        -Newline "`n"
    Insert-CardAtTop -TargetFile $target -GridClass 'content-grid' -CardHref ("content/" + $slug) -CardHtml $cardHtml
}

Write-Log "Finished locale $Locale" 'DONE'
Write-Log ("Changes: {0}; skips: {1}; warnings: {2}" -f $script:ChangeCount, $script:SkipCount, $script:WarnCount) 'DONE'
Write-Log "Review log saved to: $logPath" 'DONE'
