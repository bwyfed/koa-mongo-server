// Load the module dependencies
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
// 认证鉴权相关
const session = require('koa-session')
const passport = require('koa-passport')

const path = require('path')

const config = require('./index')

// Define the Koa configuration method
module.exports = function() {
  // Create a new Koa application instance
  const app = new Koa()
  // Create a new Router instance
  const router = new Router()
  // error handler
  onerror(app)

  // sessions
  app.keys = [config.sessionSecret]
  // middlewares
  app.use(bodyParser()) // body parser
  .use(json())
  .use(logger())
  .use(require('koa-static')(path.join(__dirname, '../public')))
  .use(views(path.join(__dirname, '../app/views'), {
    options: {settings: {views: path.join(__dirname, '../app/views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))
  .use(session({
    saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
  }, app)) // sessions
  .use(passport.initialize()) // authentication init
  .use(passport.session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  })) // authentication session
  .use(router.routes())
  .use(router.allowedMethods())

  // logger
  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
  })
  // Load the routing files
  require('../app/routes/index.server.routes')(router)
  require('../app/routes/users.server.routes')(router)

  app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
  })

  // Return the Koa application instance
  return app
}
