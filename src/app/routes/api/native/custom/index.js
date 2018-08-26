const Router = require('koa-router')
const CustomController = require('../../../../controllers/custom.server.controller')

const router = new Router()

router.post('/map', CustomController.map)

module.exports = router