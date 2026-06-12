$ErrorActionPreference = 'Stop'

$mobileRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$androidRoot = Join-Path $mobileRoot 'android'
$gradleWrapper = Join-Path $androidRoot 'gradlew.bat'
$syncScript = Join-Path $mobileRoot 'sync-web-assets.ps1'

if (-not (Test-Path $gradleWrapper)) {
  throw "Gradle wrapper not found at $gradleWrapper"
}

& $syncScript

Push-Location $androidRoot
try {
  & $gradleWrapper assembleRelease
} finally {
  Pop-Location
}

$apkRoot = Join-Path $androidRoot 'app\build\outputs\apk\release'
$apks = Get-ChildItem -Path $apkRoot -Filter '*.apk' -ErrorAction SilentlyContinue
if ($apks) {
  Write-Output "APK ready:"
  $apks | ForEach-Object { Write-Output $_.FullName }
} else {
  throw "Gradle finished without producing release APKs under $apkRoot"
}
