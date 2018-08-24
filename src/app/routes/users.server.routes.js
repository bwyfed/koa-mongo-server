
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

  return router
}
