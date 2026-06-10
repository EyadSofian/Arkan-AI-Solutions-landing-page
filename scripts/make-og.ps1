# Generates public/og-image.png (1200x630) in the Steel-Blue brand system.
# Run:  powershell -ExecutionPolicy Bypass -File scripts/make-og.ps1
Add-Type -AssemblyName System.Drawing

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background — Navy 950
$g.Clear([System.Drawing.Color]::FromArgb(255, 6, 9, 18))

# Blueprint grid
$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(13, 96, 165, 250), 1)
for ($x = 0; $x -le $W; $x += 72) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
for ($y = 0; $y -le $H; $y += 72) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

# Soft glow behind the mark
for ($i = 14; $i -ge 1; $i--) {
  $glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb([int](2 * $i), 37, 99, 235))
  $r = 26 * $i
  $g.FillEllipse($glow, 200 - $r, 315 - $r, 2 * $r, 2 * $r)
}

# ── Pillar mark, scale 3.2 at origin (92,150) ──
$s = 3.2; $ox = 92.0; $oy = 150.0

$arcPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 59, 130, 246), [single](2.2 * $s))
$arcPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$arcPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddBezier(
  [single]($ox + 12 * $s),    [single]($oy + 38 * $s),
  [single]($ox + 21.33 * $s), [single]($oy + 24.67 * $s),
  [single]($ox + 30.67 * $s), [single]($oy + 20.22 * $s),
  [single]($ox + 40 * $s),    [single]($oy + 23 * $s))
$path.AddBezier(
  [single]($ox + 40 * $s),    [single]($oy + 23 * $s),
  [single]($ox + 49.33 * $s), [single]($oy + 20.22 * $s),
  [single]($ox + 58.67 * $s), [single]($oy + 24.67 * $s),
  [single]($ox + 68 * $s),    [single]($oy + 38 * $s))
$g.DrawPath($arcPen, $path)

$dotGlow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(46, 59, 130, 246))
$g.FillEllipse($dotGlow, [single]($ox + 31 * $s), [single]($oy + 11 * $s), [single](18 * $s), [single](18 * $s))
$dotB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 59, 130, 246))
$g.FillEllipse($dotB, [single]($ox + 34.5 * $s), [single]($oy + 14.5 * $s), [single](11 * $s), [single](11 * $s))

$p1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 200, 216, 248))
$p2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 147, 197, 253))
$p3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 191, 219, 254))
$g.FillRectangle($p1, [single]($ox + 10 * $s),   [single]($oy + 38 * $s), [single](7.5 * $s), [single](46 * $s))
$g.FillRectangle($p2, [single]($ox + 36.5 * $s), [single]($oy + 29 * $s), [single](7.5 * $s), [single](55 * $s))
$g.FillRectangle($p1, [single]($ox + 62.5 * $s), [single]($oy + 38 * $s), [single](7.5 * $s), [single](46 * $s))
$g.FillRectangle($p3, [single]($ox + 6 * $s),    [single]($oy + 84 * $s), [single](68 * $s),  [single](4 * $s))

# ── Text ──
$cream = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 216, 224, 245))
$blue  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 96, 165, 250))
$dim   = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 138, 151, 176))

$fSerif  = New-Object System.Drawing.Font("Georgia", 58, [System.Drawing.FontStyle]::Regular)
$fSerifI = New-Object System.Drawing.Font("Georgia", 58, [System.Drawing.FontStyle]::Italic)
$fMono   = New-Object System.Drawing.Font("Consolas", 16, [System.Drawing.FontStyle]::Regular)
$fSans   = New-Object System.Drawing.Font("Segoe UI", 19, [System.Drawing.FontStyle]::Regular)

$tx = 425.0
$g.DrawString("A R K A N   A I   S O L U T I O N S", $fMono, $blue, $tx, 132)
$g.DrawString("AI systems your", $fSerif, $cream, ($tx - 8), 172)
$g.DrawString("business can stand on.", $fSerifI, $blue, ($tx - 8), 262)
$g.DrawString("Arabic-first AI agents - Automation - Integration", $fSans, $cream, $tx, 392)
$g.DrawString("EGYPT . SAUDI ARABIA . UAE", $fMono, $dim, $tx, 444)

$rulePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 37, 99, 235), 2)
$g.DrawLine($rulePen, [single]$tx, 506, 1108, 506)
$g.DrawString("arkan.ai", $fMono, $dim, $tx, 524)

$out = Join-Path (Split-Path $PSScriptRoot -Parent) "public\og-image.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "saved: $out"
