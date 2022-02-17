const app = require('../app.js')
const supertest = require('supertest')
const db  = require("../models/index")
const { occupationTypes, housingTypes } = require('../utils/constants.js')
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8')

describe('[/api/person]', () => {
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
    
    it('creates a person [/api/person/create]', async() => {
        let requestBody = {
            "name": "Michael Lim",
            "gender": "Male",
            "maritalStatus": "Single",
            "spouse": "",
            "occupationType": "Unemployed",
            "annualIncome": "",
            "dob": "1996-04-15"
        }
        let res = await supertest(app).post("/api/person/create").send(requestBody)
        expect(res.statusCode).toBe(200)
    })

    it('creates a person with spouse [/api/person/create]', async() => {
        let requestBody = {
            "name": "Titus Lim",
            "gender": "Male",
            "maritalStatus": "Single",
            "spouse": "Jermaine Wong",
            "occupationType": "Unemployed",
            "annualIncome": 100.00,
            "dob": "1996-04-15"
        }
        let res = await supertest(app).post("/api/person/create").send(requestBody)
        expect(res.statusCode).toBe(200)
    })

    it('creates a person [/api/person/create]', async() => {
        let requestBody = {
            "name": "Michael Lim",
            "gender": "Male",
            "maritalStatus": "Single",
            "spouse": "",
            "occupationType": "Unemployed",
            "annualIncome": "",
            "dob": "1996-04-15"
        }
        let res = await supertest(app).post("/api/person/create").send(requestBody)
        expect(res.statusCode).toBe(500)
        expect(res.body).toStrictEqual({"message": `${requestBody.name} already registered`})
    })

})