const Router = require('koa-router')
const user = require('./api/native/user')
const custom = require('./api/native/custom')

// Create a new Router instance
const router = new Router()
router.prefix('/native-api')
module.exports = app => {
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/custom', custom.routes(), custom.allowedMethods())
  app.use(router.routes())
}