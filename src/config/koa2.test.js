// Load the module dependencies
const path = require('path')
const Koa = require('koa');
const Router = require('koa-router')
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const logger = require('koa-logger')
const views = require('koa-views')

module.exports = () => {
  // Create a new Koa application instance
  const app = new Koa()
  // Create a new Router instance
  const router = new Router()
  // sessions
  app.keys = ['super-secret-key'];
  app.use(session(app));

  // body parser
  app.use(bodyParser());
  // logger
  app.use(logger())
  // static assets
  app.use(require('koa-static')(path.join(__dirname, '../public')))
  // view template
  app.use(views(path.join(__dirname, '../app/views'), {
    options: {settings: {views: path.join(__dirname, '../app/views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))

  // authentication
  // require('./auth');
  // app.use(passport.initialize());
  // app.use(passport.session());
  const Passport = require('./passport.test')
  // Create the Passport middleware
  const passport = Passport(app)

  // Load the routing files
  // app.use(require('../app/routes/routes.test')(router).routes())
  app.use(require('../app/routes/index.server.routes')(router).routes())
  // app.use(require('../app/routes/users.server.routes')(router).routes())
  // Return the Koa application instance
  return app
}