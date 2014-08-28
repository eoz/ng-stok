'use strict';

var filters = angular.module('eopmStok.filters', []);

filters.filter('eopartition', function() {
    var cache = {};
    var filter = function(arr, size) {
        if (!arr) { return; }
        var newArr = [];
        for (var i=0; i<arr.length; i+=size) {
            newArr.push(arr.slice(i, i+size));
        }
        var arrString = JSON.stringify(arr);
        //console.log('arrString : ' + arrString);
        var fromCache = cache[arrString+size];
        //console.log('fromCache : ' + JSON.stringify(fromCache));
        if (JSON.stringify(fromCache) === JSON.stringify(newArr)) {
            return fromCache;
        }
        cache[arrString+size] = newArr;
        return newArr;
    };
    return filter;
});

filters.filter('eotruncate', function(){
    return  function( text, length, end ){
        if( isNaN(length) )
            length = 120;
        if( end === undefined )
            end = '...';
        if( text.length <= length || text.length - end.length <= length)
            return text;
        else
            return String(text).substring( 0, length - end.length ) + end;
    }
})

