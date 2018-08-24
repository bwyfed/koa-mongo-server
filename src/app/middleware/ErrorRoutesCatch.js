module.exports = () => {
  return function (ctx, next) {
    return next().catch(err => {
      switch (err.status) {
        case 401:
          ctx.status = 200
          ctx.body = {
            code: 401,
            msg: 'Authentication Error',
            data: {
              msg: 'Protected resource, use Authorization header to get access.'
            }
          }
          break
        default:
          throw err
      }
    })
  }
}