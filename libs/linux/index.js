/**
 * index
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec
const util = require('util')

const pexec = util.promisify(exec)

async function binaryExists(binary) {
  const { stdout } = await pexec(`whereis ${binary}`);
  return stdout.length > (binary.length + 2);
}

module.exports = async () => {
  const fcListBinary = await binaryExists('fc-list')
    ? 'fc-list'
    : 'fc-list2';

  let r = await pexec(fcListBinary)
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
