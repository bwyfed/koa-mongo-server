
module.exports =  (router) => {
  // Load the 'index' controller
  const index = require('../controllers/index.server.controller')
  
  // Mount the 'index' controller's 'render' method
  router.get('/', index.render)

  router.get('/welcome', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };
    await ctx.render('welcome', {title: ctx.state});
  })

  return router
}
