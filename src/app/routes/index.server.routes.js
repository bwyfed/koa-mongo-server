const passport = require('koa-passport');
module.exports =  (router) => {
  // Load the 'index' controller
  const index = require('../controllers/index.server.controller')
  
  // Mount the 'index' controller's 'render' method
  router.get('/', index.render)
  return router
}
