const personService = require('../services/person.service.js')

// create person
exports.create = async (req, res, next) => {
    try {
        
        const personInstance = {
            name : req.body.name ? req.body.name : "",
            gender : req.body.gender ? req.body.gender : "",
            maritalStatus : req.body.maritalStatus ? req.body.maritalStatus : "",
            spouse : req.body.spouse ? req.body.spouse : "",
            occupationType : req.body.occupationType ? req.body.occupationType : "",
            annualIncome : req.body.annualIncome ? req.body.annualIncome : "",
            dob : req.body.dob ? req.body.dob : ""
        }
        
        const person = await personService.findOrCreate(personInstance)
        if ( Object.keys(person).length === 0 ) {
            res.status(500).send({
                message : `${personInstance.name} already registered`
            })
        } else {
            res.send(person)
        }
        
    } catch (error) {
        next(error)
    }
}