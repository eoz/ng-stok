var path = require('path');

var productSaveImagePath = path.join(__dirname, '../public/images/products/');
var componentSaveImagePath = path.join(__dirname, '../public/images/komponents/');

function getcomponentSaveImagePath(){
    return componentSaveImagePath;
}

function getProductSaveImagePath(){
    return productSaveImagePath;
}



/*
var removeExtension = function ( fileName ){
    //if( typeof fileName !== 'string' || ! ( fileName instanceof String ) )

    if( typeof fileName !== 'string' )
    {
        return new Error("Type is not String");
    }

        //var nnn = fileName.replace(/\..+$/,'');
        //return nnn;
    return fileName.substr(0, fileName.lastIndexOf('.'));
}
*/


var removeExtension = function ( filename )
{
    if( typeof filename !== 'string' )
    {
        throw{
            name : 'TypeError',
            message : 'filename is not a string'
        }
    }

    return filename.replace(/\..+$/,'');
}

var getFileExtension = function ( filename )
{
    return filename.split('.').pop();
}

var getFileExtension2 = function ( filename )
{
    return filename.substr((Math.max(0, filename.lastIndexOf(".")) || Infinity) + 1);
}

var uniqueIdentifier =  function createUniqueIdentifier(){
    var now = new Date();
    var uniqueName = Math.floor(Math.random() * 100) + parseInt(now.getTime()).toString(36);
    return uniqueName;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var isEmpty = function(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

module.exports.productSaveImagePath = getProductSaveImagePath();
module.exports.componentSaveImagePath = getcomponentSaveImagePath();
module.exports.createUniqueName = uniqueIdentifier;
module.exports.removeExtension = removeExtension;
module.exports.fileExtension = getFileExtension;
module.exports.isEmpty = isEmpty;

