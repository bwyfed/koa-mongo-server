const passport = require('koa-passport');
const fs = require('fs');
const path = require('path')
const users = require('../controllers/users.server.controller')

module.exports =  (router) => {
  // router.get('/', async (ctx) => {
  //   ctx.type = 'html';
  //   ctx.body = fs.createReadStream(path.resolve(__dirname,'../../views/login.html'));
  // })

  router.get('/',async (ctx, next) => {
    // If user is not connected render the signin page, otherwise redirect the user back to the main appliaction page
    ctx.state = {
      title: 'Sign-in Page'
    }
    // render the signin page
    ctx.type = 'html'
    await ctx.render('signin', ctx.state)
  })

  router.get('/success', async function (ctx, next) {
      ctx.state = {
        title: 'koa2 title success'
      };
      await ctx.render('success', {title: ctx.state});
  })

  router.get('/fail', async function (ctx, next) {
    ctx.state = {
      title: 'koa2 title fail'
    };
    await ctx.render('fail', {title: ctx.state});
  })
  
  router.post('/custom', async (ctx) => {
    console.log(`/custom, ctx.request.body=`)
    console.log(ctx.request.body)
    return passport.authenticate('local', (err, user, info, status) => {
      console.log(`err:${err}, info:${info}, status:${status}, user:, `)
      console.log(ctx.request.body)
      if (user === false) {
        console.log('auth fail')
        ctx.body = { success: false };
        ctx.throw(401);
      } else {
        console.log('auth success')
        ctx.body = { success: true };
        return ctx.login(user)
      }
    })(ctx)
  })
  
  router.post('/signin',
    passport.authenticate('local', {
      successRedirect: '/success',
      failureRedirect: '/fail'
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