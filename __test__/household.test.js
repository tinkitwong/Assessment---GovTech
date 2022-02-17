const app = require('../app.js')
const supertest = require('supertest')
const db  = require("../models/index")
const { occupationTypes, housingTypes } = require('../utils/constants.js')
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8')

describe('[/api/household]', () => {
    // let thisDb = db
    // jest.useFakeTimers()
    let thisDb = db

    beforeAll(async () => {
        for (attemptCount in [...Array(20).keys()]){
            try {
                // https://stackoverflow.com/a/21006886/5894029
                // await thisDb.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
                // console.log("attempt at database sync", attemptCount)
                // await thisDb.sequelize.sync({force: true});
                // await thisDb.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
                // https://stackoverflow.com/a/53236489/5894029
                await thisDb.sequelize.sync({force: false, alter : true});
            } catch {
                continue
            }
            break
            }
        });
    
    it('tests 0 households listing [/api/household]', async () => {
        
        let res = await supertest(app).get("/api/household")
        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual({message: `currently 0 households registered`})
            
    })
    
    it('creates household unit /api/household/create', async () => {
        let requestBody = {    
            "housingType": "HDB"
        }
        let res = await supertest(app).post("/api/household/create").send(requestBody)
        
        expect(res.statusCode).toBe(200)
    })

    it('tests wrong housing type /api/household/create', async() => {
        let requestBody = {    
            "housingType": "Wrong Housing Type"
        }
        let res = await supertest(app).post("/api/household/create").send(requestBody)
        expect(res.statusCode).toBe(400)
        expect(res.body).toStrictEqual({
            "message" : "Wrong Housing Type is not a valid housingType.",
            "validHousingTypes": housingTypes
        })
    })

    it('test null housing type input', async() => {
        let requestBody = {
            "housingType" : ""
        }
        let res = await supertest(app).post("/api/household/create").send(requestBody)
        expect(res.statusCode).toBe(400)
        expect(res.body).toStrictEqual({message: `housingType cannot be empty`})
    })

    it('adds family member to household unit [/api/household/addMember]', async() => {
        let requestBody = {
            "person": {
                "name": "Michael Pin",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": 1
            }
        }
        let res = await supertest(app).post("/api/household/addMember").send(requestBody)
    
        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual({
            "message": "Michael Pin added to household 1"
        })
    })

    it('fails to add valid householdId [/api/household/addMember]', async() => {
        let requestBody = {
            "person": {
                "name": "Thomas Gan",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": ""
            }
        }
        let res = await supertest(app).post("/api/household/addMember").send(requestBody)
    
        expect(res.statusCode).toBe(400)
        expect(res.body).toStrictEqual({
            "message" : "No household of householdId =  found"
        })
    })

    it ("tests invalid occupation type [/api/household/addMember]", async() => {
        let requestBody = {
            "person": {
                "name": "Thomas Gan",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "Invalid Occupation Type",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": "1"
            }
        }
        let res = await supertest(app).post("/api/household/addMember").send(requestBody)
    
        expect(res.statusCode).toBe(400)
        expect(res.body).toStrictEqual({
            message: `${requestBody.person.occupationType} is not a valid occupationType.`,
            validOccupationTypes : occupationTypes
        })
    })

    it("unable to add person to household [/api/household/addMember]", async() => {
        let requestBody = {
            "person": {
                "name": "Michael Pin",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": 1
            }
        }
        let res = await supertest(app).post("/api/household/addMember").send(requestBody)
    
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message: `Internal Server Error`
        })
    })

    it('lists all households [/api/household]', async () => {
        let res = await supertest(app).get("/api/household/")
        expect(res.statusCode).toBe(200)
    })

    it('fails to list all households [/api/household/123]', async () => {
        let res = await supertest(app).get("/api/household/123")
        expect(res.statusCode).toBe(500)
    })

    it('shows household [/api/household/1]', async () => {
        let res = await supertest(app).get("/api/household/1")
        expect(res.statusCode).toBe(200)
    })

    it('show non existent household [/api/household/100]', async () => {
        let url = "/api/household/null" + ""
        let res = await supertest(app).get(url)
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : "household with householdId = null not found"
        })
    })

    it('removes family member from household [/api/household/removeMember]', async () => {
        let requestBody = {
            "householdId" : 1,
            "familyMemberName" : "Michael Pin"
        }
        let res = await supertest(app).delete("/api/household/removeMember").send(requestBody)
        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual({
            message : `${requestBody.familyMemberName} removed from HouseholdId = ${requestBody.householdId}`
        })
    })

    it('fails to remove family member from household [/api/household/removeMember]', async () => {
        let requestBody = {
            "person": {
                "name": "Jordan Pin",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": 1
            }
        }
        await supertest(app).post("/api/household/addMember").send(requestBody)
    
        requestBody = {
            "person": {
                "name": "Michael Pin",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "2021-04-15"
            },
            "household": {
                "householdId": 1
            }
        }
        await supertest(app).post("/api/household/addMember").send(requestBody)

        requestBody = {
            "householdId" : 1,
            "familyMemberName" : "Michaels Pin"
        }
        let res = await supertest(app).delete("/api/household/removeMember").send(requestBody)
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : `${requestBody.familyMemberName} was not removed from HouseholdId = ${requestBody.householdId}`
        })
    })

    it('removes family member from household [/api/household/removeMember]', async () => {
        let requestBody = {
            "householdId" : 'asdlkjfhba',
            "familyMemberName" : "alskdfhaslkdf"
        }
        let res = await supertest(app).delete("/api/household/removeMember").send(requestBody)
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : `Internal Server Error`
        })
    })    

    // it('null delete household [/api/household/delete/:id]', async () => {
    //     let res = await supertest(app).delete("/api/household/delete/:id=10")
        
    //     expect(res.statusCode).toBe(200)
    //     expect(res.body).toStrictEqual({
    //         message : "Household ID = 1 deleted succesfully"
    //     })
    // })

    it('deletes household [/api/household/delete/:id]', async () => {
        let res = await supertest(app).delete("/api/household/delete/1")
        
        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual({
            message : "Household ID = 1 deleted succesfully"
        })
    })

    it('deletes household [/api/household/delete/:id]', async () => {
        let res = await supertest(app).delete("/api/household/delete/1")
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : "Cannot delete Household ID = 1"
        })
    })

    it('invalid input when deleting household [/api/household/delete/:id]', async () => {
        let res = await supertest(app).delete("/api/household/delete/1asd")
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : "Internal Server Error"
        })
    })
})