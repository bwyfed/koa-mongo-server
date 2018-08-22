
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
  // router.post('/signin', async (ctx) => {
  //   return passport.authenticate('local', (err, user, info, status) => {
  //     console.log(`err:${err}, user:${user}, info:${info}, status:${status}`)
  //   })(ctx)
  // }
  // )
  // 测试登录
  router.post('/signin', passport.authenticate('local', {
          session: false,
          successRedirect: '/success',
          failureRedirect: '/fail'
        }))
  // Set up the 'signout' route
  router.get('/signout', users.signout)

  return router
}
