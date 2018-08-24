
// Load the module dependencies
const users = require('../controllers/users.server.controller')
const passport = require('koa-passport')

// Define the routes module's method
module.exports =  (router) => {
  // Set up the 'signup' routes
  router.get('/signup', users.renderSignup)
  router.post('/signup', users.signup)

  // Set up the 'signin' routes
  router.get('/signin',users.renderSignin)
  // 测试普通登录
  router.post('/signin', passport.authenticate('local', {
          successRedirect: '/',
          failureRedirect: '/signin'
        }))
  router.post('/microSign', users.microsignin)
  // Set up the 'signout' route
  router.get('/signout', users.signout)

  // Test passport with jwt
  router.post('/tokenLogin', (ctx, next) => {
    console.log('/tokenLogin')
    return passport.authenticate('local', (err, user, info) => {
      console.log(`err:${err},user:${user},info:${info}`)
      if (user === false) {
        ctx.status = 401
        ctx.body = info.message
      } else {
        // generate token

        try {
          ctx.body = {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken'
          }
        } catch (e) {
          ctx.throw(500, e)
        }
      }
    })
  })
  router.post('/needToken', ctx => {
    ctx.body = ctx.state.user
  })
  return router
}
