/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const platform = process.platform

exports.getFonts = (callback) => Promise.resolve().then(() => {
  if (platform === 'darwin') {
    return require('./libs/darwin')()
  } else {
    setTimeout(() => {
      callback(`Error: font-list not support on ${platform}.`)
    }, 0)
  }
})
