'use strict';

var directives = angular.module('eopmStok.directives', []);

directives.directive('eovalidFile',function(){
    return {
        require:'ngModel',
        link:function(scope,el,attrs,ngModel){
            //change event is fired when file is selected
            el.bind('change',function(){
                scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            })
        }
    }
})

directives.directive('eofocus', function(){
    return{
        link: function( scope, element, attrs ){
            element[0].autofocus="true";
        }
    };
});

directives.directive('eoimageHover', function(){
    return {
        link : function( scope, elem, attr ){
            elem.on('load', function(){
                console.log('width : ' + $(this).width());
                console.log('height : ' + $(this).height());
            })
            elem.bind('mouseover', function(){
                console.log('mouse entered');
            })
            elem.bind('mouseout', function(){
                console.log('mouse left');
            })
        }
    }
})

directives.directive('yukleniyor', ['$rootScope', function( $rootScope ){
    return{
        link: function(scope, element, attrs){
            element.addClass('hide');

            $rootScope.$on('$routeChangeStart', function(){
                element.removeClass('hide');
            });

            $rootScope.$on('$routeChangeSuccess', function(){
                element.addClass('hide');
            });
        }
    }
}]);

directives.directive('ensureUniqueEmail', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {
                $http({
                    method: 'POST',
                    url: '/users/useremailcheck',
                    data: {'field': attrs.ensureUniqueEmail}
                }).success(function(data, status, headers, cfg) {
                        c.$setValidity('unique', data.isUnique);
                    }).error(function(data, status, headers, cfg) {
                        c.$setValidity('unique', false);
                    });
            });
        }
    }
}]);