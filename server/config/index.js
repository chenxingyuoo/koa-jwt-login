
const os = require('os');
// console.log('os.networkInterfaces()', os.networkInterfaces());

module.exports = {
  tokenExpiresTime: 60 * 60, // token过期时间
  secret: 'i am secret key', // 密钥key
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