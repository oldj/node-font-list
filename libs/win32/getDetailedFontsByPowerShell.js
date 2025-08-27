/**
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require("child_process").exec;

const parse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to parse font data:", e);
    return [];
  }
};

/*
PowerShell script to get detailed font information including PostScript names and additional properties:

chcp 65001 | Out-Null
Add-Type -AssemblyName PresentationCore
$families = [Windows.Media.Fonts]::SystemFontFamilies
$fontList = @()
foreach ($family in $families) {
  $familyName = ''
  if (!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'), [ref]$familyName)) {
    $familyName = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]
  }
  
  # Try to get detailed font properties
  $postScriptName = $familyName
  $weight = 'regular'
  $style = 'normal'
  $width = 'normal'
  $monospace = $false
  
  try {
    $typeface = $family.GetTypefaces() | Select-Object -First 1
    if ($typeface) {
      $postScriptName = $typeface.FontFamily.Source
      
      # Get font weight
      $fontWeight = $typeface.Weight.ToOpenTypeWeight()
      if ($fontWeight -le 200) { $weight = 'ultralight' }
      elseif ($fontWeight -le 300) { $weight = 'light' }
      elseif ($fontWeight -le 400) { $weight = 'regular' }
      elseif ($fontWeight -le 500) { $weight = 'medium' }
      elseif ($fontWeight -le 600) { $weight = 'semibold' }
      elseif ($fontWeight -le 700) { $weight = 'bold' }
      elseif ($fontWeight -le 800) { $weight = 'heavy' }
      else { $weight = 'black' }
      
      # Get font style
      if ($typeface.Style -eq [Windows.Media.FontStyles]::Italic) {
        $style = 'italic'
      } elseif ($typeface.Style -eq [Windows.Media.FontStyles]::Oblique) {
        $style = 'oblique'
      }
      
      # Get font stretch (width)
      $stretch = $typeface.Stretch.ToOpenTypeStretch()
      if ($stretch -le 3) { $width = 'condensed' }
      elseif ($stretch -ge 7) { $width = 'expanded' }
      else { $width = 'normal' }
      
      # Check if monospace by examining character widths
      try {
        Add-Type -AssemblyName PresentationFramework
        $font = New-Object Windows.Media.GlyphTypeface
        $uri = New-Object System.Uri($typeface.FontFamily.BaseUri, $typeface.FontFamily.Source)
        if ($font.TryInitialize($uri)) {
          # Simple heuristic: check if 'i' and 'w' have similar widths
          $iWidth = 0
          $wWidth = 0
          if ($font.CharacterToGlyphMap.ContainsKey([int][char]'i')) {
            $iGlyph = $font.CharacterToGlyphMap[[int][char]'i']
            $iWidth = $font.AdvanceWidths[$iGlyph]
          }
          if ($font.CharacterToGlyphMap.ContainsKey([int][char]'w')) {
            $wGlyph = $font.CharacterToGlyphMap[[int][char]'w']
            $wWidth = $font.AdvanceWidths[$wGlyph]
          }
          if ($iWidth -gt 0 -and $wWidth -gt 0 -and [Math]::Abs($iWidth - $wWidth) -lt 0.1) {
            $monospace = $true
          }
        }
      } catch {
        # Fallback: check family name for common monospace indicators
        $monoKeywords = @('mono', 'courier', 'console', 'terminal', 'fixed', 'typewriter')
        foreach ($keyword in $monoKeywords) {
          if ($familyName -match $keyword) {
            $monospace = $true
            break
          }
        }
      }
    }
  } catch {
    # If failed, use defaults
  }
  
  $fontInfo = @{
    familyName = $familyName
    postScriptName = $postScriptName
    weight = $weight
    style = $style
    width = $width
    monospace = $monospace
  }
  $fontList += $fontInfo
}
$fontList | ConvertTo-Json -Compress
*/

module.exports = () =>
  new Promise((resolve, reject) => {
    let cmd = `chcp 65001|powershell -command "chcp 65001|Out-Null;Add-Type -AssemblyName PresentationCore;$families=[Windows.Media.Fonts]::SystemFontFamilies;$fontList=@();foreach($family in $families){$familyName='';if(!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'),[ref]$familyName)){$familyName=$family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]}$postScriptName=$familyName;$weight='regular';$style='normal';$width='normal';$monospace=$false;try{$typeface=$family.GetTypefaces()|Select-Object -First 1;if($typeface){$postScriptName=$typeface.FontFamily.Source;$fontWeight=$typeface.Weight.ToOpenTypeWeight();if($fontWeight -le 200){$weight='ultralight'}elseif($fontWeight -le 300){$weight='light'}elseif($fontWeight -le 400){$weight='regular'}elseif($fontWeight -le 500){$weight='medium'}elseif($fontWeight -le 600){$weight='semibold'}elseif($fontWeight -le 700){$weight='bold'}elseif($fontWeight -le 800){$weight='heavy'}else{$weight='black'};if($typeface.Style -eq [Windows.Media.FontStyles]::Italic){$style='italic'}elseif($typeface.Style -eq [Windows.Media.FontStyles]::Oblique){$style='oblique'};$stretch=$typeface.Stretch.ToOpenTypeStretch();if($stretch -le 3){$width='condensed'}elseif($stretch -ge 7){$width='expanded'}else{$width='normal'};$monoKeywords=@('mono','courier','console','terminal','fixed','typewriter');foreach($keyword in $monoKeywords){if($familyName -match $keyword){$monospace=$true;break}}}}catch{}$fontInfo=@{familyName=$familyName;postScriptName=$postScriptName;weight=$weight;style=$style;width=$width;monospace=$monospace};$fontList+=$fontInfo}$fontList|ConvertTo-Json -Compress"`;

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(parse(stdout));
    });
  });
