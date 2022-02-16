const { Sequelize } = require('sequelize')
const dbConfig = require('../config/db.config.js')


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER, 
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        dialectOptions: { decimalNumbers: true },
        operatorsAliases: 0,  // false

        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle
        }, 
        logging: false
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


db.household = require('./household.model.js')(sequelize, Sequelize)
db.person = require('./person.model.js')(sequelize, Sequelize)
db.grants = require('./grants.model.js')(sequelize, Sequelize)

// relationships
db.household.hasMany(db.person, { onDelete: 'cascade', as: 'familyMembers' })
db.person.belongsTo(db.household, { foreignKey: 'householdId', as: 'household' })
db.household.hasMany(db.grants, { foreignKey: 'grantId', as: 'grants' })

module.exports = db