module.exports = function (sequelize, DataTypes) {
    var OrderHistory = sequelize.define('OrderHistory', {

            aciklama : { type : DataTypes.STRING },
            once : { type : DataTypes.INTEGER },
            sonra : { type : DataTypes.INTEGER }

        }, {
            classMethods: {
                associate: function (models) {
                    OrderHistory.belongsTo(models.Component);
                    OrderHistory.belongsTo(models.OrderDetail);
                    OrderHistory.belongsTo(models.ComponentPrice);
                }
            }
        }


    )

    return OrderHistory
}