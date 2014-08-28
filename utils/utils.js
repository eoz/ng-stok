var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var slugify = function(str) {
    var from  = "ąàáäâãåæćçęèéëêğıìíïîłńòóöôõøśşùúüûñçżź",
        to    = "aaaaaaaacceeeeegiiiiilnoooooossuuuunczz",
        regex = new RegExp('[' + from.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ']', 'g');

    if (str == null) return '';

    str = String(str).toLowerCase().replace(regex, function(c) {
        return to.charAt(from.indexOf(c)) || '-';
    });

    return str.replace(/[^\w\s-]/g, '').replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}

var eocp = function( candidatePassword, cb ){
    bcrypt.compare( candidatePassword, this.getDataValue('sifre'), function( err, isMatch ){
            if( err )
            {
                return cb( err );
            }
            cb( null, isMatch );
        }
    )
}

var generateBcryptPassword = function(){

}

var generateBcryptPasswordSync = function(stringToGenerate){
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(stringToGenerate, salt);
    return hash;
}

exports.slugify = slugify;
exports.BcryptComparePassword = eocp;
exports.generateHash = generateBcryptPasswordSync;