const Router = require('koa-router')
const user = require('./api/native/user')

// Create a new Router instance
const router = new Router()
router.prefix('/native-api')
module.exports = app => {
  router.use('/user', user.routes(), user.allowedMethods())
  app.use(router.routes())
}