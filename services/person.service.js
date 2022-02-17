const db = require('../models')
const Person = db.person
const Op = db.Sequelize.Op

module.exports = {
    // create person
    // create : (personInstance) => { 
    //     try {
    //         return Person.create(personInstance)
    //         .then(data => {
    //             return data
    //         })
    //         .catch(error => {
    //             throw error
    //         })
    //     } catch (error) {            
    //         return error
    //     }
    // },
    // create person if not found
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
    },
    // find person by name
    findByName : async (name) => {
        try {
            var condition = name ? { name: { [Op.like]: `${name}` } } : null;
            return Person.findAll({ 
                where : condition 
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