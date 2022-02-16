module.exports = (sequelize, Sequelize) => {
    const household = sequelize.define('household', {
        housingType : {
            type : Sequelize.STRING,
            allowNull : false,
        }
    },
    {
        tableName: 'household',
    })
    return household
}