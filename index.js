/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const standardize = require('./libs/standardize')
const platform = process.platform

let getFontsFunc
switch (platform) {
  case 'darwin':
    getFontsFunc = require('./libs/darwin')
    break
  case 'win32':
    getFontsFunc = require('./libs/win32')
    break
  case 'linux':
    getFontsFunc = require('./libs/linux')
    break
  default:
    throw new Error(`Error: font-list can not run on ${platform}.`)
}

const defaultOptions = {
  disableQuoting: false
}

exports.getFonts = async (options) => {
  options = Object.assign({}, defaultOptions, options)

  let fonts = await getFontsFunc()
  fonts = standardize(fonts, options)

  fonts.sort((a, b) => {
    return a.replace(/^['"]+/, '').toLocaleLowerCase() < b.replace(/^['"]+/, '').toLocaleLowerCase() ? -1 : 1
  })

  return fonts
}
