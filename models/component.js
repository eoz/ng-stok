var Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    var Component = sequelize.define('Component', {
        isim: { type: DataTypes.STRING, unique: true },
        aciklama: DataTypes.STRING,
        resim: { type: DataTypes.STRING, unique: true },
        firma: DataTypes.STRING,
        firmaYetkilisi: DataTypes.STRING,
        firmaYetkilisiIletisim : DataTypes.STRING,
        stokAdet: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true,
                neverZero : function( value ){
                    if( value < 0 )
                        this.stokAdet = 0;
                }
            }
        },
        //fiyat: DataTypes.DECIMAL(10, 2),
        ureticiKodu: DataTypes.STRING
    }, {

        hooks : {
            afterUpdate : function( od, fn ){
                console.log(JSON.stringify(od));
                if( od.stokAdet < 0 )
                    od.stokAdet = 0 ;
                fn( null, od );
            }

        },

        classMethods: {
            associate: function (models) {
                Component.hasMany(models.Product, {through: models.ProductComponents}),
                Component.hasMany(models.ComponentPrice),
                Component.hasMany(models.OrderDetail),
                Component.hasMany(models.OrderHistory)
            },
            //tum componentlarin stokadetini set eder
            setStokAdet : function(yeniStokAdet, callback){
                Component.findAll().success(function(components){
                    var chainer = new Sequelize.Utils.QueryChainer;

                    components.forEach(function(component){
                        chainer.add(component.updateAttributes({stokAdet : yeniStokAdet}))
                    })
                    chainer.run().success(function(){
                        callback && callback()
                    })
                })
            }

        }
    })

    return Component
}