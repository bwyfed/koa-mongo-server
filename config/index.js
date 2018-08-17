const commonConfig = require('./common')
// Load the correct configuration file according to the 'NODE_ENV' variable
let envConfig = require('./env/' + process.env.NODE_ENV + '.js')

module.exports = {
  ...commonConfig,
  ...envConfig
}


