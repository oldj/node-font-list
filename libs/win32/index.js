/**
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const os = require('os')
const getByPowerShell = require('./getByPowerShell')
const getByVBS = require('./getByVBS')
const getDetailedFontsByPowerShell = require('./getDetailedFontsByPowerShell')

const methods_new = [getByPowerShell, getByVBS]
const methods_old = [getByVBS, getByPowerShell]

module.exports.getFonts = async () => {
  let fonts = []

  // @see {@link https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js}
  let os_v = parseInt(os.release())
  let methods = os_v >= 10 ? methods_new : methods_old

  for (let method of methods) {
    try {
      fonts = await method()
      if (fonts.length > 0) break
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}

module.exports.getDetailedFonts = async () => {
  let fonts = []

  // 首先尝试获取详细字体信息
  try {
    fonts = await getDetailedFontsByPowerShell()
    if (fonts.length > 0) {
      return fonts
    }
  } catch (e) {
    console.error('Failed to get detailed fonts:', e)
  }

  // 如果详细获取失败，回退到基本方法并构造对象
  let os_v = parseInt(os.release())
  let methods = os_v >= 10 ? methods_new : methods_old

  for (let method of methods) {
    try {
      const basicFonts = await method()
      if (basicFonts.length > 0) {
        fonts = basicFonts.map(familyName => ({
          familyName,
          postScriptName: familyName
        }))
        break
      }
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}
