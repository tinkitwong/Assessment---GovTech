const db = require('../models')
const household = db.household
const Op = db.Sequelize.Op

module.exports = {
    // create household
    create : function (householdInstance) { 
        try {
            return household.create(householdInstance)
            .then(data => {
                return data
            })
            .catch(error => {
                throw error
            })
        } catch (error) {
            return (error)
        }
    }
}