/**
Name
Gender
MaritalStatus
Spouse (either name of spouse or primary key)
OccupationType (Options: Unemployed, Student, Employed)
AnnualIncome
DOB
*/

module.exports = (sequelize, Sequelize) => {
    const person = sequelize.define('person', {
        name : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        gender : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        maritalStatus : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        spouse : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        occupationType : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        annualIncome : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        dob : {
            type : Sequelize.DATEONLY // YYYY-MM-DD
        }
    })
    return person
}