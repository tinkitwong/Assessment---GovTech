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
        Name : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        Gender : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        MaritialStatus : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        Spouse : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        OccupationType : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        AnnualIncome : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        DOB : {
            type : Sequelize.DATEONLY
        }
    })
    return person
}