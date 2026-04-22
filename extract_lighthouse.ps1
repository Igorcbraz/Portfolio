param(
    [string]$ReportDir = (Join-Path $PSScriptRoot "seo-agent\reports"),
    [string]$ProgressFile = (Join-Path $PSScriptRoot "SEO_PROGRESS.md"),
    [string]$McpDeleteList = (Join-Path $PSScriptRoot "seo-agent\reports\mcp-delete-list.txt"),
    [int]$KeepRecentValid = 3,
    [bool]$UpdateProgress = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RelativePathSafe {
    param(
        [Parameter(Mandatory = $true)][string]$BasePath,
        [Parameter(Mandatory = $true)][string]$TargetPath
    )

    $base = [System.IO.Path]::GetFullPath($BasePath).TrimEnd('\', '/')
    $target = [System.IO.Path]::GetFullPath($TargetPath)

    if ($target.StartsWith($base, [System.StringComparison]::OrdinalIgnoreCase)) {
        $relative = $target.Substring($base.Length).TrimStart('\', '/')
        if ([string]::IsNullOrWhiteSpace($relative)) {
            return "."
        }
        return $relative -replace '\\', '/'
    }

    return $target -replace '\\', '/'
}

function Convert-ScoreTo100 {
    param([AllowNull()][object]$Score)

    if ($null -eq $Score) {
        return "n/a"
    }

    try {
        return [int][Math]::Round(([double]$Score) * 100)
    } catch {
        return "n/a"
    }
}

function Get-AuditValue {
    param(
        [Parameter(Mandatory = $true)][object]$Json,
        [Parameter(Mandatory = $true)][string]$AuditId
    )

    if ($null -eq $Json.audits) {
        return "n/a"
    }

    $auditProp = $Json.audits.PSObject.Properties[$AuditId]
    if ($null -eq $auditProp) {
        return "n/a"
    }

    $audit = $auditProp.Value
    $numeric = $null
    if ($null -ne $audit.numericValue) {
        try {
            $numeric = [double]$audit.numericValue
        } catch {
            $numeric = $null
        }
    }

    switch ($AuditId) {
        "first-contentful-paint" {
            if ($null -ne $numeric) {
                return ([double]($numeric / 1000.0)).ToString("0.0", [System.Globalization.CultureInfo]::InvariantCulture) + " s"
            }
        }
        "largest-contentful-paint" {
            if ($null -ne $numeric) {
                return ([double]($numeric / 1000.0)).ToString("0.0", [System.Globalization.CultureInfo]::InvariantCulture) + " s"
            }
        }
        "speed-index" {
            if ($null -ne $numeric) {
                return ([double]($numeric / 1000.0)).ToString("0.0", [System.Globalization.CultureInfo]::InvariantCulture) + " s"
            }
        }
        "total-blocking-time" {
            if ($null -ne $numeric) {
                return ("{0} ms" -f [int][Math]::Round($numeric))
            }
        }
        "cumulative-layout-shift" {
            if ($null -ne $numeric) {
                return ([double]$numeric).ToString("0.###", [System.Globalization.CultureInfo]::InvariantCulture)
            }
        }
    }

    if ($null -ne $audit.displayValue -and -not [string]::IsNullOrWhiteSpace([string]$audit.displayValue)) {
        $display = [string]$audit.displayValue
        $display = $display -replace '[^\x20-\x7E]', ' '
        $display = ($display -replace '\s+', ' ').Trim()
        return $display
    }

    if ($null -ne $numeric) {
        return ([double]$numeric).ToString("0.###", [System.Globalization.CultureInfo]::InvariantCulture)
    }

    return "n/a"
}

function Test-ValidReport {
    param([Parameter(Mandatory = $true)][object]$Json)

    if ($null -eq $Json.categories) {
        return $false
    }

    $requiredCategories = @(
        "performance",
        "accessibility",
        "seo",
        "best-practices"
    )

    foreach ($category in $requiredCategories) {
        $entry = $Json.categories.$category
        if ($null -eq $entry -or $null -eq $entry.score) {
            return $false
        }
    }

    return $true
}

function Get-StatusLabel {
    param([Parameter(Mandatory = $true)][object]$Json)

    if (Test-ValidReport -Json $Json) {
        return "valid"
    }

    if ($null -ne $Json.categories) {
        return "partial"
    }

    return "invalid"
}

function Format-Now {
    return (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}

if (-not (Test-Path $ReportDir -PathType Container)) {
    throw "ReportDir not found: $ReportDir"
}

$workspaceRoot = $PSScriptRoot
$reportFiles = Get-ChildItem -Path $ReportDir -Filter "lighthouse-iteration-*.json" -File | Sort-Object Name
$reportItems = New-Object System.Collections.Generic.List[object]

foreach ($file in $reportFiles) {
    $relativePath = Get-RelativePathSafe -BasePath $workspaceRoot -TargetPath $file.FullName
    Write-Host "--- Processing File: $relativePath ---"

    $iteration = $null
    $iterationMatch = [regex]::Match($file.Name, "lighthouse-iteration-(\d+)")
    if ($iterationMatch.Success) {
        $iteration = [int]$iterationMatch.Groups[1].Value
    }

    try {
        $json = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json -ErrorAction Stop
        $status = Get-StatusLabel -Json $json
        $isValid = $status -eq "valid"

        $performance = Convert-ScoreTo100 -Score $json.categories.performance.score
        $accessibility = Convert-ScoreTo100 -Score $json.categories.accessibility.score
        $bestPractices = Convert-ScoreTo100 -Score $json.categories.'best-practices'.score
        $seo = Convert-ScoreTo100 -Score $json.categories.seo.score

        Write-Host "STATUS: $status"
        Write-Host "lighthouseVersion: $($json.lighthouseVersion)"
        Write-Host "fetchTime: $($json.fetchTime)"
        Write-Host "finalUrl: $($json.finalUrl)"
        Write-Host "Performance: $performance | Accessibility: $accessibility | Best Practices: $bestPractices | SEO: $seo"
        Write-Host "FCP: $(Get-AuditValue -Json $json -AuditId 'first-contentful-paint')"
        Write-Host "LCP: $(Get-AuditValue -Json $json -AuditId 'largest-contentful-paint')"
        Write-Host "TBT: $(Get-AuditValue -Json $json -AuditId 'total-blocking-time')"
        Write-Host "Speed Index: $(Get-AuditValue -Json $json -AuditId 'speed-index')"
        Write-Host "CLS: $(Get-AuditValue -Json $json -AuditId 'cumulative-layout-shift')"

        $reportItems.Add([pscustomobject]@{
            Name = $file.Name
            RelativePath = $relativePath
            FullPath = $file.FullName
            Iteration = $iteration
            Status = $status
            IsValid = $isValid
            FetchTime = [string]$json.fetchTime
            FinalUrl = [string]$json.finalUrl
            LighthouseVersion = [string]$json.lighthouseVersion
            Performance = $performance
            Accessibility = $accessibility
            BestPractices = $bestPractices
            Seo = $seo
            FCP = Get-AuditValue -Json $json -AuditId "first-contentful-paint"
            LCP = Get-AuditValue -Json $json -AuditId "largest-contentful-paint"
            TBT = Get-AuditValue -Json $json -AuditId "total-blocking-time"
            SpeedIndex = Get-AuditValue -Json $json -AuditId "speed-index"
            CLS = Get-AuditValue -Json $json -AuditId "cumulative-layout-shift"
        })
    } catch {
        Write-Host "STATUS: invalid (failed to parse JSON)"
        $reportItems.Add([pscustomobject]@{
            Name = $file.Name
            RelativePath = $relativePath
            FullPath = $file.FullName
            Iteration = $iteration
            Status = "invalid"
            IsValid = $false
            FetchTime = "n/a"
            FinalUrl = "n/a"
            LighthouseVersion = "n/a"
            Performance = "n/a"
            Accessibility = "n/a"
            BestPractices = "n/a"
            Seo = "n/a"
            FCP = "n/a"
            LCP = "n/a"
            TBT = "n/a"
            SpeedIndex = "n/a"
            CLS = "n/a"
        })
    }

    Write-Host ""
}

$validReports = @($reportItems | Where-Object { $_.IsValid -eq $true } | Sort-Object Iteration, Name)
$partialReports = @($reportItems | Where-Object { $_.Status -eq "partial" })
$invalidReports = @($reportItems | Where-Object { $_.Status -eq "invalid" })

$cleanupMap = @{}

foreach ($group in ($reportItems | Group-Object Iteration)) {
    if ($null -eq $group.Name -or [string]::IsNullOrWhiteSpace([string]$group.Name)) {
        continue
    }

    $validInIteration = @($group.Group | Where-Object { $_.IsValid -eq $true } | Sort-Object Name)
    if ($validInIteration.Count -gt 0) {
        foreach ($item in @($group.Group | Where-Object { $_.IsValid -eq $false })) {
            $cleanupMap[$item.RelativePath] = "iteration resolvida: existe report valid para a mesma iteracao"
        }
    }

    if ($validInIteration.Count -gt 1) {
        $keepItem = $validInIteration[-1]
        foreach ($item in $validInIteration) {
            if ($item.RelativePath -ne $keepItem.RelativePath) {
                $cleanupMap[$item.RelativePath] = "duplicado valid na mesma iteracao"
            }
        }
    }
}

if ($validReports.Count -gt $KeepRecentValid) {
    $orderedByIteration = @($validReports | Sort-Object Iteration -Descending)
    $toDrop = @($orderedByIteration | Select-Object -Skip $KeepRecentValid)

    foreach ($item in $toDrop) {
        if (-not $cleanupMap.ContainsKey($item.RelativePath)) {
            $cleanupMap[$item.RelativePath] = "valid antigo fora da janela de retencao KeepRecentValid=$KeepRecentValid"
        }
    }
}

$cleanupItems = @()
foreach ($entry in $cleanupMap.GetEnumerator() | Sort-Object Key) {
    $cleanupItems += [pscustomobject]@{
        RelativePath = [string]$entry.Key
        Reason = [string]$entry.Value
    }
}

$latestValid = $null
if ($validReports.Count -gt 0) {
    $latestValid = @($validReports | Sort-Object -Property Iteration, Name -Descending)[0]
}

$summaryLines = New-Object System.Collections.Generic.List[string]
$summaryLines.Add("### Auto Lighthouse Summary")
$summaryLines.Add("")
$summaryLines.Add("- Updated at: $(Format-Now)")
$summaryLines.Add("- Reports scanned: $($reportItems.Count)")
$summaryLines.Add("- Valid: $($validReports.Count) | Partial: $($partialReports.Count) | Invalid: $($invalidReports.Count)")

if ($null -ne $latestValid) {
    $summaryLines.Add("- Latest valid: $($latestValid.Name) (Iter $($latestValid.Iteration)) | Perf $($latestValid.Performance), A11y $($latestValid.Accessibility), BP $($latestValid.BestPractices), SEO $($latestValid.Seo)")
    $summaryLines.Add("- Latest valid metrics: FCP $($latestValid.FCP), LCP $($latestValid.LCP), TBT $($latestValid.TBT), Speed Index $($latestValid.SpeedIndex), CLS $($latestValid.CLS)")
}

$summaryLines.Add("")
$summaryLines.Add("### Reports Inventory")
$summaryLines.Add("")

if ($reportItems.Count -eq 0) {
    $summaryLines.Add("- No reports found in $(Get-RelativePathSafe -BasePath $workspaceRoot -TargetPath $ReportDir).")
} else {
    foreach ($item in ($reportItems | Sort-Object Iteration, Name)) {
        $iterLabel = if ($null -ne $item.Iteration) { "Iter $($item.Iteration)" } else { "Iter n/a" }
        $summaryLines.Add("- $($item.RelativePath) | $iterLabel | $($item.Status) | Perf $($item.Performance), A11y $($item.Accessibility), BP $($item.BestPractices), SEO $($item.Seo)")
    }
}

$summaryLines.Add("")
$summaryLines.Add("### MCP Cleanup Queue")
$summaryLines.Add("")

if ($cleanupItems.Count -eq 0) {
    $summaryLines.Add("- No files ready for deletion.")
} else {
    foreach ($item in $cleanupItems) {
        $summaryLines.Add("- $($item.RelativePath) -> $($item.Reason)")
    }
}

$summaryText = ($summaryLines -join "`r`n")

$startMarker = "<!-- LIGHTHOUSE_AUTO_SUMMARY_START -->"
$endMarker = "<!-- LIGHTHOUSE_AUTO_SUMMARY_END -->"
$autoSection = @(
    $startMarker,
    $summaryText,
    $endMarker
) -join "`r`n"

if ($UpdateProgress) {
    if (-not (Test-Path $ProgressFile -PathType Leaf)) {
        throw "ProgressFile not found: $ProgressFile"
    }

    $progressContent = Get-Content -Path $ProgressFile -Raw
    $escapedStart = [regex]::Escape($startMarker)
    $escapedEnd = [regex]::Escape($endMarker)
    $pattern = "(?s)$escapedStart.*?$escapedEnd"

    if ($progressContent -match $pattern) {
        $progressContent = [regex]::Replace($progressContent, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $autoSection }, 1)
    } else {
        $progressContent = $progressContent.TrimEnd() + "`r`n`r`n" + "## Automation" + "`r`n`r`n" + $autoSection + "`r`n"
    }

    Set-Content -Path $ProgressFile -Value $progressContent -Encoding UTF8
    Write-Host "Updated SEO progress summary in: $(Get-RelativePathSafe -BasePath $workspaceRoot -TargetPath $ProgressFile)"
}

$mcpLines = New-Object System.Collections.Generic.List[string]
$mcpLines.Add("# Auto-generated by extract_lighthouse.ps1 at $(Format-Now)")

if ($cleanupItems.Count -eq 0) {
    $mcpLines.Add("# No files ready for deletion")
} else {
    foreach ($item in $cleanupItems) {
        $mcpLines.Add($item.RelativePath)
    }
}

$mcpDir = Split-Path -Path $McpDeleteList -Parent
if (-not (Test-Path $mcpDir -PathType Container)) {
    New-Item -ItemType Directory -Path $mcpDir -Force | Out-Null
}

Set-Content -Path $McpDeleteList -Value ($mcpLines -join "`r`n") -Encoding UTF8

Write-Host ""
Write-Host "--- Summary ---"
Write-Host "Reports scanned: $($reportItems.Count)"
Write-Host "Valid: $($validReports.Count) | Partial: $($partialReports.Count) | Invalid: $($invalidReports.Count)"
Write-Host "MCP delete list: $(Get-RelativePathSafe -BasePath $workspaceRoot -TargetPath $McpDeleteList)"

