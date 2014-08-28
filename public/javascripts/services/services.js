'use strict';

var services = angular.module('eopmStok.services', ['ngResource']);

services.service('modalService',['$modal', function($modal){

    this.showModal = function(title, message, size){

        var modalInstance = {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title">' + title + '</h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<p>' + message + '</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-primary" ng-click="closeModal()">Kapat</button>' +
                '</div>',
            size: size? size : 'sm',
            controller : function( $scope, $modalInstance ){
                $scope.closeModal = function(){
                    $modalInstance.dismiss('cancel');
                }
            }
        }

        return $modal.open( modalInstance );
    }

}])

services.factory('Komponent', ['$resource', function( $resource ){
    return $resource('/component/:id', { id : '@id' });
}])

services.factory('Product', ['$resource', function( $resource ){
    return $resource('/product/:id',
        { id : '@id' },
        { addKomponents : { method : 'PUT' } }
    );
}])

services.factory('User', ['$resource', function( $resource ){
    return $resource('/user/:id', { id : '@id' }
        //{ approveUser : { method : 'POST', params : { isApprove : true } } }
    );
}])

services.factory('Order', ['$resource', function($resource){
    return $resource('/order/:id',{ id : '@id' });
}])

services.factory('MultiKomponentLoader', ['Komponent', '$q', function(Komponent, $q){
    return function(){
        var delay = $q.defer();
        Komponent.query(function( komponents ){
            delay.resolve(komponents);
        }, function(){
            delay.reject('Unable to fetch komponents');
        });
        return delay.promise;
    }
}]);

services.factory('MultiProductLoader', ['Product', '$q', function(Product, $q){
    return function(){
        var delay = $q.defer();
        Product.query(function( products ){
            delay.resolve(products);
        }, function(){
            delay.reject('Unable to fetch products');
        });
        return delay.promise;
    }
}]);

services.factory('UserDetailLoader', ['User', '$q', function( User, $q ){
    return function()
    {
        var delay = $q.defer();
        User.query( function( users ){
            delay.resolve(users);
        }, function(){
            delay.reject('Unable to fetch users');
        } );
        return delay.promise;
    }
}])

services.factory('ProductDetailComponentLoader', ['Product', '$q', '$route', function( Product, $q, $route ){
    var getComponents = function(){
        var delay = $q.defer();
        if( isNaN( $route.current.params.productid ) )
            delay.reject('Wrong parameters');

        /*
        setTimeout(function(){
            Product.get({ id :$route.current.params.productid }, function( product ){
                delay.resolve( product );
            }, function(){
                delay.reject('Unable to fetch products');
            });
        }, 1000);
        */

        Product.get({ id : $route.current.params.productid }, function( product ){
            delay.resolve( product );
        }, function(){
            delay.reject('Unable to fetch products');
        })

        return delay.promise;
    };

    return{
        getComponents: getComponents
    };
}]);

services.factory('OneKomponentLoader', ['Komponent','$q', '$route', function(Komponent, $q, $route){
    return function(){
        var delay = $q.defer();
        Komponent.get({ id : $route.current.params.componentid }, function(komponent){
            delay.resolve( komponent )
        }, function(){
            delay.reject('Unable to fetch komponent');
        })
        return delay.promise;
    };

}])

services.factory('KomponentLoader', ['Komponent', '$q', function( Komponent, $q ){
    return function(){
        var delay = $q.defer();
        Komponent.query(function(komponents){
            delay.resolve(komponents);
        }, function(){
            delay.reject('Unable to fetch komponents');
        })
        return delay.promise;
    }
}]);

services.factory('AuthenticationService', function(){
    var auth = {
        isLogged : false,
        isAdmin  : false,
        name     : '',
        setNull  : function(){
            this.isLogged = false;
            this.isAdmin = false;
            this.name = '';
        }
    }

    return auth;
})

services.factory('UserService', ['User', function(User){
    return {
        login : function( usermail, password ){
            return User.save({ usermail : usermail, password : password });
        },
        logout : function(){
            return User.query({ logout : true });
        },
        cookieLogin : function( uid ){
            return User.get({ userid : uid });
        },
        signin : function(signindetails){
            return User.save({ signindetails : signindetails } );
        }
    }
}])

services.factory('TokenInterceptor', function($q, $window, AuthenticationService){
    return {
        request : function(config)
        {
            config.header = config.headers || {};
            if( $window.sessionStorage.token )
            {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        response : function(response)
        {
            if( response.status === 401 || response.status === 403 )
            {
                console.log('401 yada 403 hatası');
                $location.path('/login');
            }
            return response || $q.when(response);
        }
    }
})

services.factory('CookieService', function($window, $cookieStore){

    var setCookie = function( cookieisim, cookievalue, cookiebitissaniye )
    {
            var simdi = new Date();
            var bitis =  ( typeof cookiebitissaniye === 'undefined' )? new Date( simdi.getTime() + ( 1 * 1000 * 60 * 60  ) ) : new Date( simdi.getTime() + ( cookiebitissaniye * 1000 * 60 * 60 ) );
            $window.document.cookie = cookieisim + '=' + cookievalue + '; expires=' + bitis.toUTCString();

    }

    var putCookie = function( key, value )
    {
        $cookieStore.put( key, value );
    }

    var getCookie = function( cookieisim )
    {
        return $cookieStore.get( cookieisim );
    }

    var deleteCookie = function( cookieisim )
    {
        if( $window.document.cookie )
        {
            $cookieStore.remove(cookieisim);
        }
    }

    return{
        setCookie : setCookie,
        putCookie : putCookie,
        getCookie : getCookie,
        deleteCookie : deleteCookie
    }
})

