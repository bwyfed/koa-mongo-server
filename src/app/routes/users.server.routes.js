
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
  router.post('/micro', async (ctx) => {
    console.log('/mirco, start passport.authenticate')
    return passport.authenticate('local', (err, user, info, status) => {
      console.log(`passport.authenticate callback. err:${err}, user:${user}, info:${info}, status:${status}`)
      if (user === false) {
        ctx.body = { success: false }
        ctx.throw(401) //401 "unauthorized"
      } else {
        ctx.body = { success: true }
        return ctx.login()
      }
    })(ctx)
  })
  // Set up the 'signout' route
  router.get('/signout', users.signout)

  return router
}
