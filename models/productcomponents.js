module.exports = function( sequelize, DataTypes )
{
    var ProductComponents = sequelize.define('ProductComponents', {
        adet : DataTypes.INTEGER
    })
    return ProductComponents
}