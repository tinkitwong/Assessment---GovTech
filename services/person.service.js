const db = require('../models')
const Person = db.person
const Op = db.Sequelize.Op

module.exports = {
    // create person
    create : (personInstance) => { 
        try {
            return Person.create(personInstance)
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
    findOrCreate : async (personInstance) => {
        try {
            
            const [user, created] = await Person.findOrCreate({ 
                    where: { name : personInstance.name },
                    defaults : personInstance
            })
            if ( created ) {
                return user
            }
            else {
                throw new Error(`${personInstance.name} not created succesfully`)
            }
            
        } catch (error) {
            return error
        }
    }
}