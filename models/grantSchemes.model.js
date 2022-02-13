module.exports = (sequelize, Sequelize) => {
    const grantSchemes = ('grantSchemes', {
        type : Sequelize.STRING,
        allowNull : false,
    })
    return grantSchemes 
}