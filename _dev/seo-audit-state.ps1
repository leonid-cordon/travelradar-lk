# Путь к sitemap
$sitemapPath = ".\sitemap.xml"

# Путь к выходному JSON
$outputPath = ".\seo-audit-state.json"

# Читаем sitemap
[xml]$sitemap = Get-Content $sitemapPath

# Извлекаем все URL
$urls = $sitemap.urlset.url.loc | ForEach-Object { $_.Trim() }

# Убираем дубли
$uniqueUrls = $urls | Sort-Object -Unique

# Формируем структуру
$result = @()

foreach ($url in $uniqueUrls) {
    $result += [PSCustomObject]@{
        url    = $url
        status = "pending"
    }
}

# Сохраняем JSON
$result | ConvertTo-Json -Depth 3 | Out-File $outputPath -Encoding UTF8

Write-Host "SEO state file created:"
Write-Host $outputPath
Write-Host ("Total URLs: " + $result.Count)