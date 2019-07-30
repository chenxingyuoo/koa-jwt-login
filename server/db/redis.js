const redis = require('redis')
const redisConfig = require('./config').redis
const redisClient = redis.createClient(redisConfig.port,redisConfig.host)

exports.client = {
  async set (key, value, time) {
    return await new Promise((resolve, reject) => {
      redisClient.set(key, JSON.stringify(value), (err, value) => {
        if (err) {
          reject(err)
        } else {
          time ? redisClient.expire(key,time) : ''
          resolve(value)
        }
      })
    })
  },

  async get (key) {
    return await new Promise((resolve, reject) => {
      redisClient.get(key, (err, value) => {
        if (err) {
          reject (err)
        } else {
          resolve(JSON.parse(value))
        }
      })
    })
  },

  async remove (key) {
    return await new Promise((resolve, reject) => {
      redisClient.remove(key, (err, value) => {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }
}

redisClient.on('error',(error) => {
  console.log('redis error ', error);
});

exports.redisClient = redisClient