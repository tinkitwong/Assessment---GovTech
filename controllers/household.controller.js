const householdService = require('../services/household.service.js')
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
            console.log(housingType in housingTypes)
            console.log(housingTypes)
            console.log(housingType)
            res.status(400).send({message: 'housingType not valid.'})
        }
        
        const householdInstance = {
            HousingType : housingType ? housingType : ""
        }

        const household = await householdService.create(householdInstance)
        
        res.send(household)

    } catch (error) {
        console.log(error)
        next(error)
    }
}

// add familyMember to household
exports.addFamilyMember = async (req, res, next) => {
    try {
        // find household by id
        const household = await householdService.findOneByPK()
        
        const familyMember = req.body.familyMember
        const result = await household.addPerson(familyMember)
        res.send(result)

    } catch (error) {
        next(error)
    }
}
