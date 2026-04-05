
$base = "D:\Projects\WEB_Travel_Radar_LK"
$stateFile = "$base\seo-audit-state.json"

$state = Get-Content $stateFile -Raw | ConvertFrom-Json
$batch = $state | Where-Object { $_.status -eq "pending" } | Select-Object -First 10

if ($batch.Count -eq 0) {
    Write-Host "Аудит завершён. Все URL обработаны."
    exit
}

Write-Host "=== БАТЧ: $($batch.Count) URL ==="

foreach ($item in $batch) {
    $url = $item.url
    $rel = $url -replace 'https://travelradarlk\.com/', ''
    if ($rel -match '/$') { $rel = $rel + "index.html" }
    $rel = $rel -replace '/', '\'
    $filePath = "$base\$rel"
    $issues = @()

    if (-not (Test-Path $filePath)) {
        Write-Host "`n---"
        Write-Host "URL: $url"
        Write-Host "STATUS: ISSUE"
        Write-Host "  - Файл не найден: $rel"
        ($state | Where-Object { $_.url -eq $url }).status = "done"
        continue
    }

    $html = [System.IO.File]::ReadAllText($filePath)

    # Title
    $m = [regex]::Match($html, '<title[^>]*>([^<]{1,200})</title>')
    if ($m.Success) {
        $tlen = $m.Groups[1].Value.Trim().Length
        if ($tlen -lt 30 -or $tlen -gt 70) { $issues += "Title length=$tlen (rec 30-70)" }
    } else { $issues += "Title MISSING" }

    # Meta description
    if ($html.Contains('name="description"') -or $html.Contains("name='description'")) {
        # ok
    } else { $issues += "Meta description MISSING" }

    # H1 count
    $h1c = 0; $p = 0
    while (($p = $html.IndexOf('<h1', $p)) -ge 0) { $h1c++; $p++ }
    if ($h1c -eq 0) { $issues += "H1 MISSING" }
    elseif ($h1c -gt 1) { $issues += "H1 multiple ($h1c)" }

    # Canonical
    $can = ""
    $m2 = [regex]::Match($html, 'rel="canonical"\s+href="([^"]+)"')
    if (-not $m2.Success) { $m2 = [regex]::Match($html, 'href="([^"]+)"\s+rel="canonical"') }
    if ($m2.Success) { $can = $m2.Groups[1].Value }
    if ($can -eq "") { $issues += "Canonical MISSING" }
    elseif ($can -ne $url) { $issues += "Canonical MISMATCH: $can" }

    # og:url
    $m3 = [regex]::Match($html, 'property="og:url"\s+content="([^"]+)"')
    if (-not $m3.Success) { $m3 = [regex]::Match($html, 'content="([^"]+)"\s+property="og:url"') }
    if ($m3.Success) {
        $ogUrl = $m3.Groups[1].Value
        if ($can -ne "" -and $ogUrl -ne $can) { $issues += "og:url != canonical ($ogUrl)" }
    } else { $issues += "og:url MISSING" }

    # JSON-LD @id
    if ($html.Contains('"@type"')) {
        $m4 = [regex]::Match($html, '"@id"\s*:\s*"(https://[^"]+)"')
        if ($m4.Success) {
            $jid = $m4.Groups[1].Value
            if ($can -ne "" -and $jid -ne $can) { $issues += "JSON-LD @id != canonical" }
        } else { $issues += "JSON-LD @id MISSING" }
    }

    # noindex
    if ($html.Contains('noindex')) { $issues += "NOINDEX detected" }

    $status = if ($issues.Count -eq 0) { "OK" } else { "ISSUE" }
    Write-Host "`n---"
    Write-Host "URL: $url"
    Write-Host "STATUS: $status"
    if ($issues.Count -gt 0) {
        $issues | Select-Object -First 5 | ForEach-Object { Write-Host "  - $_" }
    }

    ($state | Where-Object { $_.url -eq $url }).status = "done"
}

$state | ConvertTo-Json -Depth 5 | Set-Content $stateFile -Encoding UTF8
Write-Host "`n=== JSON обновлён. Батч завершён. ==="
$remaining = ($state | Where-Object { $_.status -eq "pending" }).Count
Write-Host "Осталось pending: $remaining"
