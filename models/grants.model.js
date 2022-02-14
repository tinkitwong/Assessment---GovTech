module.exports = (sequelize, Sequelize) => {
    const grants = sequelize.define('grants', {
        name : {
            type : Sequelize.STRING,
            allowNull : false,
        }
    })
    return grants
}