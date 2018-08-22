
// Create a new 'render' controller method
exports.render = async (ctx) => {
  console.log('render index')
  ctx.state = {
    title: 'Hello World',
    username: ctx.req.user ? ctx.req.user.username : ''
  }
  await ctx.render('index', ctx.state)
}