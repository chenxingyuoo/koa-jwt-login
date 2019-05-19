const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = async (ctx, next) => {
  const token = ctx.request.header.token || ctx.request.query.token || ctx.request.body.token || ctx.request.body.fields.token || ctx.request.get('authorization');
  
  if (!token || token === 'null') {
    ctx.status = 401;
    return;
  }

  try {
    await jwt.verify(token, config.secret);
  } catch (e) {
    ctx.status = 401;
    return
  }
  
  await next()
}