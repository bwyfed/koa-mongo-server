
// Create a new 'render' controller method
exports.render = async ctx => {
  console.log('render index page')
  // test session
  let n = ctx.session.views || 0
  ctx.session.views = ++n
  ctx.state = {
    title: 'Index Page',
    count: n,
    username: ctx.req.user ? ctx.req.user.username : ''
  }
  await ctx.render('index', ctx.state)
}