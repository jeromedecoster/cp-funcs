const fn = require('../exec')
const path = require('path')


const prog = path.resolve(__dirname, '../fixtures/prog.sh')


test('the command is not a string', async () => {
  try {
    await fn()
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"command" argument must be a string')
  }

  try {
    await fn(12)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message).toBe('"command" argument must be a string')
  }
})

test('the command does not exists', async () => {
  try {
    await fn('123')
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.toLowerCase().includes('command failed')).toBe(true)
  }
})

test('the file target a directory', async () => {
  try {
    await fn(__dirname)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.toLowerCase().includes('command failed')).toBe(true)
  }
})

test('the file target a file', async () => {
  try {
    await fn(__filename)
    expect('this must').toBe('be ignored')
  } catch(err) {
    expect(err.message.toLowerCase().includes('command failed')).toBe(true)
  }
})

test('the prog is run with bad argument', async () => {
  fn(prog, 12)
  .then(result => {
    expect(typeof result.stdout).toBe('string')
    expect(result.stdout.includes('cwd:')).toBe(true)
    var last = result.stdout.charCodeAt(result.stdout.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog is run with no argument', async () => {
  fn(prog)
  .then(result => {
    expect(typeof result.stdout).toBe('string')
    expect(result.stdout.includes('cwd:')).toBe(true)
    var last = result.stdout.charCodeAt(result.stdout.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)

    expect(typeof result.stderr).toBe('string')
    expect(result.stderr.includes('usage:')).toBe(true)
    var last = result.stderr.charCodeAt(result.stderr.length - 1)
    expect(last !== 10 && last !== 13).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog is run with args', async () => {
  fn(`${prog} abc def`)
  .then(result => {
    expect(result.stdout).toBe('abc\ndef')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  fn(`${prog}  abc     def  `)
  .then(result => {
    expect(result.stdout).toBe('abc\ndef')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns stdin', async () => {
  fn(`echo 123 | ${prog} --stdin abc`)
  .then(result => {
    expect(result.stdout).toBe('123\nabc')
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns stderr without crash', async () => {
  fn(`${prog} --stderr abc`)
  .then(result => {
    expect(result.stdout).toBe('abc')
    expect(result.stderr.includes('stderr message:')).toBe(true)
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns exit with code 128', async () => {
  fn(`${prog} abc --exit def`)
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('exit is coming')).toBe(true)
    expect(err.code).toBe(128)
  })
})

test('the prog returns the correct cwd', async () => {
  fn(`${prog} --cwd`)
  .then(result => {
    expect(result.stdout).toBe(process.cwd())
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  var parent = path.dirname(process.cwd())
  fn(`${prog} --cwd`, {cwd:parent})
  .then(result => {
    expect(result.stdout).toBe(parent)
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog returns the correct lines', async () => {
  fn(`${prog} --rand`)
  .then(result => {
    expect(result.stdout.split('\n').every(e => e.startsWith('loop'))).toBe(true)
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })
})

test('the prog must not thow a stdout maxBuffer exceeded error', async () => {
  fn(`${prog} --lot`)
  .then(result => {
    expect(result.stdout.split('\n').every(e => e.startsWith('loop'))).toBe(true)
    expect(result.stdout.startsWith('loop 1 / 100000')).toBe(true)
    expect(result.stderr).toBe('')
  })
  .catch(err => {
    expect('this must').toBe('be ignored')
  })

  // with the default maxBuffer it must throw an error
  fn(`${prog} --lot`, { maxBuffer: 200 * 1024 })
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('stdout maxBuffer exceeded')).toBe(true)
    expect(err.stdout.startsWith('loop 1 / 100000')).toBe(true)
    expect(err.stderr).toBe('')
  })
})

test('the prog must thow a stdout maxBuffer exceeded error', async () => {
  fn(`${prog} --toomuch`)
  .then(result => {
    expect('this must').toBe('be ignored')
  })
  .catch(err => {
    expect(err.message.includes('stdout maxBuffer exceeded')).toBe(true)
    expect(err.stdout.startsWith('loop 1 / 2000000')).toBe(true)
    expect(err.stderr).toBe('')
  })
})
