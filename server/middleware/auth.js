const jwt = require('jsonwebtoken')
const config = require('../config')
const { client } = require('../db/redis')
const { tokenMalformed } = require('../lib/utils/response')

module.exports = async (ctx, next) => {
  const token = ctx.request.header.token || ctx.request.query.token || ctx.request.body.token || ctx.request.body.fields.token || ctx.request.get('authorization')
  
  if (!token || token === 'null') {
    ctx.status = 401
    return
  }

  try {
    const user = await client.get(token)
    const userToken = await client.get(`user_${user.id}`)

    if (userToken && userToken !== token) {
      console.log('在别处登录');
      ctx.body = tokenMalformed({
        message: '您的账号在另一个设备登录了'
      })
      return
    }
    const result = await jwt.verify(token, config.secret)
    console.log('result', result)
  } catch (e) {
    ctx.status = 401
    return
  }
  
  await next()
}