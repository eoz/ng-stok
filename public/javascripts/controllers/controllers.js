var app = angular.module('eopmStok', ['ngRoute', 'eopmStok.directives', 'eopmStok.services', 'eopmStok.filters', 'angularFileUpload', 'ui.bootstrap', 'ngCookies']);

app.run(["$rootScope", "$window", '$location', 'AuthenticationService', 'CookieService', 'UserService', function ($rootScope, $window, $location, AuthenticationService, CookieService, UserService) {

    $rootScope.$on('$routeChangeSuccess', function () {
        $window.scrollTo(0, 0);
    })

    $rootScope.$on('$routeChangeStart', function( event, nextRoute, currentRoute ){

        var id;
//        console.log('1');
//
//            if( nextRoute.access )
//            {
//                console.log('2');
//                if( nextRoute.access.requiredLogin && !AuthenticationService.isLogged )
//                {
//                    console.log('3');
//
//                        if( !$window.sessionStorage.token )
//                        {
//                            console.log('4');
//                            if( id = CookieService.getCookie('_klnc') )
//                            {
//                                console.log('5');
//                                UserService.cookieLogin( id ).$promise.then(function( data ){
//
//                                    console.log('hulooooo : ' + JSON.stringify( data ));
//
//                                    AuthenticationService.isLogged = true;
//                                    AuthenticationService.isAdmin = data.user.rol == 'admin';
//                                    AuthenticationService.name = data.user.isim;
//
//                                    $window.sessionStorage.token = data.token;
////                                   // console.log('asdadsa token : ' + data.token);
////                                    console.log('asdadsa token : ' + JSON.stringify(data));
//
//                                }, function( err ){
//                                    console.log('6');
//                                    console.log('cookieservice error : ' + err);
//                                })
//                            }
//                            else
//                            {
//                                console.log('7');
//                                $location.path('/login');
//                            }
//
//                        }
//                         else // token yoksa
//                        {
//                            $location.path('/login');
//                        }
//
//
//
//
//                }
//                else
//                {
//                    $location.path('/login');
//                }
//            }



    })
}]);

app.config(function($httpProvider){
    $httpProvider.interceptors.push('TokenInterceptor');
})

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/products.html',
            controller: 'ProductController',
            resolve: {
                productList: ['MultiProductLoader', function (MultiProductLoader) {
                    return MultiProductLoader();
                }]
            },
            access : { requiredLogin : true }
        })
        .when('/products', {
            redirectTo: '/',
            access : { requiredLogin : true }
        })
        .when('/addproduct', {
            templateUrl: '/views/addproduct.html',
            controller: 'AddProductController',
            access : { requiredLogin : true }
        })
        .when('/product/:productid', {
            templateUrl: '/views/productdetail.html',
            controller: 'ProductDetailController',
            resolve: {
//                oneproduct : ['OneProductLoader', function(OneProductLoader){
//                    return OneProductLoader();
//                }],
                komponentList: ['MultiKomponentLoader', function (MultiKomponentLoader) {
                    return MultiKomponentLoader();
                }]

            },
            access : { requiredLogin : true }
        })
        .when('/components', {
            templateUrl: '/views/components.html',
            controller: 'KomponentController',
            resolve: {
                komponentList: ['MultiKomponentLoader', function (MultiKomponentLoader) {
                    return MultiKomponentLoader();
                }]
            },
            access : { requiredLogin : true }
        })
        .when('/component/:componentid', {
            templateUrl: '/views/componentdetail.html',
            controller: 'ComponentDetailController',
            resolve: {
                komp: ['OneKomponentLoader', function (OneKomponentLoader) {
                    return OneKomponentLoader();
                }]
            },
            access : { requiredLogin : true }
        })
        .when('/addcomponent', {
            templateUrl: '/views/addcomponent.html',
            controller: 'AddComponentController',
            access : { requiredLogin : true }
        })
        .when('/users', {
            templateUrl: '/views/users.html',
            controller : 'UserDetailController',
            resolve: {
                userdetail: ['UserDetailLoader', function (UserDetailLoader) {
                    return UserDetailLoader();
                }]
            },
            access : { requiredLogin : true }
        })
        .when('/login', {
            templateUrl : '/views/login.html',
            controller : 'UserController',
            access : { requiredLogin : false }
        })
        .when('/signup',{
            templateUrl : '/views/signup.html',
            controller : 'SignUpController',
            access : { requiredLogin : false }
        })
        .when('/signupafter', {
            templateUrl : '/views/signupafter.html',
            access : { requiredLogin : false }
        })
        .otherwise({
            templateUrl: '/views/error.html',
            access : { requiredLogin : false }
        })
}])

app.controller('AddComponentController', ['$scope', '$location', 'Komponent', '$upload', 'modalService', function ($scope, $location, Komponent, $upload, modalService) {
    $scope.komponent = new Komponent();

    $scope.onFileSelect = function ($files) {
        $scope.komponent.resim = $files[0];
    };

    $scope.saveKomponent = function () {

        $scope.upload = $upload.upload({
            url: '/component',
            data: {
                name: $scope.komponent.name,
                aciklama: $scope.komponent.aciklama,
                firma: $scope.komponent.firma,
                firmaYetkili: $scope.komponent.firmaYetkili,
                firmaYetkiliIletisim : $scope.komponent.firmaYetkiliIletisim,
                stokAdet: $scope.komponent.stokAdet,
                fiyat: $scope.komponent.fiyat,
                ureticiKodu: $scope.komponent.ureticiKodu
            },
            file: $scope.komponent.resim
        })
            .progress(function (evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totals));
            }).success(function (data, status, headers, config) {
                console.log('data : ' + JSON.stringify(data));
                if (data.hata) {
                    console.log('komponent hata : ' + JSON.stringify(data.hata));
                    var modelHata = modalService.showModal('Hata', 'Komponent kaydetme başasısız - ' + data.hata.code);
                    return;
                }

                var modalefe = modalService.showModal('Komponent', 'Komponent başarıyla kaydedildi');
                modalefe.result.then(function () {
                    console.log('modal kapanmadı');
                }, function () {
                    console.log('modal kapandı');
                    $location.path('/components');
                });
            })

    }


}])

app.controller('AddProductController', ['$scope', '$location', 'Product', '$upload', 'modalService', function ($scope, $location, Product, $upload, modalService) {
    $scope.product = new Product();

    $scope.onFileSelect = function ($files) {
        $scope.product.resim = $files[0];
    };

    $scope.saveProduct = function () {

        $scope.upload = $upload.upload({
            url: '/product',
            data: { name: $scope.product.name, aciklama: $scope.product.aciklama },
            file: $scope.product.resim
        })
            .progress(function (evt) {
                //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totals));
            }).success(function (data, status, headers, config) {
                console.log('data : ' + JSON.stringify(data));
                if (data.hata) {
                    var modelHata = modalService.showModal('Hata', 'Ürün kaydetme başasısız - ' + data.hata.code);
                    return;
                }

                var modalefe = modalService.showModal('Ürün', 'Ürün başarıyla kaydedildi');
                modalefe.result.then(function () {
                    console.log('modal kapanmadı');
                }, function () {
                    console.log('modal kapandı');
                    $location.path('/');
                });
            })

    }
}])

app.controller('ProductDetailController', ['$scope', 'Product', '$routeParams', '$location', 'ProductDetailComponentLoader', 'komponentList', '$modal', '$timeout', 'Order', function ($scope, Product, $routeParams, $location, ProductDetailComponentLoader, komponentList, $modal, $timeout, Order) {

    $scope.isSaving = false;

    ProductDetailComponentLoader.getComponents().then(function (product) {
        $scope.product = product;
    });

    $scope.Komponents = komponentList;

    $scope.duzenle = function (product) {

        var refreshProduct = function () {
            ProductDetailComponentLoader.getComponents().then(function (product) {
                //console.log("server product: " + JSON.stringify(product));
                $scope.product = product;
            });
        };

        var editProduct = {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title"> Ürün Düzenle </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<form role="form">' +
                '<div class="form-group">' +
                '<label for="prName">Ürün İsmi</label>' +
                '<input type="text" class="form-control" id="prName" ng-model="product.isim" />' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="prDesc">Ürün Açıklama</label>' +
                '<textarea rows="5" class="form-control" id="prDesc" ng-model="product.aciklama" />' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-primary" ng-click="editProduct()">Düzenle</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">Kapat</button>' +
                '</div>',
            size: 'sm',
            controller: function ($scope, $modalInstance, Product) {
                $scope.product = product;

                var saveProduct = function () {
                    $scope.product.$save()
                }

                var originalProduct = angular.copy(product);

                $scope.editProduct = function () {

                    $scope.product.$save().then(function (savedProduct) {
                        $scope.product = savedProduct;
                        $modalInstance.close();
                    }, function () {
                        $scope.product = originalProduct;
                        $modalInstance.close();
                    })
                }

                $modalInstance.result.then(function () {

                }, function () {
                    angular.copy(originalProduct, $scope.product);
                })

                $scope.closeModal = function () {
                    angular.copy(originalProduct, $scope.product);
                    $modalInstance.close();
                }
            }
        }

        return efe = $modal.open(editProduct);

    }

    $scope.takeOrder = function () {

            $scope.isSaving = true;

        $scope.product.$save({ siparissayi: $scope.siparissayi }).then(function (data) {

            $scope.siparissayi = 0;
            $scope.isSaving = false;
            $scope.product = data;
            $scope.showOrder( $scope.product.orders[$scope.product.orders.length - 1], true );
        })
    }

    $scope.showOrder = function (order, showFooterButtons) {

        var product = $scope.product;

        var showOrderDetail = {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title"> Sipariş Detayları </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<h3>Sipariş Miktarı <span class="label label-success">{{ orders.siparisMiktari }}</span></h3>' +
                ' <div class="table-responsive">' +
                '<table class="table table-hover">' +
                '<thead><tr><th></th><th>Mevcut Stok</th><th>Toplam İhtiyaç</th><th>Depo Stok</th><th>Mevcut İhtiyaç</th><th>Durum</th><th>Sipariş Ver</th><th>Genel İhtiyaç</th><th>Fiyat</th></tr></thead>' +
                '<tbody ng-repeat="orderdetails in orders.orderDetails">' +
                '<tr ng-class="{ success : orderdetails.durum == \'depoda mevcut\', danger : orderdetails.durum == \'siparis verilmedi\', info : orderdetails.durum == \'siparis verildi\' }">' +
                '<td style="text-align: center"><h4><span class="label label-primary">{{ orderdetails.component.isim }}</span></h3></td>' +
                '<td>{{ orderdetails.component.stokAdet }}</td>' +
                '<td>{{ orderdetails.toplamIhtiyac }}</td>' +
                '<td>{{ orderdetails.depoStok }}</td>' +
                '<td>{{ orderdetails.mevcutIhtiyac }}</td>' +
                '<td>{{ orderdetails.durum }}</td>' +

                '<td>' +
                '<form name="FrmSiparisVer">' +
                '<div class="input-group input-group-sm"><span class="input-group-btn">' +
                '<button ng-disabled="orderdetails.durum != \'siparis verilmedi\'" class="btn btn-success" type="button" ng-disabled="FrmSiparisVer.$invalid" ng-click="siparisVer(orderdetails)">Sipariş Ver  <span class="glyphicon glyphicon-new-window"></span></button>' +
                '</span>' +
                '<input type="number" min="{{ genelIhtiyac(orderdetails) }}" ng-disabled="orderdetails.durum != \'siparis verilmedi\'" name="siparisVerilecekAdet" id="siparisVerilecekAdet" ng-model="orderdetails.numToOrder" required style="width: 75%">' +
                '</div>' +
                '</form>' +
                '</td>' +
                '<td>{{ genelIhtiyac(orderdetails) }}</td>' +
                //'<td>{{ orderdetails.component.componentPrices | json }}</td>' +
                '<td ng-repeat="cp in orderdetails.component.componentPrices | orderBy : \'fiyatTarihi\' : true | limitTo : 1">{{ cp.fiyat | currency : cp.paraBirimi }}</td>' +
                '</tr>' +

                '</tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '{{ orderdetails.siparisVerilecekAdet }}' +
                '<div class="modal-footer">' +
                '<button class="btn btn-danger pull-left" ng-click="cancelOrderProduct(orders)" ng-show="showFooterButtons">Siparişi İptal Et</button>' +
                '<button class="btn btn-primary" ng-disabled="isOrderDetailsComplete()" ng-click="completeOrderProduct()" ng-show="showFooterButtons">Siparişi Tamamla</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">Kapat</button>' +
                '</div>',
            size: 'lg',
            resolve: {
                orders: function () {
                    return Order.get({ id: order.id })
                }
            },
            controller: function ($scope, $modalInstance, orders, modalService) {

                $scope.showFooterButtons = showFooterButtons && true;

                $scope.orders = orders;

                $scope.product = product;

                $scope.isOrderDetailsComplete = function()
                {
                    var isComp = false;

                    angular.forEach( $scope.orders.orderDetails, function( orderdetails ){
                        if( orderdetails.durum == 'siparis verilmedi' )
                            return isComp = true;
                    } )

                    return isComp;
                }

                $scope.completeOrderProduct = function()
                {
                    $scope.product.$save({ completeOrderId : $scope.orders.id }).then(function(){
                        $modalInstance.close();
                    })
                }

                $scope.genelIhtiyac = function( orderdetail ){
                    var count = 0;
                    angular.forEach( orderdetail.component.orderDetails, function( orderdetails ){
                        count += orderdetails.mevcutIhtiyac;
                    } );
                    return count;
                }

                $scope.cancelOrderProduct = function( order ){

                    $scope.product.$delete( { cancelOrderId : order.id }).then(function(){
                        $modalInstance.close();
                        modalService.showModal('Sipariş İptali', 'Sipariş Başarıyla İptal Edildi');
                    })


                }

                $scope.siparisVer = function(orderdetails){

                    var dismissFirst = $modalInstance;

                    var orders = $scope.orders;

                    var product = $scope.product;

                    if( typeof orderdetails.numToOrder === 'undefined' || orderdetails.numToOrder == 0 )
                    {
                        alert('Geçerli bir Sayı Giriniz');
                        return;
                    }

                    var setParaBirimi =
                    {
                        template: '<div class="modal-header">' +
                            '<h4 class="modal-title"> Stoğa Ekle </h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<form role="form" name="myForm">' +
                            '<div class="form-group">' +
                            '<h1 style="text-align: center"><span class="label label-success">{{ abc.numToOrder }}</span></h1>' +
                            '</div>' +
                            '<hr />' +
                            '<div class="form-group">' +
                            '<div class="table-responsive">' +
                            '<table class="table">' +
                            '<thead><tr><th>Fiyat</th><th>Para Birimi</th></tr></thead>' +
                            '<tbody><tr><td style="vertical-align: middle"><input type="number" name="inputfiyat" ng-model="abc.fiyat" required></td><td style="vertical-align: middle">' +
                            '<select ng-model="abc.paraBirimi" ng-options="paraBirimi.name for paraBirimi in paraBirimleri">' +
                            '</select></td></tr></tbody>' +
                            '</table>' +
                            '</div>' +
                            '</div>' +
                            '</form>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button ng-disabled="!myForm.inputfiyat.$valid" class="btn btn-primary" ng-click="addToStok()">Ekle</button>' +
                            '<button type="button" class="btn btn-danger" ng-click="closeModal()">İptal</button>' +
                            '</div>',
                        size : 'sm',
                        controller : function( $scope, $modalInstance ){

                            $scope.order = orders;

                            $scope.product = product;

                            $scope.orderdetails = orderdetails;

                            $scope.abc = {};

                            $scope.paraBirimleri = [
                                { name : 'EURO', sembol : 'EURO' },
                                { name : 'DOLAR', sembol : 'DOLAR' },
                                { name : 'TL', sembol : 'TL' }
                            ]

                            $scope.abc.paraBirimi = $scope.paraBirimleri[0];

                            $scope.abc.numToOrder = orderdetails.numToOrder;

                            $scope.abc.orderDetailComponentId = orderdetails.ComponentId;

                            $scope.abc.orderDetailProductId = $scope.product.id;

                            $scope.addToStok = function(){
                                //$scope.order.$save( { orderDetailId : $scope.orderdetails.id, formDetails : $scope.abc } );
                                $scope.product.$save( { formDetails : $scope.abc }).then(function( data ){
                                    $scope.product = data;
                                    $scope.closeModal();
                                    dismissFirst.dismiss();
                                })

                            }

                            $scope.closeModal = function(){
                                $modalInstance.dismiss();
                            }

                            $modalInstance.result.then(function(){
                                //console.log('modal is closed');
                                var modalefe = modalService.showModal('Stok Ekleme', $scope.abc.addcomponentstok + ' ürün stoğa eklendi');
                            }, function(){
                                //console.log('modal is dismissed');
                            })


                        }

                    }
                    return efe = $modal.open( setParaBirimi );

                }

                $scope.closeModal = function(){
                    $modalInstance.dismiss();
                }
            }
        }

        //return efe = $modal.open(showOrderDetail);
        $modal.open(showOrderDetail)

    }

    $scope.alert = function (komponent) {

        var product = $scope.product;

        var modalInstance = {
            template: '<div class="modal-header">' +
                '<form name="FrmAddKomponent">'+
                '<h4 class="modal-title">Komponent Ekle</h4>' +
                '<div class="modal-body">' +
                '<div style="text-align: center; color: #555555; font-size: 20px"> {{ komponent.isim | uppercase}}</div>' +
                '<hr/>' +
                '<div class="row">' +
                '<div class="col-md-6">' +
                '<img class="img-responsive" ng-src="../images/komponents/{{komponent.resim}}" title="{{komponent.isim}}" alt="{{komponent.isim}}"/>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<h4>Adet</h4>' +
                //'<input type="number" ng-model="komponent.komadet" style="width: 100%" />' +
                '<input type="number" min="1" name="komponentAdet" id="komponentAdet" ng-model="komponent.productComponent.adet" style="width: 100%" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-success" ng-disabled="FrmAddKomponent.$invalid" ng-click="addkom()">Ekle</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">Kapat</button>' +
                '</form>' +
                '</div>',
            size: 'sm',
            controller: function ($scope, $modalInstance, $rootScope, Product) {

                $scope.product = product;
                $scope.komponent = komponent;
                $scope.product.komponentToAdd = {};

                $scope.addkom = function () {
                    $scope.product.komponentToAdd = komponent;
                    if( ! $scope.product.komponentToAdd.productComponent  )
                    {
                        alert('adet giriniz');
                        return;
                    }

                    $scope.product.$addKomponents().then(function (data) {
                        console.log(JSON.stringify(data));
                        //refreshProduct();
                        $scope.product = data;
                        $modalInstance.close();
                    });
                };
                $scope.closeModal = function () {
                    $modalInstance.dismiss('cancel');
                }
            }

        }
        return $modal.open(modalInstance);
    }


    $('.selected-items-box').bind('click', function (e) {
        e.stopPropagation();
        $('.multiple-select-wrapper .list').toggle('slideDown');
    });

    $('.multiple-select-wrapper .list').bind('click', function (e) {
        e.stopPropagation();
    });

    $(document).bind('click', function (e) {
        $('.multiple-select-wrapper .list').slideUp();
        /*

         $scope.product.komponentsToAdd = [];


         $scope.$watch("Komponents", function(  ){

         })
         //console.log( JSON.stringify($scope.Komponents) );
         $scope.Komponents.forEach(function( komponent ){
         if( komponent.selected == true ){
         console.log(komponent);
         $scope.product.komponentsToAdd.push( komponent );

         }

         })
         $scope.product.$addKomponents();
         $scope.$apply( function(){
         $scope.product = Product.get( { id : 9 } );
         } )

         */
    });


    $scope.getSelectedItemsOnly = function (item) {
        return item.selected;
    };
}]);

app.controller('ProductController', ['$scope', 'productList', function ($scope, productList) {
    $scope.productList = productList;

    //console.log(typeof  productList[0].resimPath);
}])

app.controller('KomponentController', ['$scope', 'komponentList', function ($scope, komponentList) {
    $scope.komponentList = komponentList;
    //console.log(typeof  productList[0].resimPath);

    //$scope.matrix = ['efe','feryal','tolga','isa','ismail','ibrahim','gül','gülberk','osman', 'elif', 'erman', 'ipek', 'serkan', 'pınar'];

}])

app.controller('ComponentDetailController', ['$scope', 'komp', 'modalService', '$location', '$modal', '$upload', '$timeout', function ($scope, komp, modalService, $location, $modal, $upload, $timeout) {
    $scope.komponent = komp;

    $scope.mevcutIhtiyac = function(){
          var count = 0;
        angular.forEach( $scope.komponent.orderDetails, function( orderdetails ){
            count += orderdetails.mevcutIhtiyac;
        } );
        return count;
    }

    $scope.goToProductPage = function (product) {
        $location.path('product/' + product.id);
    }

    $scope.subtractComponent = function( komponent, subtractkomponent ) {

        var setAciklama = {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title"> Açıklama Ekle </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<form role="form" name="myForm">' +
                '<div class="form-group">' +
                '<div style="text-align: center">Çıkarılacak Adet:</div><h1 style="text-align: center"><span class="label label-success">{{ abc.subtractkomponent }}</span></h1>' +
                '</div>' +
                '<hr />' +
                '<div class="form-group">' +
                '<div class="table-responsive">' +
                '<table class="table">' +
                '<thead><tr><th>Açıklama</th></tr></thead>' +
                '<tbody><tr><td style="vertical-align: middle"><textarea cols="37" rows="5" name="inputaciklama" ng-model="abc.aciklama" required></textarea></td></tr></tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button ng-disabled="!myForm.inputaciklama.$valid" class="btn btn-primary" ng-click="subtractFromStok()">Çıkar</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">İptal</button>' +
                '</div>',
            size : 'sm',
            controller : function( $scope, $modalInstance ) {

                $scope.abc = {};

                $scope.abc.subtractkomponent = subtractkomponent;
                $scope.komponent = komponent;

                $scope.subtractFromStok = function(){
                    $scope.komponent.$save({ subtractStokFormDetail : $scope.abc }).then(function( data ){
                        $modalInstance.close();
                        console.log('decrement data : ' + JSON.stringify( data ));
                    })
                }

                $scope.closeModal = function(){
                    $modalInstance.dismiss();
                }

                $modalInstance.result.then(function(){
                    //console.log('modal is closed');
                    var modalefe = modalService.showModal('Stok Çıkarma' , $scope.abc.subtractkomponent + ' ürün stoktan düşüldü');
                }, function(){
                    //console.log('modal is dismissed');
                })
            }

        }
        return efe = $modal.open( setAciklama );
    }

    $scope.addComponent = function(komponent, addcomponentstok){
        var setParaBirimi =
        {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title"> Stoğa Ekle </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<form role="form" name="myForm">' +
                '<div class="form-group">' +
                '<h1 style="text-align: center"><span class="label label-success">{{ abc.addcomponentstok }}</span></h1>' +
                '</div>' +
                '<hr />' +
                '<div class="form-group">' +
                '<div class="table-responsive">' +
                '<table class="table">' +
                '<thead><tr><th>Fiyat</th><th>Para Birimi</th></tr></thead>' +
                '<tbody><tr><td style="vertical-align: middle"><input type="number" name="inputfiyat" ng-model="abc.fiyat" required></td><td style="vertical-align: middle">' +
                '<select ng-model="abc.paraBirimi" ng-options="paraBirimi.name for paraBirimi in paraBirimleri">' +
                '</select></td></tr></tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button ng-disabled="!myForm.inputfiyat.$valid" class="btn btn-primary" ng-click="addToStok()">Ekle</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">İptal</button>' +
                '</div>',
            size : 'sm',
            controller : function( $scope, $modalInstance ){

                $scope.abc = {};

                $scope.paraBirimleri = [
                    { name : 'EURO', sembol : 'EURO' },
                    { name : 'DOLAR', sembol : 'DOLAR' },
                    { name : 'TL', sembol : 'TL' }
                ]



                $scope.abc.paraBirimi = $scope.paraBirimleri[0];

                $scope.komponent = komponent;
                $scope.abc.addcomponentstok = addcomponentstok;

                $scope.addToStok = function(){
                    $scope.komponent.$save({ addStokformDetail : $scope.abc }).then(function( data ){
                        $modalInstance.close();
                    })
                }

                $scope.closeModal = function(){
                    $modalInstance.dismiss();
                }

                $modalInstance.result.then(function(){
                    //console.log('modal is closed');
                    var modalefe = modalService.showModal('Stok Ekleme', $scope.abc.addcomponentstok + ' ürün stoğa eklendi');
                }, function(){
                    //console.log('modal is dismissed');
                })


            }

        }
        return efe = $modal.open( setParaBirimi );

    }

    $scope.duzenle = function (komponent) {

        var editKomponent = {
            template: '<div class="modal-header">' +
                '<h4 class="modal-title"> Komponent Düzenle </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<form role="form">' +
                '<div class="form-group">' +
                '<label for="komName">Komponent İsmi</label>' +
                '<input type="text" class="form-control" id="komName" ng-model="komponent.isim" />' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="komDesc">Ürün Açıklama</label>' +
                '<textarea rows="5" class="form-control" id="komDesc" ng-model="komponent.aciklama" />' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="komResim">Resim</label>' +
                '<input type="file" name="komResim" id="komResim" eovalid-file required ng-file-select="onFileSelect($files)" ng-model="komponent.yeniresim">' +
                '</div>' +
                '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn btn-primary" ng-click="saveKomWithFile()">Düzenle</button>' +
                '<button type="button" class="btn btn-danger" ng-click="closeModal()">Kapat</button>' +
                '</div>',
            size: 'sm',
            controller: function ($scope, $modalInstance) {
                $scope.komponent = komponent;

                $scope.onFileSelect = function ($files) {
                    $scope.komponent.yeniresim = $files[0];
                };

                var originalKomponent = angular.copy(komponent);

                $scope.saveKomWithFile = function () {

                    $scope.upload = $upload.upload({
                        url: '/component/' + $scope.komponent.id,
                        data: { isim: $scope.komponent.isim, aciklama: $scope.komponent.aciklama },
                        file: $scope.komponent.yeniresim
                    })
                        .progress(function (evt) {
                            //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.totals));
                        }).success(function (data, status, headers, config) {

                            console.log('data : ' + JSON.stringify(data));
                            if (data.hata) {
                                if (data.component) {
                                    $scope.komponent.isim = data.isim;
                                    $scope.komponent.aciklama = data.aciklama;
                                    //$scope.komponent.resim = data.resim;
                                }
                                var modelHata = modalService.showModal('Hata', data.hata);
                                return;
                            }

                            var modalefe = modalService.showModal('Ürün', 'Ürün başarıyla güncellendi');

                            modalefe.result.then(function () {
                                console.log('modal kapanmadı');
                            }, function () {
                                $scope.komponent.isim = data.isim;
                                $scope.komponent.aciklama = data.aciklama;
                                $scope.komponent.resim = data.resim;
                                $modalInstance.close();
                                console.log('modal kapandı');
                            });


                        })

                }

                $modalInstance.result.then(function () {

                }, function () {
                    angular.copy(originalKomponent, $scope.komponent);
                })

                $scope.closeModal = function () {
                    angular.copy(originalKomponent, $scope.komponent);
                    $modalInstance.close();
                }

            }
        }


        return efe = $modal.open(editKomponent);

    }

}]);


app.controller('UserController', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'CookieService', '$cookieStore', '$timeout', function($scope, $location, $window, UserService, AuthenticationService, CookieService, $cookieStore, $timeout){

    $scope.AuthService = AuthenticationService;

    $scope.alerts = [ ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.login = function login(usermail, password){

        if( usermail !== undefined && password !== undefined )
        {
            UserService.login( usermail, password).$promise.then(function( data ){
                console.log('data : ' + JSON.stringify(data));

                AuthenticationService.isLogged = true;
                AuthenticationService.isAdmin = data.user.rol == 'admin';
                AuthenticationService.name = data.user.isim;

                $window.sessionStorage.token = data.token;

                CookieService.setCookie( '_klnc' , JSON.stringify( data.user.id ) );


                $location.path('/');
            }, function(err){
                console.log(err);
                $scope.alerts.push({ type : 'danger', msg : 'hatalı e-mail / parola' });

                $timeout(function() {
                    $scope.alerts = [];
                }, 3000);
            })
        }

    }

    $scope.logout = function logout()
    {
//        UserService.logout();
        if( AuthenticationService.isLogged )
        {
            AuthenticationService.isLogged = false;
//            AuthenticationService.isAdmin = false;
//            AuthenticationService.name =
            AuthenticationService.setNull();
        }

        delete $window.sessionStorage.token;
        CookieService.deleteCookie('_klnc');
        $location.path('/login');
    }

}]);

app.controller('UserDetailController', ['$scope', 'userdetail', 'AuthenticationService', 'User', function($scope, userdetail, AuthenticationService, User){

    $scope.userdetail = userdetail;
    $scope.AuthenticationService = AuthenticationService;

    console.log('Auth Service : ' + JSON.stringify(AuthenticationService));

    $scope.approveUser = function( user )
    {
        User.query({},{'id' : user.id}).$promise.then(function( data ){
            console.log( JSON.stringify( data ) );
            $scope.userdetail = data;
        })

    }

}])

app.controller('SignUpController', ['$scope', 'UserService', '$location', function( $scope, UserService, $location ){

    $scope.signUpForm = {};

    $scope.signUp = function()
    {
        UserService.signin($scope.signUpForm).$promise.then(function(data){
            //console.log('sign in data : ' + JSON.stringify( data ));
            $location.path('/signupafter');
        }, function(err){
            console.log('err : ' + err);
            //$location.path('/error');
        })
    }

}])

app.controller('ActiveLinkController', ['$scope', '$location', 'AuthenticationService', function ($scope, $location) {

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    }

}])