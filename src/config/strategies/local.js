// Load the module dependencies
const LocalStrategy = require('passport-local').Strategy
// Get User model
const User = require('mongoose').model('User')

// fetch user info
exports.fetchUserInfo = (() => {
  // Fetch data from remote server

  // Update the mongodb

  // Mock data
  const user = {id: 1, username: 'test', password: 'test'}

  // Get data from mongodb
  return async () => {
    return user
  }
})()
// Create the Local strategy configuration method
exports.createLocalStrategy = (passport) => {
  // Use the Passport's Local strategy
  console.log('create local strategy')
  passport.use(new LocalStrategy((username, password, done) => {
    console.log('invoke local strategy')
    fetchUserInfo()
    .then(user => {
      console.log('compare username and password')
      console.log('user', user)
      if (username === user.username && password === user.password) {
        done(null, user)
      } else {
        done(null, false, {
          message: 'Invalid password'
        })
      }
    })
    .catch((err) => ( done(err) ))
  }))
}