const jwt = require('jsonwebtoken')
const config = require('../config')

exports.sign = (json, options = {}) => {
  const token = jwt.sign(json, config.secret, Object.assign({
      expiresIn: config.tokenExpiresTime // 设置过期时间
  }, options))
  return token
}

exports.signout = (json, options = {}) => {
  jwt.sign(json, config.secret, Object.assign(options, {
      expiresIn: 0 // 马上过期
  }))
}