const app = require('../app.js')
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8')

describe('[/api/household]', () => {
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

    it('tests when no households registered [/api/grants/checkEligibility]', async () => {
        let url = "/api/grants/checkEligibility?householdSize=3&totalIncome=100000"
        let res = await supertest(app).get(url)
        
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({
            message : "Number of households found = 0"
        })
    })

    
    it('tests for YOLO GST Grant [/api/grants/checkEligibility]', async () => {
        
        let household = {"housingType": "HDB"}
        await supertest(app).post("/api/household/create").send(household)

        let requestBody = {
            "person": {
                "name": "Michael Lim",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "EMPLOYED",
                "annualIncome": 60000,
                "dob": "1996-04-15"
                },
            "household": {
                "householdId": 1
            }
        }
        await supertest(app).post("/api/household/addMember").send(requestBody)


        let url = "/api/grants/checkEligibility?householdSize=1&totalIncome=500000"
        let res = await supertest(app).get(url)
        
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text)["1"]["YOLO"][0]["name"]).toStrictEqual("Michael Lim")
    })

    it('tests when 1 household has no familyMembers [/api/grants/checkEligibility]', async () => {
        let household = {"housingType": "HDB"}
        await supertest(app).post("/api/household/create").send(household)

        let url = "/api/grants/checkEligibility?householdSize=3&totalIncome=100000"
        let res = await supertest(app).get(url)
        
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text)["1"]["YOLO"][0]["name"]).toStrictEqual("Michael Lim")
    })

    it('tests YOLO GST Grant [/api/grants/checkEligibility]', async () => {
        let household = {"housingType": "HDB"}
        await supertest(app).post("/api/household/create").send(household)

        let requestBody = {
            "person": {
                "name": "Matthew Ang",
                "gender": "Male",
                "maritalStatus": "Married",
                "spouse": "Stephanie Seow",
                "occupationType": "EMPLOYED",
                "annualIncome": 30000,
                "dob": "1996-04-15"
                },
            "household": {
                "householdId": 2
            }
        }

        await supertest(app).post("/api/household/addMember").send(requestBody)

        requestBody = {
            "person": {
                "name": "Stephanie Seow",
                "gender": "Female",
                "maritalStatus": "Married",
                "spouse": "Matthew Ang",
                "occupationType": "EMPLOYED",
                "annualIncome": 30000,
                "dob": "1996-04-15"
                },
            "household": {
                "householdId": 2
            }
        }
        await supertest(app).post("/api/household/addMember").send(requestBody)

        let url = "/api/grants/checkEligibility?householdSize=3&totalIncome=100000"
        let res = await supertest(app).get(url)
        // console.log(JSON.parse(res.text)["2"])
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text)["2"]["YOLO"][0]["name"]).toStrictEqual("Matthew Ang")
        expect(JSON.parse(res.text)["2"]["YOLO"][1]["name"]).toStrictEqual("Stephanie Seow")
    })

    it('tests\
    Student Encouragement Bonus\
    Family Togetherness Scheme\
    Baby Sunshine Grant\
    [/api/grants/checkElligibility]', async () => {
        let child = {
            "person": {
                "name": "Jordan Ang",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "STUDENT",
                "annualIncome": 0,
                "dob": "2017-04-15"
                },
            "household": {
                "householdId": 2
            }
        }

        await supertest(app).post("/api/household/addMember").send(child)
        
        let url = "/api/grants/checkEligibility?householdSize=3&totalIncome=100000"
        let res = await supertest(app).get(url)
        
        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text)["2"]["YOLO"][0]["name"]).toStrictEqual("Matthew Ang")
        expect(JSON.parse(res.text)["2"]["YOLO"][1]["name"]).toStrictEqual("Stephanie Seow")
        expect(JSON.parse(res.text)["2"]["YOLO"][2]["name"]).toStrictEqual("Jordan Ang")

        expect(JSON.parse(res.text)["2"]["FamilyTGT"][0]["name"]).toStrictEqual("Matthew Ang")
        expect(JSON.parse(res.text)["2"]["FamilyTGT"][1]["name"]).toStrictEqual("Stephanie Seow")
        expect(JSON.parse(res.text)["2"]["FamilyTGT"][2]["name"]).toStrictEqual("Jordan Ang")

        expect(JSON.parse(res.text)["2"]["SEB"][0]["name"]).toStrictEqual("Jordan Ang")

        expect(JSON.parse(res.text)["2"]["BSG"][0]["name"]).toStrictEqual("Jordan Ang")
    })

    it('test Elder Bonus [/api/grants/checkEllgibility]', async () => {
        let elderly = {
            "person": {
                "name": "Rapheal Ang",
                "gender": "Male",
                "maritalStatus": "Single",
                "spouse": "",
                "occupationType": "UNEMPLOYED",
                "annualIncome": 0,
                "dob": "1965-04-15"
                },
            "household": {
                "householdId": 2
            }
        }

        await supertest(app).post("/api/household/addMember").send(elderly)
        let url = "/api/grants/checkEligibility?householdSize=4&totalIncome=100000"
        let res = await supertest(app).get(url)

        expect(res.statusCode).toBe(200)
        expect(JSON.parse(res.text)["2"]["ElderBonus"][0]["name"]).toStrictEqual("Rapheal Ang")
    })
})