var db = require('../models');
var fs = require('fs');
var paths = require('../utils/paths');
var Promise = require('bluebird');


/*
 TODO
 where isActive : true ekle
 */
exports.index = function (req, res) {
    db.Product.findAll()
        .success(function (products) {
            res.json(products);
        })
}

exports.getProductById = function (req, res) {
    console.log('params id : ' + req.params.id);

    db.Product.find({where: { id: req.params.id }, include: [
        { model: db.Component, include: [
            { model: db.ComponentPrice}
        ] },
        db.Order
    ] }).success(function (product) {
            if (product) {
                console.log('product found');
                res.json(product);
            }
            else {
                console.log('product not found');
                res.json({ hata: 'product bulunamadı' });

            }
        });

}

exports.cancelProductOrder = function( req, res ) {

    if( req.query.cancelOrderId ) {

        var orderid = req.query.cancelOrderId || '';

        if( orderid == '' )
        {
            return res.send( 401 );
        }

        db.Order.find( { where : { id : orderid }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then(function( orders ){

            if( ! orders ){
                return res.send(401);
            }

            var promises = [];
            promises.push( orders );

            //var cancelOrderPromise =
            promises.push(Promise.map( orders.orderDetails, function( orderdetail ){
                if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 ){
                    return db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : ( orderdetail.component.stokAdet + orderdetail.toplamIhtiyac )})
                        .then(function( orderhistory ){
                            return Promise.all([
                                    orderdetail.component.addOrderHistory( orderhistory ),
                                    orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.toplamIhtiyac + orderdetail.siparisVerilecekAdet ) ) })
                                ]).then(function(){
                                    return orderdetail.destroy();
                                })
                        })
                }
                else
                {
                    return db.OrderHistory.create({ aciklama : 'SİPARİŞ İPTALİ : ' + orders.product.isim, once : orderdetail.component.stokAdet, sonra : ( orderdetail.component.stokAdet + orderdetail.toplamIhtiyac )})
                        .then(function( orderhistory ){
                            return Promise.all([
                                    orderdetail.component.addOrderHistory( orderhistory ),
                                    orderdetail.component.updateAttributes({ stokAdet : ( orderdetail.component.stokAdet + ( orderdetail.depoStok + orderdetail.siparisVerilecekAdet ) ) })
                                ]).then(function(){
                                    return orderdetail.destroy();
                                })
                        })
                }

            })
            )

            return Promise.all( promises )
        }).then(function( results ){
                var productid = results[0].product.id;
                results[0].destroy().then(function(){
                    db.Product.find({where: { id: productid }, include: [ { model: db.Component, include: [ { model: db.ComponentPrice}] }, db.Order ] })
                        .then(function( product ){
                            console.log('son product : ' + JSON.stringify( product ));
                            return res.send( product );
                        })
                })
            })



        return;
    }

}

exports.addKomponents = function (req, res) {
    console.log('in addKomponents');
    console.log(JSON.stringify(req.body.id));
    console.log(JSON.stringify(req.body.komponentToAdd));

    if( req.body.komponentToAdd.productComponent.adet <= 0 )
        return;
    else
    {
        db.Product.find({ where: { id: req.body.id }, include: [db.Component, db.Order] }).success(function (product) {
            if (product) {
                db.Component.find(req.body.komponentToAdd.id).success(function (component) {
                    component.ProductComponents = {
                        adet: req.body.komponentToAdd.productComponent.adet
                    }
                    product.addComponent(component).success(function () {
                        product.hasComponent(component).success(function (result) {
                            db.Product.find({where: { id: req.body.id }, include: [{ model: db.Component, include: [db.OrderDetail, db.ComponentPrice ] },] }).success(function (product) {
                                if (product) {
                                    res.send(product);
                                }
                                else {
                                    res.send({ hata: 'product bulunamadı' });
                                }
                            });
                        })

                    })
                })
            }
        })
    }





    //res.end();
}

exports.editProduct = function (req, res) {

    if( req.query.completeOrderId )
    {
        db.Order.find( req.query.completeOrderId ).then(function( order ){
            order.updateAttributes({ isComplete : true}).success( function( order ){
                order.getProduct({ include: [ { model: db.Component, include: [ { model: db.ComponentPrice} ] }, db.Order ] }).then(function( product ){
                    return res.send( product );
                })
            } )
        })
        return;
    }

    if( req.query.formDetails ) {

        var details = JSON.parse( req.query.formDetails );

        console.log('details : ' + JSON.stringify(details));

        var fiyat = details.fiyat || '';
        var numberofcomponenttoadd = details.numToOrder || '';
        var parabirimi = details.paraBirimi.name || '';
        var compid = details.orderDetailComponentId || '';
        var proid = details.orderDetailProductId || '';

        if( fiyat == '' || numberofcomponenttoadd == '' || parabirimi == '' || compid == '' || proid == '' )
        {
            return res.send(401);
        }

        db.Component.find({ where : { id : compid }}).then(function( component ){
            Promise.all([
                    component.updateAttributes({ stokAdet : component.stokAdet + numberofcomponenttoadd }),
                    db.ComponentPrice.create({ fiyat : fiyat, paraBirimi  : parabirimi })
                ]).spread(function( comp, cp ){
                    Promise.all([
                            comp.addComponentPrice(cp),
                            db.OrderHistory.create({ aciklama : 'stoğa eklendi', once : component.stokAdet,  sonra : component.stokAdet + numberofcomponenttoadd })
                        ]).spread( function( componentprice, orderhistory ) {
                            Promise.all([
                                    componentprice.addOrderHistory(orderhistory),
                                    component.addOrderHistory( orderhistory)
                                ]).then(function(){
                                    comp.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } }, include: [{ model : db.Order, include : [ db.Product ] }],  order : [['createdAt', 'ASC']] })
                                        .then(function( orderdetails ){
                                            if( orderdetails.length == 0 ){
                                                db.Product.find({where: { id: proid }, include: [ { model: db.Component, include: [ { model: db.ComponentPrice}] }, db.Order ] }).success(function( product ){
                                                    return res.send( product );
                                                })
                                            }
                                            else {
                                                var dagitilacakComopnentPromise = Promise.map(orderdetails, function( odd ) {
                                                    return odd.updateAttributes({siparisVerilecekAdet : odd.mevcutIhtiyac, mevcutIhtiyac : 0})
                                                        .then(function( newodd ){
                                                            return Promise.all([
                                                                    db.OrderHistory.create({ aciklama : 'mevcut İhtiyaç Karşılandı ' + odd.order.product.isim, once : comp.stokAdet, sonra : comp.stokAdet - newodd.siparisVerilecekAdet }),
                                                                    comp.updateAttributes( { stokAdet : ( comp.stokAdet - newodd.siparisVerilecekAdet ) } )
                                                                ]).spread(function( orderhistory, savedComponent ) {
                                                                    return Promise.all([
                                                                        savedComponent.addOrderHistory( orderhistory),
                                                                        odd.addOrderHistory( orderhistory )
                                                                    ])
                                                                })
                                                        })
                                                })

                                                return Promise.all( dagitilacakComopnentPromise );

                                            }

                                        }).then(function() {
                                            db.Product.find({where: { id: proid }, include: [ { model: db.Component, include: [ { model: db.ComponentPrice}] }, db.Order ] }).success(function( product ){
                                                return res.send( product );
                                            })
                                        })
                                })
                        } )
                })

        })

        return;
    }



    if (req.query.siparissayi) {
        console.log('siparis sayi : ' + req.query.siparissayi);
        console.log(req.body.id);

//        db.Product.find({where: { id: req.body.id }, include: [db.Component] }).success(function(product){
//                if(product)
//                {
//                    db.Order.create({
//                        siparisMiktari: req.query.siparissayi
//                    }).success(function(order){
//                            if(order)
//                            {
//                                product.addOrder(order).success(function(order){
//                                    var comps = product['components'];
//                                    for (c in comps) {
//                                        (function (component) {
//
//                                                db.OrderDetail.create({
//                                                    toplamIhtiyac: ( component.productComponent.adet * req.query.siparissayi ),
//                                                    depoStok: component.stokAdet,
//                                                    mevcutIhtiyac: ((component.stokAdet - ( component.productComponent.adet * req.query.siparissayi )) < 0)? Math.abs ( (component.stokAdet - ( component.productComponent.adet * req.query.siparissayi )) ) : 0,
//                                                    siparisVerilecekAdet: 0//,
//                                                    //durum: 'siparis verilmedi'
//                                                }).then(function(orderdetail){
//                                                        order.addOrderDetail(orderdetail).then(function(orderdetail){
//                                                            orderdetail.setComponent(component).then(function(){
//
//                                                                db.OrderHistory.create({
//                                                                    aciklama : 'SİPARİŞ : ' + product.isim,
//                                                                    once : component.stokAdet,
//                                                                    sonra : (component.stokAdet - ( component.productComponent.adet * req.query.siparissayi ))
//                                                                }).success(function( orderhistory ){
//                                                                        component.addOrderHistory( orderhistory ).then(function(){
//                                                                            orderdetail.addOrderHistory( orderhistory).then(function(){
//                                                                                component.stokAdet -= ( component.productComponent.adet * req.query.siparissayi) ;
//                                                                                component.save();
//                                                                            })
//                                                                        })
//
//                                                                    })
//
//                                                            })
//                                                        })
//                                                    })
//                                        })(comps[c])
//                                    }
//
//                                    db.Product.find({where: { id: req.params.id }, include: [
//                                        { model: db.Component, include: [
//                                            { model: db.ComponentPrice}
//                                        ] },
//                                        db.Order
//                                    ] }).success(function (product) {
//                                            if (product) {
//                                                res.json(product);
//                                                return;
//                                            }
//                                            else {
//                                                res.json({ hata: 'product bulunamadı' });
//                                                return;
//
//                                            }
//                                        });
//
//                                })
//                            }
//                            else // order olusturulamadi
//                            {
//                                res.send({ hata : 'order olustutulamadi' });
//                                return;
//                            }
//
//                        })
//                }
//                else // verilen idde product yok
//                {
//                    res.send({ hata : 'product bulunamadi' });
//                    return;
//                }
//
//        })

        var siparisSayi = req.query.siparissayi;

        db.Product.find({where: { id: req.body.id }, include: [db.Component] }).then(function( product ){
            db.Order.create({ siparisMiktari: siparisSayi }).then(function( order ){
                product.addOrder(order).then(function(){
                    var efePromise =  Promise.map(product.components, function( component ){
                        return Promise.all([
                                db.OrderDetail.create({ toplamIhtiyac: ( component.productComponent.adet * siparisSayi ), depoStok: component.stokAdet, mevcutIhtiyac: ((component.stokAdet - ( component.productComponent.adet * siparisSayi )) < 0)? Math.abs ( (component.stokAdet - ( component.productComponent.adet * siparisSayi )) ) : 0, siparisVerilecekAdet: 0 }),
                                db.OrderHistory.create({ aciklama : 'SİPARİŞ : ' + product.isim, once : component.stokAdet, sonra : (component.stokAdet - ( component.productComponent.adet * siparisSayi ))}),
                                component.updateAttributes({ stokAdet : ( component.stokAdet - ( component.productComponent.adet * siparisSayi ) ) })
                            ]).spread(function( orderdetail, orderhistory ){
                                return Promise.all([
                                    order.addOrderDetail( orderdetail ),
                                    orderdetail.setComponent( component ),
                                    component.addOrderHistory( orderhistory ),
                                    orderdetail.addOrderHistory( orderhistory )
                                ]);
                            })
                    })
                    return Promise.all(  efePromise  );

                }).then(function(){
                        db.Product.find({where: { id: req.params.id }, include: [{ model: db.Component, include: [{ model: db.ComponentPrice} ] }, db.Order ] })
                            .then(function( product ){
                                return res.json( product );
                            })
                    })
            })
        })

        console.log('!!!!!! girmeee!!!!!');
        return;
    }


    db.Product.find({ where: { id: req.params.id }, include: [db.Component, db.Order] }).success(function (product) {
        product.isim = req.body.isim;
        product.aciklama = req.body.aciklama;
        product.save().success(function (savedProduct) {
            res.send(savedProduct);
        })
            .error(function (err) {
                res.send({ hata: err });
            })
    })
    //res.end();
}

exports.saveProduct = function (req, res) {
    console.log('file obj name : ' + req.body.name);
    console.log('file obj aciklama : ' + req.body.aciklama);
    console.log('file obj file : ' + JSON.stringify(req.files.file));
    console.log('file obj file path : ' + req.files.file.path);

    //var imageName = req.files.file.name;
    var imageExt = paths.fileExtension(req.files.file.name);                  //jpg
    var imageName = paths.removeExtension(req.files.file.name);               //magic_loggia
    var newImageName = imageName + paths.createUniqueName() + '.' + imageExt;   // magic_loggia13hv6czyaw.jpg

    fs.readFile(req.files.file.path, function (err, data) {
        if (err) {
            console.log('err : ' + err);
        }
        else {
            //var imageName = req.files.file.name;
            var newPath = paths.productSaveImagePath + newImageName;

            console.log('newPath : ' + newPath);
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    console.log('err writing file : ' + err);
                    res.end({ hata: err });
                }
                else {
                    db.Product
                        .create({
                            isim: req.body.name,
                            aciklama: req.body.aciklama,
                            resim: newImageName
                        })
                        .complete(function (err, product) {
                            if (err) {
                                // database kaydetme hatasi olursa save edilen resmi sil
                                fs.unlink(newPath, function (err) {
                                    if (err)
                                        console.log('resim silinemedi');
                                    else
                                        console.log('resim silindi');
                                })
                                res.json({ hata: err });
                            }

                            else
                                res.json(product);
                        })
                }

            })
        }

    })

}