/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const platform = process.platform
const for_darwin = require('./libs/darwin')
const for_win32 = require('./libs/win32')
const for_linux = require('./libs/linux')

exports.getFonts = async () => {
  let fonts

  if (platform === 'darwin') {
    fonts = await for_darwin()

  } else if (platform === 'win32') {
    fonts = await for_win32()

  } else if (platform === 'linux') {
    fonts = await for_linux()

  } else {
    throw new Error(`Error: font-list can not run on ${platform}.`)
  }

  fonts = fonts.map(i => {
    if (i.includes(' ') && !i.startsWith('"')) {
      i = `"${i}"`
    }
    return i
  })
  fonts.sort()

  return fonts
}
