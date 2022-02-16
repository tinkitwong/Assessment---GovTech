const householdService = require('../services/household.service.js')
const personService = require('../services/person.service.js')
const { housingTypes, occupationTypes } = require('../utils/constants.js')

// create a household (housing unit)
exports.create = async (req, res, next) => {
    // fields (Possible options: Landed, Condominium, HDB)
    try {
        
        const housingType = req.body.housingType

        if ( !housingType ) {
            res.status(400).send({message: `housingType cannot be empty`})
        }
        else {
        
            if ( !(housingType in housingTypes) ) {
                res.status(400).send({
                    message: `${housingType} is not a valid housingType.`,
                    validHousingTypes: housingTypes
                })
                return
            }
            else {
            
                const householdInstance = {
                    housingType : housingType ? housingType : ""
                }

                const household = await householdService.create(householdInstance)
                
                res.send(household)
            }
        }
    } catch (error) {
        next(error)
    }
}

// add familyMember to household
exports.addFamilyMember = async (req, res, next) => {
    try {

        const householdId = req.body.household.householdId ? req.body.household.householdId : ""
        let household = await householdService.findByPk(householdId)
        
        if ( household === null ) {
            res.status(400).send({
                message: `No household of householdId = ${householdId} found`
            })
            return
        } 
        else {

            /** Verify personInstance */
            const personInstance = {
                name : req.body.person.name ? req.body.person.name : "",
                gender : req.body.person.gender ? req.body.person.gender : "",
                maritalStatus : req.body.person.maritalStatus ? req.body.person.maritalStatus : "",
                spouse : req.body.person.spouse ? req.body.person.spouse : "",
                occupationType : req.body.person.occupationType ? req.body.person.occupationType : "",
                annualIncome : req.body.person.annualIncome ? req.body.person.annualIncome : "",
                dob : req.body.person.dob ? req.body.person.dob : ""
            }

            if ( !(personInstance.occupationType in occupationTypes) ) {
                res.status(400).send({
                    message: `${personInstance.occupationType} is not a valid occupationType.`,
                    validOccupationTypes : occupationTypes
                })
                return
            }
            else {
                const familyMember = await personService.findOrCreate(personInstance)
                await household.addFamilyMembers(familyMember)
                
                const [verifyFamilyMember] = await household.getFamilyMembers({ where : {id : familyMember.id} })
                
                if (verifyFamilyMember.toJSON().id === familyMember.id) {
                    res.status(200).send({
                        message : `${familyMember.name} added to household ${household.id}`
                    })
                } else {
                    res.status(500).send({
                        message : `Unable to add ${familyMember.name} to ${household.id}`
                    })
                }
            }
        }
    } catch (error) {
        next(error)
    }
}

// list all households
exports.findAll = async (req, res, next) => {
    try {
        const households = await householdService.findAll()
        if (households !== null && households.length > 0 ) {
            res.status(200).send(households)
        }
        else if (households !== null && households.length === 0) {
            res.status(200).send({message: `currently ${households.length} households registered`})
        }
    } catch (error) {
        next(error)
    }
}

// get household by id
exports.findByPk = async (req, res, next) => {
    try {
        const householdId = req.params.id ? req.params.id : ""

        if (householdId === null) {
            res.status(400).send({
                message : `householdId = ${householdId} cannot be null`
            })
        }
        else {
            const household = await householdService.findByPk(householdId)
            
            if (household === null) {
                res.status(500).send({
                    message : `household with householdId = ${householdId} not found`
                })
            } 
            else {
                res.send(household)
            }
        }
    } catch (error) {
        next(error)
    }
}

// delete household (* deletes familyMembers as well)
exports.delete = async (req, res, next) => {
    try {
        const householdId = req.params.id ? req.params.id : ""
        
        if (householdId === null) {
            res.status(400).send({
                message: `HouseholdId = ${householdId} cannot be null`
            })
            return
        }
        else {
            const result = await householdService.delete(householdId)
            if (result === 1) {
                res.status(200).send({
                    message : `Household ID = ${householdId} deleted succesfully`
                })
            }
            else {
                res.status(500).send({
                    message: `Cannot delete Household ID = ${householdId}`
                })
            }
        }
    } catch (error) {
        next(error)
    }
}
// remove family member
exports.removeMember = async (req , res, next) => {
    try {

        const householdId = req.body.householdId ? req.body.householdId : ""
        const familyMemberName = req.body.familyMemberName ? req.body.familyMemberName : ""
        
        // get household Obj
        const household = await householdService.findByPk(householdId)
        
        // get familyMember Obj
        const familyMember = await personService.findByName(familyMemberName)

        // remove familyMember from household
        await household.removeFamilyMembers(familyMember)

        const checkHousehold = await householdService.findByPk(householdId)
        const familyMembers = await checkHousehold.getFamilyMembers()

        if (familyMembers.length +1 === household.familyMembers.length) {
            res.status(200).send({
                message : `${familyMemberName} removed from HouseholdId = ${householdId}`
            })
        }
        else {
            res.status(500).send({
                message : `${familyMemberName} was not removed from HouseholdId = ${householdId}`
            })
        }
                
    } catch (error) {
        next(error)
    }
}