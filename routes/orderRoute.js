var db = require('../models');
var Promise = require('bluebird');

exports.cancelOrderDetailByOrderId = function( req, res )
{
    console.log( 'cancelOrderDetailId : ' + req.params.orderid );

    var orderid = req.params.orderid || '';

    if( orderid == '' )
    {
        return res.send( 401 );
    }

//    db.Order.find( { where : { id : orderid }, include : [ db.Product, { model : db.OrderDetail, include : [ { model : db.Component, attributes : ['stokAdet'] } ] } ] }).then(function( order ){
//        if( !order )
//        {
//            return res.send(401);
//        }
//        order.getOrderDetails().then(function( orderdetails ){
//            orderdetails.forEach( function( orderdetail ){
//                orderdetail.getComponent().then( function( component ){
//                    if( ( orderdetail.depoStok - orderdetail.toplamIhtiyac ) >= 0 )
//                    {
//
//                        db.OrderHistory.create({
//                            aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                            once : component.stokAdet,
//                            sonra : component.stokAdet + orderdetail.toplamIhtiyac
//                        }).success(function(orderhistory){
//                                component.addOrderHistory( orderhistory).then(function(){
//                                    component.stokAdet += ( orderdetail.toplamIhtiyac + orderdetail.siparisVerilecekAdet );
//                                    component.save();
//                                })
//                            })
//                    }
//                    else
//                    {
//                        db.OrderHistory.create({
//                            aciklama : 'SİPARİŞ İPTALİ : ' + order.product.isim,
//                            once : component.stokAdet,
//                            sonra : (component.stokAdet + ( orderdetail.depoStok ))
//                        }).success(function(orderhistory){
//                                component.addOrderHistory( orderhistory).then(function(){
//                                    component.stokAdet += ( orderdetail.depoStok + orderdetail.siparisVerilecekAdet );
//                                    component.save();
//                                })
//                            })
//
//                    }
//                } )
//
//                orderdetail.destroy();
//
//            } )
//
//            order.destroy();
//        })
//
//        db.Product.find({where: { id: order.product.id }, include: [ { model: db.Component, include: [ { model: db.ComponentPrice}] }, db.Order ] })
//            .then(function(product){
//                return res.send(product);
//            })
//
//    })

    //BURAYI PRODUCT YAPACAK
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


}

//exports.saveOrderDetailByOrderId = function( req, res ) {
//
//
//    // BURAYI ARTIK PRODUCT YAPIYOR
////    if( req.query.completeOrder )
////    {
////        console.log( 'req.query.completeOrder : ' + req.query.completeOrder );
////        console.log( 'req.params.orderid : ' + req.params.orderid );
////
////        db.Order.find( req.params.orderid).then(function( order ){
////            order.updateAttributes({ isComplete : true}).success( function( order ){
//////                db.Order.findAll( { where : { ProductId : order.ProductId } }, { raw : true }).then(function( orders ){
//////                    console.log('orders is Array? : ' + JSON.stringify(orders));
//////                    return res.send( orders );
////                return res.send( order );
//////                })
////            } )
////
////        })
////
////        return;
////    }
//
//    var orderid = req.params.orderid || '';
//    var orderDetailId = req.query.orderDetailId || '';
//    var formDetails = req.query.formDetails ? JSON.parse( req.query.formDetails ) : ''
//
//   if( orderid == '' || orderDetailId == '' || formDetails == '' )
//   {
//       return res.send(401);
//   }
//
//   db.OrderDetail.find( orderDetailId).then(function( od ){
//        od.updateAttributes({ siparisVerilecekAdet : formDetails.numToOrder }).then(function(){
//            console.log('od update edildi.');
//        })
//   })
//
//    res.send(200);
//}

exports.getOrderById = function(req, res){
    //console.log('order id : ' + req.params.orderid);
    if( !req.params.orderid )
    {
        res.json({ hata : 'orderid eksik' });
    }
    else
    {
        db.Order.find( { where: { id: req.params.orderid }, include: [{model : db.OrderDetail, include : [{model : db.Component, include : [db.ComponentPrice, db.OrderDetail]}]}] } ).success(function(order){
            if(!order)
            {
                res.json({ hata : 'order bulunamadi' });
            }
            else
            {
                res.json(order);
            }
        })
    }
}