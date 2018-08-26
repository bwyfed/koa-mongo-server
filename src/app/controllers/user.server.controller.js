
const passport = require('koa-passport')
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = require('../../config').jwtSecret
const mongoose = require('mongoose')
const User = mongoose.model('User')

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
    if (!body.username || !body.password) {
      ctx.status = 400
      ctx.body = {
        code: '10002',
        msg: `expected an object with username, password but got: ${body}`
      }
      return
    }
    // 请求微服务，入库
    // ...
    try {
      // 查询数据库是否已有用户
      let user = await User.find({username: body.username})
      console.log('User.find')
      console.log(user)
      if (!user.length) { // 新用户
        // const newUser = await User.create(body)
        const newUser = new User(body)
        // Set the user provider property
        newUser.provider = 'local'
        console.log('new User(body)')
        console.log(newUser)

        user = await newUser.save()
        ctx.status = 200
        ctx.body = {
          code: '10000',
          msg: 'register success'
        }
      } else {
        ctx.status = 406
        ctx.body = {
          code: '10003',
          msg: 'user has exist'
        }
      }
    } catch (err) {
      ctx.throw(500)
    }
    
  }
}

module.exports = UserController