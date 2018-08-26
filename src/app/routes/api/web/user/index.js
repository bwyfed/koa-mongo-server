const Router = require('koa-router')

const router = new Router()

router.post('/login', (ctx) => {
  ctx.body = {
    route: '/web-api/user/login'
  }
})

router.post('/register',  ctx => {
  ctx.body = {
    route: '/web-api/user/register'
  }
})

module.exports = router