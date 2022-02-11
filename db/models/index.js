const { Sequelize } = require('sequelize')
const dbConfig = require('../config/db.config.js')


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER, 
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: 0,  // false
      
        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle
        },
      
        define: {
          freezeTableName: true,
        }, 
        logging: false
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db