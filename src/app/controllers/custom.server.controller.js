
class CustomController {
  static async map(ctx, next) {
    const { body } = ctx.request
    console.log('in custom controller, body:')
    console.log(body)

    ctx.body = {
      code: '10000',
      msg: 'success',
      data: {
        mapType: 'Baidu'
      }
    }
  }
}

module.exports = CustomController