const path = require('path')
module.exports =  (router) => {
  router.get('/', async (ctx, next) => {
    // ctx.body = 'Hello World'
    ctx.state = {
      title: 'Koa2'
    }
    console.log(path.resolve(__dirname, '../views/index.pug'))
    await ctx.render('index', ctx.state)
  })
  router.get('/welcome', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title'
    };
    await ctx.render('welcome', {title: ctx.state});
  })
}
