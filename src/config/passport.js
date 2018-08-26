// Load the module dependencies
const passport = require('koa-passport')
const mongoose = require('mongoose')

// Define the Passport configuration method
module.exports = function() {
  // Load the 'User' model
  const User = mongoose.model('User')

  // Use Passport's 'serializeUser' method to serialize the user id
  passport.serializeUser((user, done) => {
    console.log(`serializeUser,user:`)
    console.log(user)
    done(null, user.id)
  })

  // Use Passport's 'deserializeUser' method to load the user document
  passport.deserializeUser((id, done) => {
    console.log(`deserializeUser,id:${id}`)
    try {
      User.findOne({
        _id: id
      }, '-passoword -salt', (err, user) => {
        done(err, user)
      })
    } catch(err) {
      done(err)
    }
  })

  // Load Passport's strategies configuration files
  require('./strategies/local')()

  // register Passport on Koa Application instance

}