var utils = require('../utils/utils');

module.exports = function( sequelize, DataTypes )
{
    var User = sequelize.define('User', {
        isim : { type : DataTypes.STRING },
        sifre : { type : DataTypes.STRING },
        email : { type : DataTypes.STRING, unique : true },
        resim : { type : DataTypes.STRING, unique : true },
        rol : {
            type : DataTypes.ENUM,
            values : ['superadmin', 'admin', 'user']
        },
        firmaPozisyon : DataTypes.STRING,
        lastLogin : DataTypes.DATE,
        isApproved : { type: DataTypes.BOOLEAN, defaultValue : false }
    }, {
            classMethods : {

            },
            instanceMethods : {
                comparePassword : utils.BcryptComparePassword,
                setPassword : function(){
                    this.sifre = utils.generateHash(this.sifre);
                    return this;
                },
                getName : function(){
                    return this.isim;
                },
                getEmail : function(){
                    return this.email;
                },
                getPassword : function(){
                    return this.sifre;
                }

            }
        }


    )

    return User
}