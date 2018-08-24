// Load the module dependencies
const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
// 认证鉴权相关
const session = require('koa-session')
const passport = require('koa-passport')
const jwt = require('koa-jwt')
// 基础配置
const config = require('./index')
const ErrorRoutesCatch = require('../app/middleware/ErrorRoutesCatch')

// Define the Koa configuration method
module.exports = function() {
  // Create a new Koa application instance
  const app = new Koa()
  // Create a new Router instance
  const router = new Router()

  // 401 handler
  // app.use(ErrorRoutesCatch())
  // error handler
  onerror(app)
  // middlewares setup
  // Development style logger
  app.use(logger())
  // sessions
  app.keys = [config.sessionSecret]
  app.use(session({
    key: 'npo:sess',
    maxAge: 1*60*1000 // 1 mininute
  }, app))
  // body parser
  app.use(bodyParser()) 
  // JSON pretty-printed response
  app.use(json())
  // Configure static file serving
  app.use(require('koa-static')(path.join(__dirname, '../public')))
  // Set the application view engine and 'views' folder
  app.use(views(path.join(__dirname, '../app/views'), {
    options: {settings: {views: path.join(__dirname, '../app/views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))
  // Configure the Passport middleware
  app.use(passport.initialize()) // authentication init
  // app.use(passport.session())
  // Cofigure the jwt middleware
  app.use(
    jwt({ secret: 'shared-secret', debug: true })
    .unless({path: [/^\/sign/, /^\/tokenLogin/,/^\/favicon.ico/]})
  )
  // Configure router middleware
  app.use(router.routes())
  app.use(router.allowedMethods())

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
  // Error handling
  app.on('error', (err, ctx) => {
    console.log(err)
    console.error('server error', err, ctx)
  })

  // Return the Koa application instance
  return app
}
