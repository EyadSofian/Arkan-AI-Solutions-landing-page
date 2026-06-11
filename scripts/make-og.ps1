# Generates public/og-image.png (1200x630) in the Atelier brand system
# (warm paper / warm ink / clay keystone).
# Run:  powershell -ExecutionPolicy Bypass -File scripts/make-og.ps1
Add-Type -AssemblyName System.Drawing

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Palette
$paper = [System.Drawing.Color]::FromArgb(255, 244, 241, 233)
$ink   = [System.Drawing.Color]::FromArgb(255, 28, 26, 20)
$clay  = [System.Drawing.Color]::FromArgb(255, 181, 83, 43)
$muted = [System.Drawing.Color]::FromArgb(255, 108, 102, 90)

# Background — warm paper
$g.Clear($paper)

# Faint blueprint grid
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(12, 28, 26, 20), 1)
for ($x = 0; $x -le $W; $x += 60) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
for ($y = 0; $y -le $H; $y += 60) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

# Registration corners
$corner = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 28, 26, 20), 2.5)
$m = 54; $len = 26
$g.DrawLine($corner, $m, $m, ($m + $len), $m); $g.DrawLine($corner, $m, $m, $m, ($m + $len))
$g.DrawLine($corner, ($W - $m), $m, ($W - $m - $len), $m); $g.DrawLine($corner, ($W - $m), $m, ($W - $m), ($m + $len))
$g.DrawLine($corner, $m, ($H - $m), ($m + $len), ($H - $m)); $g.DrawLine($corner, $m, ($H - $m), $m, ($H - $m - $len))
$g.DrawLine($corner, ($W - $m), ($H - $m), ($W - $m - $len), ($H - $m)); $g.DrawLine($corner, ($W - $m), ($H - $m), ($W - $m), ($H - $m - $len))

# ── Pillars mark (ink + clay keystone) ──
$inkB  = New-Object System.Drawing.SolidBrush($ink)
$inkB2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 28, 26, 20))
$clayB = New-Object System.Drawing.SolidBrush($clay)
$mutedB = New-Object System.Drawing.SolidBrush($muted)
$base  = 392
$g.FillRectangle($inkB,  100, ($base - 70),  16, 70)
$g.FillRectangle($inkB,  126, ($base - 100), 16, 100)
$g.FillRectangle($inkB2, 152, ($base - 130), 16, 130)
$g.FillRectangle($clayB, 178, ($base - 168), 16, 168)
$g.FillRectangle($inkB,  92, $base, 110, 9)

# ── Text ──
$fMono   = New-Object System.Drawing.Font("Consolas", 17, [System.Drawing.FontStyle]::Bold)
$fHead   = New-Object System.Drawing.Font("Georgia", 60, [System.Drawing.FontStyle]::Regular)
$fHeadI  = New-Object System.Drawing.Font("Georgia", 60, [System.Drawing.FontStyle]::Italic)
$fSans   = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular)
$fMonoSm = New-Object System.Drawing.Font("Consolas", 16, [System.Drawing.FontStyle]::Regular)

$tx = 280.0
$g.DrawString("ARKAN  —  AI SYSTEMS", $fMono, $clayB, $tx, 132)
$g.DrawString("The structure your", $fHead, $inkB, ($tx - 6), 168)
$g.DrawString("operations run on.", $fHeadI, $clayB, ($tx - 6), 248)
$g.DrawString("Arabic-first AI systems · automation · integration.", $fSans, $inkB, $tx, 372)
$g.DrawString("EGYPT  ·  SAUDI ARABIA  ·  UAE", $fMonoSm, $mutedB, $tx, 414)

$rulePen = New-Object System.Drawing.Pen($clay, 2)
$g.DrawLine($rulePen, [single]$tx, 486, 900, 486)
$g.DrawString("arkan.ai", $fMonoSm, $mutedB, $tx, 502)

$out = Join-Path (Split-Path $PSScriptRoot -Parent) "public\og-image.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "saved: $out"
