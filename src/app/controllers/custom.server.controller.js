const passport = require('koa-passport')
class CustomController {
  static async map(ctx, next) {
    const { body } = ctx.request
    console.log('in custom controller, body:')
    console.log(body)

    await passport.authenticate('jwt', (err, user, info) => {
      console.log('jwt passport.authenticate callback,user')
      console.log(user)
      console.log(info)
      if (user) {
        ctx.body = {
          code: '10000',
          msg: 'success',
          data: {
            mapType: 'Baidu',
            message: 'Hello, ' + user.username
          }
        }
      } else {
        ctx.body = {
          code: '10005',
          msg: 'auth fail',
          data: info.message
        }
        console.log(err)
      }
    })(ctx, next)
    
  }
}

module.exports = CustomController