module.exports = (sequelize, Sequelize) => {
    const household = sequelize.define('household', {
        HousingType : {
            type : Sequelize.STRING,
            allowNull : false,
        }
    })
    return household
}