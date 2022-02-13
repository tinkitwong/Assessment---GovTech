module.exports = (sequelize, Sequelize) => {
    const household = sequelize.define('household', {
        housingType : {
            type : Sequelize.STRING,
            allowNull : false,
        }
    })
    return household
}