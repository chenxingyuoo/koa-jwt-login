const security = require('./security')

module.exports = (app) => {
  app.use(security)
}