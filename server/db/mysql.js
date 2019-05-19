const Sequelize = require('sequelize');
const mysqlConfig = require('./config').mysql;

const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
    host: mysqlConfig.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

module.exports = sequelize

