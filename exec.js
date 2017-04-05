const cp = require('child_process')

// http://www.convertworld.com/fr/mesures-informatiques/megaoctet-megabyte.html
// default maxBuffer = 200 * 1024 bytes = 200 ko
// new default = 20971520 bytes = 20 Mo
const MAX = 20971520

function exec(command, options) {
  // prepare default arguments
  if (arguments.length < 2) {
    options = { maxBuffer: MAX }
  }
  if (isobj(options) === false) {
    options = { maxBuffer: MAX }
  }
  if (ispositive(options.maxBuffer) === false) {
    options.maxBuffer = MAX
  }

  return new Promise((resolve, reject) => {
    if (typeof command !== 'string') {
      return reject(new TypeError('"command" argument must be a string'))
    }

    cp.exec(command, options, (err, stdout, stderr) => {
      stdout = stripeof(stdout)
      stderr = stripeof(stderr)
      if (err) {
        err.stdout = stdout
        err.stderr = stderr
        return reject(err)
      }
      resolve({
        stdout: stdout,
        stderr: stderr
      })
    })
  })
}

// `data` is plain object quick test
function isobj(data) {
  if (data == null) return false
  if (data.constructor && data.constructor.name != 'Object') return false
  return true
}

// `data` is > 0 test
function ispositive(data) {
  return typeof data === 'number'
    && data === data
    && data > 0
}

// https://github.com/sindresorhus/strip-eof
function stripeof(data) {
  if (typeof data !== 'string') return ''
  // remove last char if it is '\n'
  if (data.charCodeAt(data.length - 1) === 10) data = data.slice(0, data.length - 1)
  // remove last char if it is '\r'
  if (data.charCodeAt(data.length - 1) === 13) data = data.slice(0, data.length - 1)
  return data
}

module.exports = exec
