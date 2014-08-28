module.exports = function (sequelize, DataTypes) {
    var ComponentPrice = sequelize.define('ComponentPrice', {

            fiyatTarihi: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            fiyat: DataTypes.DECIMAL(10, 2),
            paraBirimi: { type: DataTypes.ENUM, values: ['DOLAR', 'YTL', 'EURO'] }

        }, {
            classMethods: {
                associate: function (models) {
                    ComponentPrice.belongsTo(models.Component),
                    ComponentPrice.hasMany( models.OrderHistory );
                }
            }
        }


    )

    return ComponentPrice
}