
const os = require('os');
// console.log('os.networkInterfaces()', os.networkInterfaces());

module.exports = {
  secret: 'i am secret key',
  security: {
    csrf: {
      ignore: ctx => {
        // console.log('ctx.ip', ctx.ip);
        // console.log('ctx.req', ctx.req);
        return true
        // return ctx.ip === '127.0.0.1'
      }
    }
  }
}