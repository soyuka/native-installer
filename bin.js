#!/bin/env node
// not cross-platform -_-
try {
  var regedit = require('regedit')
} catch (e) {}
const mkdirp = require('mkdirp')
const fs = require('fs')
const minimist = require('minimist')
const path = require('path')
const setup = require('./')
const args = minimist(process.argv.slice(2), {boolean: ['global', 'rm', 'h', 'help']})

if (args.h || args.help) {
  console.log(`
Usage:

  native-installer manifest.json

--browser ${setup.BROWSERS.join(', ')} - default to all
--global - install globally (might require privilege), default to local user
--rm - removes the file/registry
`)
  return
}

const local = args.global === true ? false : true
let browsers = setup.BROWSERS

if (args.browser) {
  if (!Array.isArray(args.browser)) { args.browser = [args.browser] }
  browsers = browsers.filter((e) => ~args.browser.indexOf(e))
}

if (!args._[0]) {
  throw new Error('Missing app.json argument.')
}

const results = setup(require(path.resolve(process.cwd(), args._[0])), {local, browsers})

results.forEach((e) => {
  if (process.platform === 'win32') {
    if (args.rm === true) {
      regedit.deleteKey(e.path, function (err) {
        if (err) throw err

        console.log('Registry key removed: %s', e.path)
      })
      return
    }

    const manifestPath = path.resolve(process.cwd(), 'manifest-' + Date.now() + '.json')
    fs.writeFileSync(manifestPath, e.JSONmanifest)
    regedit.createKey(e.path, (err) => {
      if (err) throw err

      regedit.putValue({
        [e.path]: {
          [e.manifest.name]: {
            value: manifestPath,
            type: 'REG_DEFAULT'
          }
        }
      }, function (err) {
        if (err) throw err
        console.log('Registry key created: %s', e.path)
      })
    })
    return
  }

  mkdirp.sync(path.dirname(e.path))

  if (args.rm === true) {
    fs.unlinkSync(e.path)
    console.log('File removed: %s', e.path)
    return
  }

  fs.writeFileSync(e.path, e.JSONmanifest)
  console.log('File written: %s', e.path)
})


