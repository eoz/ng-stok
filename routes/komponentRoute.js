var db = require('../models');
var fs = require('fs');
var paths = require('../utils/paths');
var Sequelize = require('sequelize');
var Promise = require('bluebird');

exports.index = function (req, res) {
    db.Component.findAll()
        .success(function (komponents) {
            res.json(komponents);
        })
}

exports.editKomponent = function(req, res){

    if( req.query.subtractStokFormDetail )
    {
        var details = JSON.parse( req.query.subtractStokFormDetail );
        console.log('details : ' + JSON.stringify( details ));

        var subtractkomponent = details.subtractkomponent || '';
        var aciklama = details.aciklama || '';

        if( subtractkomponent == '' || aciklama == '' )
        {
            return res.send(401);
        }

        db.Component.find({ where : { id : req.body.id } }).then( function(component){
            //var onceki = component.stokAdet;
            component.decrement({ stokAdet : subtractkomponent }).then( function(){
                db.OrderHistory.create({
                    aciklama : aciklama,
                    once : component.stokAdet,
                    sonra : component.stokAdet - subtractkomponent
                }).success(function( orderhistory ){
                        component.addOrderHistory(orderhistory).then(function(){
                                  db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (comp) {
                                return res.send(comp);
                            })

                        })


                    })
            } )
        } )

        return;
    }

    if( req.query.addStokformDetail )
    {
        var details = JSON.parse( req.query.addStokformDetail );

        var fiyat = details.fiyat || '';
        var numberofcomponenttoadd = details.addcomponentstok || '';
        var parabirimi = details.paraBirimi.name || '';

        if( fiyat == '' || numberofcomponenttoadd == '' || parabirimi == '' )
        {
            return res.send(401);
        }

        db.Component.find({ where : { id : req.body.id }}).then(function( component ){
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
                                                db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (comp) {
                                                    return res.send(comp);
                                                    //console.log('orderdetail length 0');
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
                                            db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (comp) {
                                                return res.send(comp);
                                            })
                                        })
                                })
                        } )
                })

        })


                //BURASI PROMISE DONECEK
//                db.Component.find({ where : { id : req.body.id }}).then(function( component ){
//
//                    db.OrderDetail.sum('mevcutIhtiyac', { where : { ComponentId : req.body.id } }).success(function( sum ){
//                        if( sum > numberofcomponenttoadd )
//                            return res.send( 401 );
//                        else
//                        {
//                            component.increment({ stokAdet : numberofcomponenttoadd }).then(function(){
//                                db.ComponentPrice.create({
//                                    fiyat : fiyat,
//                                    paraBirimi : parabirimi
//                                }).then(function(cp){
//                                        component.addComponentPrice(cp).then(function(){
//                                            db.OrderHistory.create({
//                                                aciklama : 'stoğa eklendi',
//                                                once : component.stokAdet,
//                                                sonra : component.stokAdet + numberofcomponenttoadd
//                                            }).then(function( orderhistory ){
//                                                    cp.addOrderHistory( orderhistory ).then(function(){
//                                                        component.addOrderHistory( orderhistory).then(function(){
//
//
//
////                                                 component.orderDetails.forEach(function( od ){
////                                                     console.log( JSON.stringify('orderdetail : ' + od ));
////                                                 })
//
//                                                   component.getOrderDetails({ where : { mevcutIhtiyac : { gt : 0 } }, include: [{ model : db.Order, include : [ db.Product ] }],  order : [['createdAt', 'ASC']] }).then(function( orderdetails ){
//                                                       //if( orderdetails.size == 0 )
//                                                       if( orderdetails.length == 0 )
//                                                       {
//                                                           db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (comp) {
//                                                                return res.send(comp);
//                                                           })
//                                                       }
//                                                       else // mevcut ihtiyaclara dagit
//                                                       {
//                                                           var chainer = new Sequelize.Utils.QueryChainer;
//
//                                                           db.Component.find({ where : { id : req.body.id }}).then(function(incComponent){
//                                                               orderdetails.forEach(function( odd ){
//                                                                   odd.updateAttributes({siparisVerilecekAdet : odd.mevcutIhtiyac, mevcutIhtiyac : 0}).then(function(newodd){
//                                                                       db.OrderHistory.create({
//                                                                           aciklama : 'mevcut İhtiyaç Karşılandı ' + odd.order.product.isim,
//                                                                           once     : incComponent.stokAdet,
//                                                                           sonra    : incComponent.stokAdet - newodd.siparisVerilecekAdet
//                                                                       }).then(function( orderhistory ){
//                                                                               incComponent.stokAdet -= ( newodd.siparisVerilecekAdet ) ;
//                                                                               incComponent.save().then(function( savedComponent ){
//                                                                                   savedComponent.addOrderHistory( orderhistory).then(function(){
//                                                                                       odd.addOrderHistory( orderhistory );
//                                                                                   })
//                                                                               })
//                                                                           })
//                                                                   })
//                                                               })
//
//                                                           })
//
//
//
//
//
//
//
//
//
//                                                       }
//                                                   })
//
//
//
//
//
//                                                        })
//                                                    })
//                                                })
//                                        })
//                                    })
//                            })
//                        }
//                    })
//
//
//                })





        return;


    }

    db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (component) {
        if(!component)
        {
            res.send({ hata : 'urun bulunamadi' });
        }
        else
        {
            component.updateAttributes({ isim : req.body.isim, aciklama : req.body.aciklama }).then(function(updatedComponent){
                if(!updatedComponent)
                {
                    res.send({ hata : 'urun guncellenemedi' });
                }
                else
                {
                    if( !paths.isEmpty(req.files) )
                    {
                        var imageExt = paths.fileExtension( req.files.file.name );                  //jpg
                        var imageName = paths.removeExtension( req.files.file.name );               //magic_loggia
                        var newImageName = imageName + paths.createUniqueName() + '.' + imageExt;   // magic_loggia13hv6czyaw.jpg

                        fs.readFile(req.files.file.path, function (err, data) {
                            if(err)
                            {
                                res.send({ component : updatedComponent, hata : 'resim okunamadı' });
                            }
                            else
                            {
                                var oldPath = paths.componentSaveImagePath + updatedComponent.resim;
                                var newPath = paths.componentSaveImagePath + newImageName;
                                fs.writeFile(newPath, data, function (err) {
                                    if(err)
                                    {
                                        res.send({ component : updatedComponent, hata : 'resim yazma hatası' });
                                    }
                                    else
                                    {
                                        updatedComponent.updateAttributes({ resim : newImageName }).then(function(updatedImageComponent){
                                            if(!updatedImageComponent)
                                            {
                                                res.send({ component : updatedComponent, hata : 'veritabanı yazma hatası' });
                                            }
                                            else
                                            {
                                                fs.unlink(oldPath, function( err ){
                                                    if(err)
                                                    {
                                                        res.send({ component : updatedImageComponent, hata : 'eski resim silinemedi' })
                                                    }
                                                    else
                                                    {
                                                        res.send(updatedImageComponent);
                                                        console.log('updatedImageComponent : ' + JSON.stringify(updatedImageComponent));
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    else
                    {
                        res.send(updatedComponent);
                    }


                }

            })
        }

    })


}


exports.saveKomponent = function (req, res) {
    console.log('file obj name : ' + req.body.name);
    console.log('file obj aciklama : ' + req.body.aciklama);
    console.log('file obj file : ' + JSON.stringify( req.files.file ));
    console.log('file obj file path : ' + req.files.file.path);

    //var imageName = req.files.file.name;
    var imageExt = paths.fileExtension( req.files.file.name );                  //jpg
    var imageName = paths.removeExtension( req.files.file.name );               //magic_loggia
    var newImageName = imageName + paths.createUniqueName() + '.' + imageExt;   // magic_loggia13hv6czyaw.jpg

    fs.readFile(req.files.file.path, function (err, data) {
        if (err) {
            console.log('err : ' + err);
        }
        else {
            //var imageName = req.files.file.name;
            var newPath = paths.componentSaveImagePath + newImageName;
            console.log('komponent save dir : ' + newPath);

            console.log('newPath : ' + newPath);
            fs.writeFile(newPath, data, function (err) {
                if (err)
                {
                    console.log('err writing file : ' + err);
                    res.end({ hata : err });
                }
                else
                {
                    db.Component
                        .create({
                            isim: req.body.name,
                            aciklama: req.body.aciklama,
                            resim : newImageName,
                            firma : req.body.firma,
                            firmaYetkilisi : req.body.firmaYetkili,
                            firmaYetkilisiIletisim : req.body.firmaYetkiliIletisim,
                            stokAdet : req.body.stokAdet,
                            fiyat : req.body.fiyat,
                            ureticiKodu : req.body.ureticiKodu
                        })
                        .complete(function (err, komponent) {
                            if (err)
                            {
                                // database kaydetme hatasi olursa save edilen resmi sil
                                fs.unlink(newPath, function( err ){
                                    if( err )
                                        console.log('resim silinemedi');
                                    else
                                    console.log('resim silindi');
                                })
                                res.json({ hata : err });
                            }

                            else
                                res.json(komponent);
                        })
                }

            })
        }

    })

}

exports.getKomponentById = function (req, res) {

    db.Component.find({where: { id: req.params.componentid }, include: [db.OrderDetail, db.ComponentPrice, db.Product, {model : db.OrderHistory, include : [ db.ComponentPrice ] }] }).success(function (komponent) {
            if (komponent) {
                console.log('komponent found');
                res.json(komponent);
            }
            else {
                console.log('komponent not found');
                res.json({ hata: 'komponent bulunamadı' });

            }
        });

}
