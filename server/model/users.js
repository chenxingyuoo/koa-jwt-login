const Sequelize = require('sequelize');
const db = require('../db/mysql')

const User = db.define('user', {
  id: {
      type: Sequelize.BIGINT,
      primaryKey: true
  },
  username: Sequelize.CHAR(100),
  password: Sequelize.CHAR(100)
}, {
  tableName: 'users',
  timestamps: false
})

module.exports = User
