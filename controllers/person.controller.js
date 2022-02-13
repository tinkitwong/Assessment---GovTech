const personService = require('../services/person.service.js')

// MW to add familyMember to household
exports.create = async (req, res, next) => {
    try {
        
        const personInstance = {
            name : req.body.name ? req.body.name : "",
            gender : req.body.gender ? req.body.gender : "",
            maritalStatus : req.body.maritalStatus ? req.body.maritalStatus : "",
            spouse : req.body.spouse ? req.body.spouse : "",
            occupationType : req.body.occupationType ? req.body.occupationType : "",
            annualIncome : req.body.annualIncome ? req.body.annualIncome : "",
            DOB : req.body.dob ? req.body.dob : ""
        }
        
        const person = await personService.create(personInstance)
        req.body.familyMember = person
        
        next()
        
    } catch (error) {
        next(error)
    }
}