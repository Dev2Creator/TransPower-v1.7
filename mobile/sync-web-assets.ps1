$ErrorActionPreference = 'Stop'

$mobileRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$appRoot = Split-Path -Parent $mobileRoot
$sourceRoot = $appRoot
$stageRoot = Join-Path $env:TEMP ("transpower-v7-mobile-sync-stage-" + [guid]::NewGuid().ToString('N'))
$wwwRoot = Join-Path $mobileRoot 'www'
$androidAssetsRoot = Join-Path $mobileRoot 'android\app\src\main\assets-v7'
$androidPublicRoot = Join-Path $androidAssetsRoot 'public'

$filesToCopy = @(
  'index.html',
  'style.css',
  'script-v7.js',
  'llm-worker-v7.js',
  'data.js',
  'sw.js',
  'tts-worker.js',
  'manifest.json',
  'transformers-v3.min.js'
)

function Assert-InsidePath {
  param(
    [string]$RootPath,
    [string]$CandidatePath
  )

  $resolvedRoot = [System.IO.Path]::GetFullPath($RootPath)
  $resolvedCandidate = [System.IO.Path]::GetFullPath($CandidatePath)
  if (-not $resolvedCandidate.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to modify path outside root: $resolvedCandidate"
  }
}

function Reset-Directory {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
    return
  }

  Assert-InsidePath -RootPath $mobileRoot -CandidatePath $Path
  Get-ChildItem -LiteralPath $Path -Force | Remove-Item -Recurse -Force
}

function Copy-AppFiles {
  param(
    [string]$TargetRoot,
    [bool]$ResetFirst = $true
  )

  if ($ResetFirst) {
    Reset-Directory -Path $TargetRoot
  } elseif (-not (Test-Path $TargetRoot)) {
    New-Item -ItemType Directory -Path $TargetRoot | Out-Null
  }

  foreach ($file in $filesToCopy) {
    Copy-Item -LiteralPath (Join-Path $sourceRoot $file) -Destination (Join-Path $TargetRoot $file) -Force
  }

  $assetsRoot = Join-Path $TargetRoot 'assets'
  $assetsJsRoot = Join-Path $assetsRoot 'js'
  $assetsModelRoot = Join-Path $assetsRoot 'model'
  $sweetheartModelRoot = Join-Path $assetsModelRoot 'Sweetheart-135M'

  New-Item -ItemType Directory -Path $assetsJsRoot -Force | Out-Null
  New-Item -ItemType Directory -Path $sweetheartModelRoot -Force | Out-Null

  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\mascot.png') -Destination (Join-Path $assetsRoot 'mascot.png') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\js\transformers-v3.min.js') -Destination (Join-Path $assetsJsRoot 'transformers-v3.min.js') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\js\transformers.min.js') -Destination (Join-Path $assetsJsRoot 'transformers.min.js') -Force

  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\config.json') -Destination (Join-Path $sweetheartModelRoot 'config.json') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\generation_config.json') -Destination (Join-Path $sweetheartModelRoot 'generation_config.json') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\special_tokens_map.json') -Destination (Join-Path $sweetheartModelRoot 'special_tokens_map.json') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\tokenizer.json') -Destination (Join-Path $sweetheartModelRoot 'tokenizer.json') -Force
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\tokenizer_config.json') -Destination (Join-Path $sweetheartModelRoot 'tokenizer_config.json') -Force
  New-Item -ItemType Directory -Path (Join-Path $sweetheartModelRoot 'onnx') -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $sourceRoot 'assets\model\Sweetheart-135M\onnx\model_quantized.onnx') -Destination (Join-Path $sweetheartModelRoot 'onnx\model_quantized.onnx') -Force
}

Copy-AppFiles -TargetRoot $stageRoot -ResetFirst $true

if (-not (Test-Path $androidPublicRoot)) {
  New-Item -ItemType Directory -Path $androidPublicRoot -Force | Out-Null
}

if (-not (Test-Path $wwwRoot)) {
  New-Item -ItemType Directory -Path $wwwRoot -Force | Out-Null
}

robocopy $stageRoot $wwwRoot /MIR /NFL /NDL /NJH /NJS /NC /NS | Out-Null
robocopy $stageRoot $androidPublicRoot /MIR /NFL /NDL /NJH /NJS /NC /NS | Out-Null
Copy-Item -LiteralPath (Join-Path $mobileRoot 'android\app\src\main\assets\capacitor.config.json') -Destination (Join-Path $androidAssetsRoot 'capacitor.config.json') -Force
Copy-Item -LiteralPath (Join-Path $mobileRoot 'android\app\src\main\assets\capacitor.plugins.json') -Destination (Join-Path $androidAssetsRoot 'capacitor.plugins.json') -Force

Write-Output "Synced v7 web assets to:"
Write-Output " - $wwwRoot"
Write-Output " - $androidPublicRoot"
