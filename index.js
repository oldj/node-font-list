/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const platform = process.platform
const for_darwin = require('./libs/darwin')
const for_win32 = require('./libs/win32')

exports.getFonts = () => Promise.resolve().then(() => {
  if (platform === 'darwin') {
    return for_darwin()

  } else if (platform === 'win32') {
    return for_win32()

  } else {
    return Promise.reject(`Error: font-list not support on ${platform}.`)
  }
})
