/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

module.exports = function (fonts, options) {
  fonts = fonts.map(i => {
    // parse unicode names, eg: '"\\U559c\\U9e4a\\U805a\\U73cd\\U4f53"' -> '"喜鹊聚珍体"'
    try {
      i = i.replace(/\\u([\da-f]{4})/ig, (m, s) => String.fromCharCode(parseInt(s, 16)))
    } catch (e) {
      console.log(e)
    }

    if (options && options.disableQuoting) {
      if (i.startsWith('"') && i.endsWith('"')) {
        i = `${i.substr(1, i.length - 2)}`
      }
    } else if (i.match(/[\s()+]/) && !i.startsWith('"')) {
      i = `"${i}"`
    }

    return i
  })

  return fonts
}
