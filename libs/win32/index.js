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
      break
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}
