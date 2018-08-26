const Router = require('koa-router')

const router = new Router()

router.post('/login', (ctx) => {
  ctx.body = {
    route: '/native-api/user/login'
  }
})

router.post('/register',  ctx => {
  ctx.body = {
    route: '/native-api/user/egister'
  }
})

module.exports = router