/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./models');
var productRoute = require('./routes/productRoute');
var komponentRoute = require('./routes/komponentRoute');
var orderRoute = require('./routes/orderRoute');
var userRoute = require('./routes/userRoute');
//var sequelize = require('./models').sequelize;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = require('./configuration/secret');

var Sequelize = require('sequelize');
var Promise = require('bluebird');

//var abc = require('./utils/sendmail');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('eopm-stok'));
app.use(express.bodyParser());
app.use(express.session());
app.use(express.multipart());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.all('*', function( req, res, next ){
    res.set('Access-Control-Allow-Origin', 'http://localhost');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

//app.get('/product', productRoute.index);
//app.get('/product', expressJwt({ secret : secret.secretToken }), productRoute.index);
//app.post('/product', expressJwt({ secret : secret.secretToken }), productRoute.saveProduct);
//app.post('/product/:id', expressJwt({ secret : secret.secretToken }), productRoute.editProduct)
//app.get('/product/:id', expressJwt({ secret : secret.secretToken }), productRoute. getProductById);
//app.put('/product/:id', expressJwt({ secret : secret.secretToken }), productRoute.addKomponents);

app.get('/product', productRoute.index);
app.post('/product', productRoute.saveProduct);
app.post('/product/:id', productRoute.editProduct)
app.get('/product/:id', productRoute. getProductById);
app.put('/product/:id', productRoute.addKomponents);
app.delete('/product/:id', productRoute.cancelProductOrder);

app.get('/component', komponentRoute.index);
app.get('/component/:componentid', komponentRoute.getKomponentById);
app.post('/component', komponentRoute.saveKomponent);
app.post('/component/:componentid', komponentRoute.editKomponent);


app.get( '/user', userRoute.index );
app.post( '/user', userRoute.login );
app.post('/users/useremailcheck', userRoute.checkUniqueEmail);
app.get('/user/:userid', userRoute.approveUser);

app.get('/order/:orderid', orderRoute.getOrderById);
//app.post('/order/:orderid', orderRoute.saveOrderDetailByOrderId);
app.delete('/order/:orderid', orderRoute.cancelOrderDetailByOrderId);

db
    .sequelize
    .sync({ force: false })
    .complete(function (err) {
        if (err) {
            throw err[0]
        }
        else {

//            db.Component.setStokAdet(20);

//              db.User.build({ isim : 'admin', email : 'eomedikal@gmail.com', sifre : 'ertmeds0', rol : 'admin', firmaPozisyon : 'ar/ge yazılım', isApproved : true }).setPassword().save();

            /*
             db.Product.find( 9 ).success(function( product ){
             if( product )
             {
             db.Component.findAll( { where : { id : [ 10, 11, 12 ] } } ).success(function(components){
             //console.log('component id : ' + components);

             //product.addComponent( component, { adet : 6 }).success(function(){
             //    console.log('added');
             //})


             components[0].ProductComponents = {
             adet : 34
             }

             product.setComponents( components ).success( function(){
             console.log( 'associatons yapildi..' );
             } )

             })
             }
             else
             {
             console.log('product not found');

             }
             });

             */

            /*
             db.Product.findAll({include : [db.Component], where : { id : 9 } }).success(function(products){
             console.log(JSON.stringify(products[0].components[0].productComponent.adet));
             })
             */

            /*
             db.Component.find(10).success(function( component ){
             db.ComponentPrice.create({
             fiyat : 11.68
             }).success(function( cp ){
             component.addComponentPrice(cp).success(function(){
             console.log('added');
             })
             })
             })
             */

            /*
             db.ComponentPrice.max('fiyat').success(function( max ){
             console.log(JSON.stringify( 'max: ' + max ));
             })
             */


            /*
             db.Component.find(9).success(function( components ){
             components.getComponentPrices({ where : { fiyat : { gt : 8 } } }).success(function(compr){
             console.log(JSON.stringify( compr ));
             })
             })
             */

            /*
             db.Component.find({where : { id : 9 }, include : [{ model : db.ComponentPrice, where : { fiyat : { gt : 8 } }, limit : 1 }]}).success(function( components ){
             console.log(JSON.stringify( components ));
             })
             */

             /*
             db.ComponentPrice.findAll({ where : { ComponentId : 1 }, order : [['fiyatTarihi', 'DESC']], limit : 1  }).success(function(cb){
             console.log(JSON.stringify(cb));
             })
             */


            /*
             db.Component.find(1).success(function( component ){
             db.ComponentPrice.create({
             fiyat : 11.68
             }).success(function( cp ){
             component.addComponentPrice(cp).success(function(){
             console.log('added');
             })
             })
             })
             */


            /*
             db.Product.find(1).success(function(product){
             db.Order.create({
             siparisMiktari : 12
             }).success(function(order){
             product.addOrder(order);
             db.OrderDetail.create({
             toplamIhtiyac : 200,
             depoStok : 125,
             mevcutIhtiyac : 75,
             siparisVerilecekAdet : 75,
             durum : 'siparis verilmedi'
             }).success(function(orderdetail){
             order.addOrderDetail( orderdetail );
             db.Component.find(1).success(function(component){
             orderdetail.setComponent( component );
             })
             })
             });
             })
             */


            /*
             db.Component.create({
             isim : 'amo',
             stokAdet : -7
             })
             */

            /*
             db.Component.find(1).success(function( component ){
             db.ComponentPrice.create({
             fiyat : 6.30
             }).success( function( cp ){
             component.addComponentPrice(cp);
             } )
             })
             */



//            db.Component.find(1).then(function(component){
//                console.log(JSON.stringify(component));
//            })


//            db.OrderDetail.create({
//                toplamIhtiyac : 200,
//                depoStok : 125,
//                mevcutIhtiyac : 75,
//                siparisVerilecekAdet : 0
//                //durum : 'siparis verilmedi2'
//            }).success(function(orderDetail){
//                    console.log('orderdetail : ');
//                    console.log(JSON.stringify(orderDetail));
//                }).error(function(err){
//                    console.log('hata : ');
//                    console.log(JSON.stringify(err));
//                })

//            db.Component.find(1).success(function(component){
//                db.OrderHistory.create({
//                    aciklama : 'fabrika test amaçlı',
//                    once : 8,
//                    sonra : 7
//                }).success(function( orderhistory ){
//                        component.addOrderHistory(orderhistory);
//                        //orderhistory.addComponent( component );
//
//                    })
//            })




//            db.User.find(2).then(function(user){
//                user.comparePassword('124', function(err, isMatch){
//                    if(err)
//                        console.log(error);
//                    if(isMatch)
//                        console.log('matched');
//                })
//
//            })

//            db.Component.find({where: { id: 3 }, include: [{ model : db.OrderDetail, include : [
//                {model : db.ComponentPrice, include : [
//                    { model : db.Product, include : [
//                        { model : db.OrderHistory }] }] } ] }] }).then(function(comp){
//                    console.log('tamam');
//                })

//            db.Order.find( { where : { id : 2 }, include : [{ model : db. }] } ).then(function( order ){
//                console.log( JSON.stringify(order) );
//            })

//            db.OrderDetail.findAll( { where : { OrderId : 2 }, include : [] }).then( function( orderdetails ){
//                console.log( JSON.stringify( orderdetails ) );
//            } )

//            db.Order.find( { where : { id : 4 }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then(function( order ){
//                order.getOrderDetails().then(function( orderdetails ){
//                    orderdetails.forEach( function( orderdetail ){
//                        orderdetail.getComponent().then( function( component ){
//                            if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 )
//                            {
//                                    db.OrderHistory.create({
//                                        aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                                        once : component.stokAdet,
//                                        sonra : (component.stokAdet + ( orderdetail.toplamIhtiyac ))
//                                    }).success(function(orderhistory){
//                                            component.addOrderHistory( orderhistory).then(function(){
//                                                component.stokAdet += ( orderdetail.toplamIhtiyac );
//                                                component.save();
//                                            })
//                                        })
//                            }
//                            else
//                            {
//                                db.OrderHistory.create({
//                                    aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                                    once : component.stokAdet,
//                                    sonra : (component.stokAdet + ( Math.abs( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) ) ))
//                                }).success(function(orderhistory){
//                                        component.addOrderHistory( orderhistory).then(function(){
//                                            component.stokAdet += Math.abs( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) );
//                                            component.save();
//                                        })
//                                    })
//
//                            }
//                        } )
//
//                        orderdetail.destroy();
//
//                    } )
//
//                    order.destroy();
//                })
//
//            })




//            db.Component.find({ where : { id : 2 } }).then(function( component ){
////                db.OrderDetail.sum('mevcutIhtiyac', { where : { ComponentId : 2 } }).success(function( sum ){
////                    console.log('sum : ' + sum);
////                })
//                component.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } } }).then(function(od){
////                    console.log('od : ' + JSON.stringify(od));
//                    var chainer = new Sequelize.Utils.QueryChainer;
//
//                    od.forEach(function(orderdetail){
//                        chainer.add(orderdetail.updateAttributes({siparisVerilecekAdet : orderdetail.mevcutIhtiyac, mevcutIhtiyac : 0}))
//                    })
//                    chainer.run().success(function(){
//                        //callback && callback()
//                        console.log('siparisVerilecekAdet verildi');
//                    })
//                })
//            })

//            var numberofcomponenttoadd = 20;

//            db.OrderDetail.sum('mevcutIhtiyac', { where : { ComponentId : 2 } }).success(function( sum ){
//
//                console.log(sum);
//
//            })

//            db.Component.find({ where : { id : 2 }, include : [db.OrderDetail] }).then(function(component){
//
//                var chainer = new Sequelize.Utils.QueryChainer;
//
//                component.orderDetails.forEach(function( orderdetail ){
//                    chainer.add(orderdetail.updateAttributes({ mevcutIhtiyac : 0 }))
//                })
//            })

//            db.OrderDetail.find(47).then(function( orderdetail ){
//                    orderdetail.updateAttributes({ mevcutIhtiyac : 11 }).then( function( updatedod ){
//                        console.log( JSON.stringify( updatedod ) );
//                    } )
//            })

//            db.Component.find({ where : { id : 2 }, include : [db.OrderDetail] }).then(function( component ){
//                component.orderDetails.forEach(function( orderdetail ){
//                    console.log('orderdetails : ' + JSON.stringify( orderdetail ));
//                })
//            })


//            db.Component.find(1).then(function(component){
//
//                db.OrderHistory.create({
//                    aciklama : 'deneme 1',
//                    once : 100,
//                    sonra : 101
//                }).then(function( od1 ){
//                        db.OrderHistory.create({
//                            aciklama : 'deneme 1',
//                            once : 100,
//                            sonra : 101
//                        }).then(function( od2 ){
//                                component.setOrderHistories([ od1, od2 ]);
//                            })
//                    })
//            })


//            var chainer = new Sequelize.Utils.QueryChainer;

//            db.Component.find(1).then(function(component){
//                for( var i = 0; i < 10; i++ )
//                {
//                    chainer.add(db.OrderDetail.create({
//                        toplamIhtiyac : i + 5,
//                        depoStok : i
//                    })   )
//                }
//
//                chainer.run().success(function( results ){
//                    //console.log('bence oldu' + result);
//                    //component.setOrderDetails([result]);
//                    results.forEach(function(result){
//                        //component.addOrderDetail(result);
//                        chainer.add( component.addOrderDetail(result) );
//                    })
//
//                    chainer.run().success(function(){
//                        console.log( 'oldu da bitti' );
//                    })
//
//                })
//
//            })

//            db.Component.find(2).then(function(component){
//                component.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } }, order : [['createdAt', 'ASC']] }).then(function( od ){
//                    //console.log('ods : ' + JSON.stringify( od ));
//                    od.forEach(function( ods ){
//                        console.log('ods : ' + JSON.stringify( ods ));
//                    })
//                })
//            })


//            db.Component.find(2).then(function(component){
//                component.increment({ stokAdet : 1 }).then(function( comp ){
//                    db.Component.find(2).then(function(updatedComponent){
//                        console.log('updated Component : ' + JSON.stringify( updatedComponent ));
//                    })
//                })
//            })

//            db.OrderDetail.find( 130 ).then(function( orderdetail ){
//                orderdetail.updateAttributes({ mevcutIhtiyac : orderdetail.mevcutIhtiyac + 1 }).then(function(updatedOd){
//
//                    console.log('old order detail : ' + JSON.stringify( orderdetail.mevcutIhtiyac ));
//                    console.log('updated order detail : ' + JSON.stringify( updatedOd.mevcutIhtiyac ));
//                })
//            })


//            db.Component.find(2).then(function( component ){
//                component.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } }, include: [{ model : db.Order, include : [ db.Product ] }], order : [['createdAt', 'ASC']] }).then(function( ods ){
//                    ods.forEach(function(odsdetail){
//                        console.log(odsdetail.order.product.isim);
//                    })
//                })
//            })

//            var p1 = new Promise(function(resolve,reject){setTimeout(resolve, 500, "one")});
//            var p2 = new Promise(function(resolve,reject){setTimeout(resolve, 100, "two")});
//
//            Promise.race([p1, p2]).then(function(value){
//                console.log(value);
//            })

//            var siparisSayi = 10;
//            var chainer = new Sequelize.Utils.QueryChainer;

//            db.Component.find(1).then(function(component){
////                component.stokAdet -= 40 ;
////                component.save();
//
////                component.decrement({ stokAdet : 40 })
//                component.updateAttributes({ stokAdet : component.stokAdet - 30 });
//                component.stokAdet -= ( component.productComponent.adet * req.query.siparissayi) ;
//
//            })

//            db.Product.find({where: { id: 1 }, include: [db.Component] }).then(function(product){
//                product.components.forEach(function( component ){
//                    console.log(component.productComponent.adet);
//                })
//            })


//            db.Product.find({where: { id: 1 }, include: [db.Component] }).then(function( product ){
//                db.Order.create({ siparisMiktari: siparisSayi }).then(function( order ){
//                    product.addOrder(order).then(function(){
//
//                        var promises = [];
//
//                        product.components.forEach(function( component ){
//
//                            promises.push(
//                                Promise.all([
//                                    db.OrderDetail.create({ toplamIhtiyac: ( component.productComponent.adet * siparisSayi ), depoStok: component.stokAdet, mevcutIhtiyac: ((component.stokAdet - ( component.productComponent.adet * siparisSayi )) < 0)? Math.abs ( (component.stokAdet - ( component.productComponent.adet * siparisSayi )) ) : 0, siparisVerilecekAdet: 0 }),
//                                    db.OrderHistory.create({ aciklama : 'SİPARİŞ : ' + product.isim, once : component.stokAdet, sonra : (component.stokAdet - ( component.productComponent.adet * siparisSayi ))}),
//                                    component.updateAttributes({ stokAdet : ( component.stokAdet - ( component.productComponent.adet * siparisSayi ) ) })
//                                ])
//                                .spread(function( orderdetail, orderhistory, updatedComponent ){
////                                    console.log('orderdetails : ' + JSON.stringify( orderdetails ));
////                                    console.log('orderhistories : ' + JSON.stringify( orderhistories ));
////                                    console.log('updatedComponent : ' + JSON.stringify( updatedComponent ));
//                                      order.addOrderDetail( orderdetail );
//                                      orderdetail.setComponent( component );
//                                      component.addOrderHistory( orderhistory );
//                                      orderdetail.addOrderHistory( orderhistory );
//                                 })
//                            )
//
//                        })
//
//                        return Promise.all( promises );
//
//
//
//                    }).then(function(){
//                            console.log('oldu da bitti...');
//                        })
//                })
//            })

//            db.Product.find({where: { id: 1 }, include: [db.Component] }).then(function( product ){
//                db.Order.create({ siparisMiktari: siparisSayi }).then(function( order ){
//                    product.addOrder(order).then(function(){
//                        var efePromise =  Promise.map(product.components, function( component ){
//                            return Promise.all([
//                                db.OrderDetail.create({ toplamIhtiyac: ( component.productComponent.adet * siparisSayi ), depoStok: component.stokAdet, mevcutIhtiyac: ((component.stokAdet - ( component.productComponent.adet * siparisSayi )) < 0)? Math.abs ( (component.stokAdet - ( component.productComponent.adet * siparisSayi )) ) : 0, siparisVerilecekAdet: 0 }),
//                                db.OrderHistory.create({ aciklama : 'SİPARİŞ : ' + product.isim, once : component.stokAdet, sonra : (component.stokAdet - ( component.productComponent.adet * siparisSayi ))}),
//                                component.updateAttributes({ stokAdet : ( component.stokAdet - ( component.productComponent.adet * siparisSayi ) ) })
//                            ]).spread(function( orderdetail, orderhistory ){
//                                    return Promise.all([
//                                        order.addOrderDetail( orderdetail ),
//                                        orderdetail.setComponent( component ),
//                                        component.addOrderHistory( orderhistory ),
//                                        orderdetail.addOrderHistory( orderhistory )
//                                    ]);
//                                })
//                        })
//                        return Promise.all(  efePromise  );
//
//                    }).then(function(){
//                            db.Product.find({where: { id: req.params.id }, include: [{ model: db.Component, include: [{ model: db.ComponentPrice} ] }, db.Order ] })
//                                .then(function( product ){
//                                    return res.json( product );
//                                })
//                        })
//                })
//            })


//            ORDER IPTAL ETME PROMOSE
            var orderid = 118;

//            db.Order.find( { where : { id : orderid }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then(function( orders ){
//
//                if( ! orders ){
//                    return res.send(401);
//                }
//
//                var promises = [];
//                promises.push( orders );
//
//                //var cancelOrderPromise =
//                    promises.push(Promise.map( orders.orderDetails, function( orderdetail ){
//                    if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 ){
//                        return db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : ( orderdetail.component.stokAdet + orderdetail.toplamIhtiyac )})
//                            .then(function( orderhistory ){
//                                return Promise.all([
//                                        orderdetail.component.addOrderHistory( orderhistory ),
//                                        orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.toplamIhtiyac + orderdetail.siparisVerilecekAdet ) ) })
//                                    ]).then(function(){
//                                        return orderdetail.destroy();
//                                    })
//                            })
//                    }
//                    else
//                    {
//                        return db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : ( orderdetail.component.stokAdet + orderdetail.toplamIhtiyac )})
//                            .then(function( orderhistory ){
//                                return Promise.all([
//                                        orderdetail.component.addOrderHistory( orderhistory ),
//                                        orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.depoStok + orderdetail.siparisVerilecekAdet ) ) })
//                                    ]).then(function(){
//                                        return orderdetail.destroy();
//                                    })
//                            })
//                    }
//
//                    })
//                )
//
//                return Promise.all( promises )
//            }).then(function( results ){
//                    results[0].destroy().then(function( destroyedOrder ){
//                        console.log('order da silindi' + JSON.stringify( destroyedOrder ));
//                    })
//                })

//            db.Order.find( { where : { id : orderid }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then( function( orders ){
//
//                if( ! orders ){
//                    return console.log( ' ---- no such order with that id -----' );
//                }
//
//                var cancelOrderPromise = Promise.map( orders.orderDetails, function( orderdetail ){
//                    //console.log( JSON.stringify( orderdetails ) );
//                    if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 ){
//                        return Promise.all([
//                            db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : ( orderdetail.component.stokAdet + orderdetail.toplamIhtiyac )
//                            }).then(function( oh ){
//
//                                    return Promise.all([
//                                        orderdetail.component.addOrderHistory( oh ),
//                                        orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.toplamIhtiyac + orderdetail.siparisVerilecekAdet ) ) })
//                                    ]).then(function(){
//                                            return Promise.all([orderdetail.destroy()])
//                                        })
//                                })
//                        ])
//                    }
//                    else
//                    {
//                        return Promise.all([
//                            db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : (orderdetail.component.stokAdet + ( orderdetail.depoStok )) })
//                        ]).then(function( oh2 ){
////                                console.log('--------- ' + JSON.stringify( orderdetail.component ));
////                                console.log('********** ' + JSON.stringify( oh2 ));
////                                orderdetail.component.addOrderHistory( oh2 );
//                                return Promise.all([
//                                    orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.depoStok + orderdetail.siparisVerilecekAdet ) ) })
//                                    //orderdetail.component.addOrderHistory(oh2)
//                                ]).then(function(){
//                                        return Promise.all([orderdetail.component.addOrderHistory( oh2 )]).then(function(){
//                                            return Promise.all([orderdetail.destroy()])
//                                        })
//
//                                    })
//                            })
//
//                    }
//                } )
//
//                return Promise.all( cancelOrderPromise )
//
//            }).then(function( ){
//                    db.Order.find( orderid ).then(function( order ){
//                        order.destroy().then(function(){
//                            console.log('order da silindi');
//                        })
//                    })
//                    console.log('oldu da bitti');
//                }).catch(function( e ){
//                    console.log('error : ' + e);
//                })


//            db.Order.find( { where : { id : orderid }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then(function( order ){
//                if( !order )
//                {
//                    return res.send(401);
//                }
//                order.getOrderDetails().then(function( orderdetails ){
//                    orderdetails.forEach( function( orderdetail ){
//                        orderdetail.getComponent().then( function( component ){
//                            if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 )
//                            {
//
//                                db.OrderHistory.create({
//                                    aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                                    once : component.stokAdet,
//                                    sonra : component.stokAdet + orderdetail.toplamIhtiyac
//                                }).success(function(orderhistory){
//                                        component.addOrderHistory( orderhistory).then(function(){
//                                            component.stokAdet += ( orderdetail.toplamIhtiyac + orderdetail.siparisVerilecekAdet );
//                                            component.save();
//                                        })
//                                    })
//                            }
//                            else
//                            {
//                                db.OrderHistory.create({
//                                    aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                                    once : component.stokAdet,
//                                    sonra : (component.stokAdet + ( orderdetail.depoStok ))
//                                }).success(function(orderhistory){
//                                        component.addOrderHistory( orderhistory).then(function(){
//                                            component.stokAdet += ( orderdetail.depoStok + orderdetail.siparisVerilecekAdet );
//                                            component.save();
//                                        })
//                                    })
//
//                            }
//                        } )
//
//                        orderdetail.destroy();
//
//                    } )
//
//                    order.destroy();
//                })
//
//                db.Product.find({where: { id: order.product.id }, include: [ { model: db.Component, include: [ { model: db.ComponentPrice}] }, db.Order ] })
//                    .then(function(product){
//                        return res.send(product);
//                    })
//
//            })

            var jefe = function( text ) {
                return JSON.stringify( text )
            }

//            var fiyat = 19.99;
//            var numberofcomponenttoadd = 20;
//            var parabirimi = 'EURO';


//            db.Component.find(2).then(function( component ){
//                Promise.all([
//                    component.updateAttributes({ stokAdet : component.stokAdet + numberofcomponenttoadd }),
//                    db.ComponentPrice.create({ fiyat : fiyat, paraBirimi  : parabirimi })
//                ]).spread(function( comp, cp ){
//                        Promise.all([
//                            comp.addComponentPrice(cp),
//                            db.OrderHistory.create({ aciklama : 'stoğa eklendi', once : component.stokAdet,  sonra : component.stokAdet + numberofcomponenttoadd })
//                        ]).spread( function( componentprice, orderhistory ) {
//                                Promise.all([
//                                    componentprice.addOrderHistory(orderhistory),
//                                    component.addOrderHistory( orderhistory)
//                                ]).then(function(){
//                                        comp.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } }, include: [{ model : db.Order, include : [ db.Product ] }],  order : [['createdAt', 'ASC']] })
//                                            .then(function( orderdetails ){
//                                                if( orderdetails.length == 0 ){
//                                                    db.Component.find({where: { id: 2 }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (comp) {
//                                                        //return res.send(comp);
//                                                        console.log('orderdetail length 0');
//                                                    })
//                                                }
//                                                else {
//                                                    var dagitilacakComopnentPromise = Promise.map(orderdetails, function( odd ) {
//                                                        return odd.updateAttributes({siparisVerilecekAdet : odd.mevcutIhtiyac, mevcutIhtiyac : 0})
//                                                            .then(function( newodd ){
//                                                                return Promise.all([
//                                                                    db.OrderHistory.create({ aciklama : 'mevcut İhtiyaç Karşılandı ' + odd.order.product.isim, once : comp.stokAdet, sonra : comp.stokAdet - newodd.siparisVerilecekAdet }),
//                                                                    comp.updateAttributes( { stokAdet : ( comp.stokAdet - newodd.siparisVerilecekAdet ) } )
//                                                                ]).spread(function( orderhistory, savedComponent ) {
//                                                                        return Promise.all([
//                                                                            savedComponent.addOrderHistory( orderhistory),
//                                                                            odd.addOrderHistory( orderhistory )
//                                                                        ])
//                                                                    })
//                                                            })
//                                                    })
//
//                                                    return Promise.all( dagitilacakComopnentPromise );
//
//                                                }
//
//                                            }).then(function() {
//                                                console.log('----------------------------------------------');
//                                            })
//                                    })
//                            } )
//                    })
//            })

            http.createServer(app).listen(app.get('port'), function () {
                console.log('Express server listening on port ' + app.get('port'));
            })
        }
    })
