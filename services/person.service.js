const db = require('../models')
const familyMember = db.familyMember
const Op = db.Sequelize.Op

module.exports = {
    // create familyMember
    create : function (familyMemberInstance) { 
        try {
            familyMember.create(familyMemberInstance)
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