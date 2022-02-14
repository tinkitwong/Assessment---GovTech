const grantService = require('../services/grants.service.js')
const householdService = require('../services/household.service.js')
const helpers = require('../utils/helpers.js')


exports.checkEligibility = async (req, res, next) => {
    try {
        
        const householdSize = req.query.householdSize ? req.query.householdSize : 0
        const totalIncome = req.query.totalIncome ? req.query.totalIncome : 0
        
        // get all households
        let households = await householdService.findAll()
        
        if (households.length === 0) {
            res.status(500).send({
                message : `Number of households found = ${households.length}`
            })
            return
        };
        
        let results = {
            'Student Encouragement Bonus' : [],
            'Family Togetherness Scheme' : [],
            'Elder Bonus' : [],
            'Baby Sunshine Grant' : [],
            'YOLO GST Grant' : [], 
        };
        
        households.forEach(household => {
            let householdAnnualIncome = 0
            if (household.familyMembers.length === 0) {
                return
            }
            household.familyMembers.forEach(person => {
                householdAnnualIncome += person.annualIncome
                if ( helpers.getAge(person.dob) < 16 ) {
                    
                }
            })
           
           /** Student Encouragement Bonus 
            * Households with children of less than 16 years old
            * Household income of less than $150,000
            * */
            


           /** Family Togetherness Scheme
            * Households with husband & wife
            * Has child(ren) younger than 18 years old.
            */



           /** Elder Bonus
            * HDB household with family members above the age of 50.
            */



           /** YOLO GST Grant
            * HDB households with annual income of less than $100,000.
            */

        })

    } catch (error) {
        next(error)
    }
}