# Пути
$statePath = ".\seo-audit-state.json"
$logPath = ".\seo-audit-log.md"

# Проверка файлов
if (!(Test-Path $statePath)) {
    Write-Host "State file not found"
    exit
}

if (!(Test-Path $logPath)) {
    Write-Host "Log file not found"
    exit
}

# Читаем JSON
$state = Get-Content $statePath -Raw | ConvertFrom-Json

# Читаем лог
$logContent = Get-Content $logPath

# Вытаскиваем URL из лога
$logUrls = @()

foreach ($line in $logContent) {
    if ($line -match '^URL:\s+(https?://\S+)') {
        $logUrls += $matches[1]
    }
}

# Убираем дубли
$logUrls = $logUrls | Sort-Object -Unique

# Счётчик
$updated = 0

# Обновляем state
foreach ($item in $state) {
    if ($logUrls -contains $item.url) {
        if ($item.status -ne "done") {
            $item.status = "done"
            $updated++
        }
    }
}

# Сохраняем обратно
$state | ConvertTo-Json -Depth 3 | Out-File $statePath -Encoding UTF8

Write-Host "Updated URLs: $updated"
Write-Host "Total URLs in log: $($logUrls.Count)"