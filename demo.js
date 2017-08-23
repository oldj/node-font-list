/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

require('./index').getFonts((err, fonts) => {
  if (err) {
    console.log(err)
  } else {
    console.log(fonts)
  }
})
