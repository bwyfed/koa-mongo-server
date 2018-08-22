const passport = require('koa-passport');
const fs = require('fs');
const path = require('path')

module.exports =  (router) => {
  router.get('/', async (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.resolve(__dirname,'../../views/login.html'));
  })
  
  router.post('/custom', async (ctx) => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user === false) {
        ctx.body = { success: false };
        ctx.throw(401);
      } else {
        ctx.body = { success: true };
        return ctx.login(user)
      }
    })(ctx)
  })
  
  router.post('/signin',
    passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/'
    })
  )
  
  router.get('/logout', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.logout();
      ctx.redirect('/');
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
  })
  
  router.get('/app', async (ctx) => {
    if (ctx.isAuthenticated()) {
      // ctx.type = 'html';
      // ctx.body = fs.createReadStream(path.resolve(__dirname,'../../views/app.html'));
      ctx.state = {
        title: 'koa2 title success'
      };
      await ctx.render('success', {title: ctx.state});
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
  })

  return router
}