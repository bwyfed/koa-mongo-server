// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// Load the module dependencies
const mongoose = require('./config/mongoose')
const koa2 = require('./config/koa2.test')
// const Passport = require('./config/passport.test')
// Create a new Mongoose connection instance
const db = mongoose()

// Create a new Koa appliaction instance
const app = koa2()

// Create the Passport middleware
// const passport = Passport(app)

const config = require('./config')
// server
app.listen(config.port, () => {
  console.log(`Server listening on port: ${config.port}`);
});
