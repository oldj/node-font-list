/**
 * getByPowerShell
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec
const iconv = require('iconv-lite')

const parse = (str) => {
  let fonts = []
  str.split('\n').map(ln => {
    ln = ln.trim()
    if (!ln || !ln.includes(':')) return

    ln = ln.split(':')
    if (ln.length !== 2 || ln[0].trim() !== 'Name') return

    let font_name = ln[1].trim()
    if (font_name) {
      fonts.push(font_name)
    }
  })

  return fonts
}

/*
@see https://superuser.com/questions/760627/how-to-list-installed-font-families

  [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing")
  (New-Object System.Drawing.Text.InstalledFontCollection).Families
*/
module.exports = (options) => new Promise((resolve, reject) => {
  let cmd = `powershell -command "chcp 65001;[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing');(New-Object System.Drawing.Text.InstalledFontCollection).Families"`

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    if (err) {
      reject(err)
      return
    }

    let t = iconv.decode(Buffer.from(stdout, 'binary'), 'utf8')
    if (t.includes('\uFFFD')) {
      t = iconv.decode(Buffer.from(stdout, 'binary'), options.fallbackEncoding || 'cp936')
    }

    resolve(parse(t))
  })
})
