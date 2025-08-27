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
PowerShell script to get detailed font information including PostScript names:

chcp 65001 | Out-Null
Add-Type -AssemblyName PresentationCore
$families = [Windows.Media.Fonts]::SystemFontFamilies
$fontList = @()
foreach ($family in $families) {
  $familyName = ''
  if (!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'), [ref]$familyName)) {
    $familyName = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]
  }
  
  # Try to get PostScript name by creating a font
  $postScriptName = $familyName
  try {
    $typeface = $family.GetTypefaces() | Select-Object -First 1
    if ($typeface) {
      $postScriptName = $typeface.FontFamily.Source
    }
  } catch {
    # If failed, use family name as PostScript name
  }
  
  $fontInfo = @{
    familyName = $familyName
    postScriptName = $postScriptName
  }
  $fontList += $fontInfo
}
$fontList | ConvertTo-Json -Compress
*/

module.exports = () =>
  new Promise((resolve, reject) => {
    let cmd = `chcp 65001|powershell -command "chcp 65001|Out-Null;Add-Type -AssemblyName PresentationCore;$families=[Windows.Media.Fonts]::SystemFontFamilies;$fontList=@();foreach($family in $families){$familyName='';if(!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'),[ref]$familyName)){$familyName=$family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]}$postScriptName=$familyName;try{$typeface=$family.GetTypefaces()|Select-Object -First 1;if($typeface){$postScriptName=$typeface.FontFamily.Source}}catch{}$fontInfo=@{familyName=$familyName;postScriptName=$postScriptName};$fontList+=$fontInfo}$fontList|ConvertTo-Json -Compress"`;

    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(parse(stdout));
    });
  });
