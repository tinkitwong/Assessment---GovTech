module.exports = (sequelize, Sequelize) => {
    const grantSchemes = ('grantSchemes', {
        Name : Sequelize.STRING,
        allowNull : false,
    })
    return grantSchemes 
}