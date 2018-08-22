const passport = require('koa-passport');
module.exports =  (router) => {
  // Load the 'index' controller
  const index = require('../controllers/index.server.controller')
  
  // Mount the 'index' controller's 'render' method
  router.get('/', index.render)

  router.post('/signin',
    passport.authenticate('local', {
      successRedirect: '/success',
      failureRedirect: '/fail'
    })
  )


  const users = require('../controllers/users.server.controller')
   // Set up the 'signin' routes
   router.get('/signin',users.renderSignin)
  // Set up the 'signout' route
  router.get('/signout', users.signout)

  // router.post('/signin', passport.authenticate('local', {
  //   session: false,
  //   successRedirect: '/success',
  //   failureRedirect: '/fail'
  // }))

  router.get('/success', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title success'
    };
    await ctx.render('success', {title: ctx.state});
  })

  router.get('/fail', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title fail'
    };
    await ctx.render('fail', {title: ctx.state});
  })

  return router
}
