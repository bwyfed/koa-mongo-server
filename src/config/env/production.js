
// Set the 'production' environment configuration object
module.exports = {
  db: 'mongodb://localhost:27017/inpno',
  sessionSecret: 'productionSessionSecret',
  jwtSecret: 'productionJwtSecret',
  port: 80
}
