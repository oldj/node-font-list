/**
 * test.js
 * @author: oldj
 * @homepage: https://oldj.net
 */

const {getFonts} = require('./index')

getFonts()
  .then(r => console.log(r))
  .catch(e => console.log(e))
