
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Load the module dependencies
const mongoose = require('./config/mongoose'),
  koa2 = require('./config/koa2')

// Create a new Mongoose connection instance
const db = mongoose()

// Create a new Koa appliaction instance
const app = koa2()

const config = require('./config')
// Use the Koa application instance to listen to the config.port
app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`)
})

// Use the module.exports property to expose our Koa application instance for external usage
module.exports = app
