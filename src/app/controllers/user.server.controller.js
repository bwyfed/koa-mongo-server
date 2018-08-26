
const passport = require('koa-passport')
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = require('../../config').jwtSecret

class UserController {
  static async login (ctx, next) {
    const { body } = ctx.request
    console.log('in user controller, body:')
    console.log(body)
    await passport.authenticate('local', (err, user, info) => {
      console.log('passport.authenticate callback,user')
      console.log(user)
      if (user === false) {
        ctx.body = {
          code: '10001', // 登录错误
          msg: 'Login failed',
          data: info
        }
      } else {
        // payload - info to put in JWT
        const payload = {
          username: user.username
        }
        // JWT is created here
        const token = jsonwebtoken.sign({
          data: payload,
          // set token expires time
          exp: Math.floor(Date.now() / 1000) + 60 // 60 seconds
        }, jwtSecret)
        ctx.body = {
          code: '10000', //登录成功
          msg: 'Login success',
          data: {
            token
          }
        }
      }
    })(ctx, next)

  }

  static async register (ctx) {
    const { body } = ctx.request

    ctx.body = {
      route: 'from controller, /native-api/user/register'
    }
  }
}

module.exports = UserController