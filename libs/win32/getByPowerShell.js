/**
 * getByPowerShell
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec

const parse = (str) => {
  let fonts = []
  str.split('\n').map(ln => fonts.push(ln.trim()))
  return fonts
}

/*
@see https://superuser.com/questions/760627/how-to-list-installed-font-families

  [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")
  (New-Object System.Drawing.Text.InstalledFontCollection).Families
*/
module.exports = () => new Promise((resolve, reject) => {
  let cmd = `powershell -command "Add-Type -AssemblyName PresentationCore;$families=[Windows.Media.Fonts]::SystemFontFamilies;foreach($family in $families){$name='';if(!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'),[ref]$name)){$name=$family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]}echo $name}"`

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    if (err) {
      reject(err)
      return
    }

    resolve(parse(stdout))
  })
})
