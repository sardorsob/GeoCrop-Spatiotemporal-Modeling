param(
  [string[]]$Paths = @("."),
  [string[]]$Extensions = @(".js", ".jsx", ".ts", ".tsx", ".py", ".go", ".rs", ".java", ".cs", ".php", ".swift", ".kt", ".sql", ".json", ".yml", ".yaml")
)

$patterns = @(
  "console\.log",
  ": any",
  "service_role",
  "SERVICE_ROLE",
  "api[_-]?key\s*=",
  "password\s*=",
  "TODO",
  "FIXME"
)

$failed = $false
$rawFiles = foreach ($path in $Paths) {
  if (Test-Path -LiteralPath $path -PathType Container) {
    Get-ChildItem -LiteralPath $path -Recurse -File -ErrorAction SilentlyContinue
  } elseif (Test-Path -LiteralPath $path -PathType Leaf) {
    Get-Item -LiteralPath $path
  }
}

$files = $rawFiles | Where-Object {
  $Extensions -contains $_.Extension
}

foreach ($pattern in $patterns) {
  $matches = foreach ($file in $files) {
    Select-String -LiteralPath $file.FullName -Pattern $pattern -ErrorAction SilentlyContinue
  }
  if ($matches) {
    $failed = $true
    Write-Host "FAIL pattern: $pattern"
    $matches | ForEach-Object {
      Write-Host ("{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim())
    }
  }
}

if (-not $failed) {
  Write-Host "PASS: QA grep found no blocked patterns"
  exit 0
}

exit 1
