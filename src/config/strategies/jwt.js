const passport = require('koa-passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwtSecret = require('../').jwtSecret

// Get User model
const User = require('mongoose').model('User')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKey: jwtSecret
}

module.exports = () => {
  console.log('register jwt strategy')
  passport.use(new JwtStrategy(jwtOptions,
    async (payload, done) => {
      console.log('jwt strategy')
      console.log(payload)
      const user = await User.findOne({username:payload.data.username})
      console.log(user)
      if (user) {
        done(null, user)
      } else {
        done(null, false, {
          message: 'Token is invalid'
        })
      }
    })
  )
}