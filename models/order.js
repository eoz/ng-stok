module.exports = function (sequelize, DataTypes) {
    var Order = sequelize.define('Order', {
        siparisTarihi: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        siparisMiktari: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true
            }
        },
        isComplete : { type: DataTypes.BOOLEAN, defaultValue : false }
    }, {
        classMethods: {
            associate: function (models) {
                Order.hasMany(models.OrderDetail),
                    Order.belongsTo(models.Product)
            }
        }
    })

    return Order
}