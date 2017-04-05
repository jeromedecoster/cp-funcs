# cp-funcs

> A very limited subset of cp functions I use every day

## Install

```bash
npm i cp-funcs
```

Package [on npm](https://www.npmjs.com/package/cp-funcs)

## API

* [exec-file](#exec-filefile-args-options)
* [exec](#execcommand-options)

---

### exec-file(file, [args], [options])

Execute the `file`

| Argument | Action |
| :------ | :------- |
| **file** | the executed `file` |
| **args** | the list of string arguments |
| **options** | optional `options`, default to `{ maxBuffer: 20971520 }` |

`args` can be an `Array` or a `String`

The default `maxBuffer` is 20 Mo instead of 200 ko

`result` is an object with two properties `{ stdout, stderr }`

The EOF chars `\n` or `\r\n` are removed from the returned strings `stdout` and `stderr`

```js
const execfile = require('cp-funcs/exec-file')

execfile('echo', ['one', 'two']).then(result => {
  // one two
  console.log(result.stdout)
})

execfile('echo', 'abc def').then(result => {
  // abc def
  console.log(result.stdout)
})
```

---

### exec(command, [options])

Execute the `command`

| Argument | Action |
| :------ | :------- |
| **command** | the executed `command` |
| **options** | optional `options`, default to `{ maxBuffer: 20971520 }` |

The default `maxBuffer` is 20 Mo instead of 200 ko

`result` is an object with two properties `{ stdout, stderr }`

The EOF chars `\n` or `\r\n` are removed from the returned strings `stdout` and `stderr`

```js
const exec = require('cp-funcs/exec')

exec('echo one two').then(result => {
  // one two
  console.log(result.stdout)
})
```

## License

MIT
