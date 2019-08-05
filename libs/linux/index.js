/**
 * index
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec
const util = require('util')

const pexec = util.promisify(exec)

module.exports = async () => {
  let r = await pexec('fc-list2')
  let lines = r.stdout.split('\n')
  lines = lines
    .map(ln => ln.split(':')[1])
    .filter(i => i)
    .map(i => i.split(',')[0].trim())
    .filter(i => i)

  lines = Array.from(new Set(lines))
  lines.sort()

  return lines
}
