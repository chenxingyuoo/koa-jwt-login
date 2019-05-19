const redis = require("redis")
const client = redis.createClient(6379,'localhost')

module.exports = client