/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const methods = [
  require('./getByPowerShell'),
  require('./getByVBS')
]

module.exports = async () => {
  let fonts = []

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
