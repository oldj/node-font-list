/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const path = require('path')
const execFile = require('child_process').execFile
const exec = require('child_process').exec
const util = require('util')

const pexec = util.promisify(exec)

const bin = path.join(__dirname, 'fontlist')
const font_exceptions = ['iconfont']

async function getBySystemProfiler () {
  const cmd = `system_profiler SPFontsDataType | grep "Family:" | awk -F: '{print $2}' | sort | uniq`
  const {stdout} = await pexec(cmd, {maxBuffer: 1024 * 1024 * 10})
  return stdout.split('\n').map(f => f.trim()).filter(f => !!f)
}

async function getByExecFile () {
  return new Promise(async (resolve, reject) => {
    execFile(bin, {maxBuffer: 1024 * 1024 * 10}, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }

      let fonts = []
      if (stdout) {
        //fonts = fonts.concat(tryToGetFonts(stdout))
        fonts = fonts.concat(stdout.split('\n'))
      }
      if (stderr) {
        //fonts = fonts.concat(tryToGetFonts(stderr))
        console.error(stderr)
      }

      fonts = Array.from(new Set(fonts))
        .filter(i => i && !font_exceptions.includes(i))

      resolve(fonts)
    })
  })
}

module.exports = async () => {
  let fonts = []
  try {
    fonts = await getByExecFile()
  } catch (e) {
    console.error(e)
  }

  if (fonts.length === 0) {
    try {
      fonts = await getBySystemProfiler()
    } catch (e) {
      console.error(e)
    }
  }

  return fonts
}
