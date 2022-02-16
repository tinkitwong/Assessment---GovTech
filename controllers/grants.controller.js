const householdService = require('../services/household.service.js')
const { getAge } = require('../utils/helpers.js')


exports.checkEligibility = async (req, res, next) => {
    try {
        
        // criterias
        const householdSize = parseInt(req.query.householdSize) ? parseInt(req.query.householdSize) : 0
        const totalIncome = parseFloat(req.query.totalIncome) ? parseFloat(req.query.totalIncome) : 0
        
        // get all households
        let households = await householdService.findAll()
        
        if (households.length === 0) {
            res.status(500).send({
                message : `Number of households found = ${households.length}`
            })
            return
        }
        
        let table = {}
        
        households.forEach(household => {
            
            let householdAnnualIncome = 0
            let husband, wife
        
            if (household.familyMembers.length === 0 || household.familyMembers.length > householdSize) {
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
                SEB : [], // Student Encouragement Bonus
                FamilyTGT : [], // Family Tgterness Scheme
                ElderBonus : [], // Elder Bonus
                BSG : [], // Baby Sunshine Grant
                YOLO : [] // YOLO GST Grant
            }

            /** YOLO GST Grant
            * HDB households with annual income of less than $100,000.
            */
            if (householdAnnualIncome < 100000 && householdAnnualIncome <= totalIncome) {
                grantRecipients.YOLO = household.familyMembers
            }
            
            household.familyMembers.forEach(person => { 
                
                /** Student Encouragement Bonus 
                * Households with children of less than 16 years old
                * Household income of less than $150,000
                * */
                if (getAge(person.dob) < 16 && householdAnnualIncome < 150000 && householdAnnualIncome <= totalIncome) {
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
                            grantRecipients.FamilyTGT = household.familyMembers
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

            // return the receipients and households
            table[household.id] = grantRecipients
        })
        res.send(table)
    } catch (error) {
        next(error)
    }
}