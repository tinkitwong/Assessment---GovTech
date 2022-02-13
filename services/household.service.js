const db = require('../models')
const Household = db.household
const Op = db.Sequelize.Op

module.exports = {
    // create household
    create : (householdInstance) => { 
        try {
            return Household.create(householdInstance)
            .then(data => {
                return data
            })
            .catch(error => {
                throw error
            })
        } catch (error) {
            return error
        }
    }, 
    // find household by PK: ID
    findByPk : (householdId) => {
        try {
            return Household.findByPk(householdId, {
                include : { all : true }
            })
            .then(data => {
                return data
            })
            .catch(error => {
                throw error
            })
        } catch (error) {
            return error
        }
    },
    // find all households
    findAll : () => {
        try {
            return Household.findAll({
                include : { all: true }
            }).then(data => {
                return data
            }).catch(error => {
                throw error
            })
        } catch (error) {
            return error
        }
    }
}