const grantService = require('../services/grants.service.js')
const householdService = require('../services/household.service.js')
const { getAge } = require('../utils/helpers.js')


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

        let table = {}
        
        households.forEach(household => {
            
            let householdAnnualIncome = 0
            let husband, wife
        
            if (household.familyMembers.length === 0) {
                return
            }

            
            household.familyMembers.forEach(person => {
                householdAnnualIncome += person.annualIncome

                // Family Tgt Scheme : check married and have both husband and wife
                if (person.maritalStatus === 'Married' && person.gender === 'Male') {
                    husband = person
                } 

                if (person.maritalStatus === 'Married' && person.gender === 'Female') {
                    wife = person
                }
            })
            
            let grantRecipients = {
                SEB : [],
                FamilyTGT : [],
                ElderBonus : [],
                BSG : [],
                YOLO : []
            }

            /** YOLO GST Grant
            * HDB households with annual income of less than $100,000.
            */
            if (householdAnnualIncome < 100000) {
                grantRecipients.YOLO = household.familyMembers
            }
            
            household.familyMembers.forEach(person => {
                
                /** Student Encouragement Bonus 
                * Households with children of less than 16 years old
                * Household income of less than $150,000
                * */

                if (getAge(person.dob) < 16 && householdAnnualIncome < 150000) {
                    grantRecipients.SEB.push(person)
                }

                /** Family Togetherness Scheme
                * Households with husband & wife
                * Has child(ren) younger than 18 years old.
                */
                if (getAge(person.dob) < 18) {
                    // check if husband and wife in same household
                    if (husband !== undefined && wife !== undefined){ 
                        if (husband.spouse === wife.name) {
                            grantRecipients.FamilyTGT.push(person)
                        }
                    } 
                }

                /** Elder Bonus
                 * HDB household with family members above the age of 50.
                 */
                if (getAge(person.dob) > 50) {
                    grantRecipients.ElderBonus.push(person)
                }

                /** Baby Sunshine Grant
                *  Household with young children younger than 5.
                */
                if (getAge(person.dob) < 5) {
                    grantRecipients.BSG.push(person)
                }

            })

            // TODO: Return the receipients and households
            table[household.id] = grantRecipients
            res.send(table)
        })
        console.log(table)
    } catch (error) {
        next(error)
    }
}