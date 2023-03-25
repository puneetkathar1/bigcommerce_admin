const { join } = require('path')
const { https } = require('firebase-functions')
const { default: next } = require('next')

const nextjsDistDir = join('src', require('./src/next.config.js').distDir)

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
})
const nextjsHandle = nextjsServer.getRequestHandler()

exports.nextjsFunc = https.onRequest((req, res) => {
  req.setTimeout(540000) // 9 minutes * 60 seconds per minute * 1000 milliseconds per second
  res.setTimeout(540000)
  return nextjsServer.prepare().then(() => nextjsHandle(req, res))
})
