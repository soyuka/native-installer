const os = require('os')
const path = require('path')
const paths = require('./paths.json')
const platform = os.platform()
const home = os.homedir()

const BROWSERS = ['firefox', 'chrome', 'chromium'];

function setup (app, opts = {}) {
  const local = opts.local
  const browsers = opts.browsers || BROWSERS
  const results = []

  browsers.forEach(b => {
    const realpath = paths[b][platform][local ? 'user' : 'global']
      .replace('%home%', home).replace('%name%', app.name)

    app.path = path.resolve(process.cwd(), app.path)

    results.push({
      path: realpath,
      JSONmanifest: JSON.stringify(app, true, 2),
      manifest: app
    })
  })

  return results
}

module.exports = setup
module.exports.BROWSERS = BROWSERS
