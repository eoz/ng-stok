module.exports = function( sequelize, DataTypes ){
    var Product = sequelize.define('Product', {
        isim : { type : DataTypes.STRING, unique : true },
        aciklama : DataTypes.STRING,
        resim : {
            type : DataTypes.STRING,
            unique : true,
            get : function(){
                return this.getDataValue('resim')? this.getDataValue('resim') : 'urunyok.jpg'
            }
        },
        isActive : { type : DataTypes.BOOLEAN, defaultValue : true }

    }, {
        classMethods : {
            associate : function( models ){
                Product.hasMany( models.Component, {through : models.ProductComponents} ),
                    Product.hasMany( models.Order )
            }
        }
    })

    return Product
}

