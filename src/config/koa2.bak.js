// Load the module dependencies
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
// 认证鉴权相关
const session = require('koa-session')
const passport = require('koa-passport')

const path = require('path')

const config = require('./index')

// Define the Koa configuration method
module.exports = function() {
  // Create a new Koa application instance
  const app = new Koa()
  // Create a new Router instance
  const router = new Router()
  // error handler
  onerror(app)

  // sessions
  app.keys = [config.sessionSecret]
  // signin test
  //const usersController = require('../app/controllers/users.server.controller')
  const usersController = () => {
    console.log(`111 init`)
    const passport = require('koa-passport')
    const LocalStrategy = require('passport-local').Strategy
    // 定义passport处理用户信息的方法
    console.log(`222 start serializeUser`)
    passport.serializeUser((user, done) => {
      console.log(`serializeUser, user.id ${user.id}`)
      done(null, user.id)
    })
    console.log(`333 start deserializeUser`)
    passport.deserializeUser(async (id, done) => {
      console.log(`deserializeUser, id ${id}`)
      const query = User.findOne({_id: id}, '-passport -salt')
      await query.exec()
            .then(user => {
              console.log(`fetch user info by id from db. id ${user._id}`)
              done(null, user)
            })
            .catch(err => {
              done(err)
            })
    })
    // 注册了策略
    console.log(`444 start register local strategy`)
    passport.use(new LocalStrategy(async (username, password, done) => {
      console.log(`in local strategy, username ${username}, password ${password}`)
      const query = User.findOne({ username: username }) 
      const promise = query.exec()
      await promise.then((userDoc) => {
        console.log(`start authenticate`)
        if (!userDoc) { return done(null, false, {message: 'Unknown user'}); }
        if (!userDoc.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' })
        }
        console.log(`authenticate success`)
        return done(null, userDoc)
      })
      .catch(err => {
        return done(err);
      })
    }))
  }
  const auth = () => {
    const passport = require('koa-passport');
    const LocalStrategy = require('passport-local').Strategy;
    console.log('auth init start')
    const fetchUser = (() => {
      const user = { id: 1, username: 'test', password: 'test' };
      return async () => {
        return user;
      }
    })();

    passport.serializeUser((user, done) => {
      console.log('serializeUser')
      done(null, user.id)
    });

    passport.deserializeUser(async (id, done) => {
      console.log('deserializeUser')
      try {
        const user = await fetchUser();
        done(null, user);
      } catch(err) {
        done(err);
      }
    });

    passport.use(new LocalStrategy((username, password, done) => {
      console.log('LocalStrategy 1111')
      fetchUser()
        .then(user => {
          console.log('LocalStrategy 2222 '+ user.username)
          if (username === user.username && password === user.password) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((err) => { done(err) });
    }));
    console.log('auth init end')
  }
  // middlewares
  app.use(bodyParser()) // body parser
  // .use(json())
  .use(logger())
  .use(require('koa-static')(path.join(__dirname, '../public')))
  .use(views(path.join(__dirname, '../app/views'), {
    options: {settings: {views: path.join(__dirname, '../app/views')}},
    map: {'pug': 'pug'},
    extension: 'pug'
  }))
  // .use(session(app)) // sessions
  // .use(passport.initialize()) // authentication init
  // .use(passport.session({
  //   saveUninitialized: true,
  //   resave: true,
  //   secret: config.sessionSecret
  // })) // authentication session
  // .use(router.routes())
  // .use(router.allowedMethods())

  // test code
  app.use(session(app))
  // authentication
  // usersController() // signin test init
  auth()
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(router.routes())
  
  // logger
  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
  })
  // Load the routing files
  require('../app/routes/index.server.routes')(router)
  require('../app/routes/users.server.routes')(router)

  app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
  })

  // Return the Koa application instance
  return app
}
