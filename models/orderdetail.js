module.exports = function( sequelize, DataTypes )
{
    var OrderDetail = sequelize.define('OrderDetail', {

        toplamIhtiyac : { type : DataTypes.INTEGER },
        depoStok : { type : DataTypes.INTEGER },
        mevcutIhtiyac : { type : DataTypes.INTEGER },
        siparisVerilecekAdet : { type : DataTypes.INTEGER },
        //durum : { type : DataTypes.STRING }
        durum : { type : DataTypes.ENUM, values : ['siparis verilmedi', 'siparis verildi', 'depoda mevcut'] }

    }, {
        hooks : {
          beforeCreate : function(od, fn){
              if( od.siparisVerilecekAdet > 0 )
                od.durum = 'siparis verildi';
              else if( od.mevcutIhtiyac > 0 )
                od.durum = 'siparis verilmedi';
              else
                od.durum = 'depoda mevcut';

              fn( null, od );
          },
            beforeUpdate : function( od, fn ){
                if( od.siparisVerilecekAdet > 0 )
                    od.durum = 'siparis verildi';
                fn( null, od );
            }
        },

        classMethods : {
            associate : function( models ){
                OrderDetail.belongsTo(models.Component),
                OrderDetail.belongsTo( models.Order ),
                OrderDetail.hasMany(models.OrderHistory)
            }
        }
    })

    return OrderDetail
}