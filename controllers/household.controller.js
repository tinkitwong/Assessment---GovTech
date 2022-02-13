const householdService = require('../services/household.service.js')
const personService = require('../services/person.service.js')
const { housingTypes } = require('../utils/constants.js')

// create a household (housing unit)
exports.create = async (req, res, next) => {
    // fields (Possible options: Landed, Condominium, HDB)
    try {
        
        const housingType = req.body.housingType

        if ( !housingType ) {
            res.status(400).send({message: 'housingType cannot be empty'})
        }
        
        if ( !(housingType in housingTypes) ) {
            res.status(400).send({message: 'housingType not valid.'})
            return
        }
        
        const householdInstance = {
            housingType : housingType ? housingType : ""
        }

        const household = await householdService.create(householdInstance)
        
        res.send(household)

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
            res.status(500).send({
                message: `No household of householdId = ${householdId} found`
            })
            return
        }

        const personInstance = req.body.person ? req.body.person : ""
        const familyMember = await personService.findOrCreate(personInstance)
        await household.addFamilyMembers(familyMember)
        
        
        const [verifyFamilyMember] = await household.getFamilyMembers({ where : {id : familyMember.id}})
        
        if (verifyFamilyMember.toJSON().id === familyMember.id) {
            res.status(200).send({
                message : `${familyMember.name} added to household ${household.id}`
            })
        } else {
            res.status(500).send({
                message : `Unable to add ${familyMember.name} to ${household.id}`
            })
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
            res.send(households)
        }
        else if (households !== null && households.length === 0) {
            res.send({message: `currently ${households.length} households registered`})
        }
        else {
            throw new Error(`not able to get all households`)
        }
    } catch (error) {
        next(error)
    }
}