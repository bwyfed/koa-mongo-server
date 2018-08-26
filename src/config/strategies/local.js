// Load the module dependencies
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
// Get User model
const User = require('mongoose').model('User')

// fetch user info
const fetchUserInfo = async (username) => {
  // Fetch data from remote server

  // Update the mongodb
  console.log('fetchUserInfo')
  // Mock data
  // const user = {id: 1, username: 'test', password: 'test'}

  // Get data from mongodb
  const user = await User.findOne({username})
  return user
}
// Create the Local strategy configuration method
exports.createLocalStrategy = (passport) => {
  // Use the Passport's Local strategy
  console.log('register local strategy')
  passport.use(new LocalStrategy((username, password, done) => {
    console.log(`invoke local strategy,username:${username}, password:${password}`)
    fetchUserInfo(username)
    .then(user => {
      console.log('user from db:', user)
      console.log('start auth')
      // If a user was not found, continue to the next middleware with an error message
			if (!user) {
        console.log('Unknown user')
				return done(null, false, {
					message: 'Unknown user'
				});
      }
      // If the passport is incorrect, continue to the next middleware with an error message
			if (!user.authenticate(password)) {
        console.log('Invalid password')
				return done(null, false, {
					message: 'Invalid password'
				});
      }
      // Otherwise, continue to the next middleware with the user object
			return done(null, user);
    })
    .catch((err) => ( done(err) ))
  }))
}

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async (username, password, done) => {
    console.log('local strategy')
    console.log(username, password)
    const user = await fetchUserInfo(username)
    if (!user) {
      return done(null, false, {
        message: 'Unknown user'
      })
    }
    // call User model method authenticate to verify password
    if (!user.authenticate(password)) {
      return done(null, false, {
        message: 'Invalid password'
      })
    }
    // auth success
    return done(null, user)
  }
))
}
