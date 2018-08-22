
// Load the module dependencies
const mongoose = require('mongoose')
const config = require('./index')

// Define the Mongoose configuration method
module.exports = function () {
  const options = {
    auto_reconnect: true,
    poolSize: 10,
    useNewUrlParser: true
  }
  // Use Mongoose to connect to MongoDB
  const db = mongoose.connect(config.db, options)

  // Load the application models
  // Load the 'User' model
  require('../app/models/user.server.model')

  // Return the Mongoose connection instance
  return db
}
