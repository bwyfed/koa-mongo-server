const Router = require('koa-router')
const UserController = require('../../../../controllers/user.server.controller')

const router = new Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)

module.exports = router