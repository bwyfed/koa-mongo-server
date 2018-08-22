// Load the module dependencies
const passport = require('koa-passport')
const mongoose = require('mongoose')

// Define the Passport configuration method
module.exports = function(app) {
  require('./auth.test');
  app.use(passport.initialize());
  app.use(passport.session());

  /*
  // Load the 'User' model
  const User = mongoose.model('User')
console.log(1111)
  // Use Passport's 'serializeUser' method to serialize the user id
  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user.id)
  })
console.log(2222)
  // Use Passport's 'deserializeUser' method to load the user document
  passport.deserializeUser(async (id, done) => {
    console.log(`deserializeUser, id=${id}, this=${this}`)
    try {
      const query = User.findOne({ _id: id }, '-passoword -salt')
      await query.exec()
            .then((user) => {
              if(!user) done(null, user)
              else done(null, {})
            })
            .catch(err => {
              done(err)
            })
    } catch(err) {
      done(err)
    }
  })

  // Load Passport's strategies configuration files
  require('./strategies/local')['createLocalStrategy'](passport)
  // register Passport on Koa Application instance
  app.use(passport.initialize());
  // app.use(passport.session());
  */

}