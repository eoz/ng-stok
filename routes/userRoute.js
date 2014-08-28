var db = require('../models');
var jwt = require('jsonwebtoken');
var secret = require('../configuration/secret');
//var nodemailer = require('nodemailer');
var sendmail = require('../utils/sendmail');

exports.index = function( req, res ){


// ilerde user tokeni silebilirsin jwt.expireToken(req.headers)
//    if( req.query.logout == true )
//    {
//        console.log('req.user : ' + JSON.stringify(req.headers));
//    }
//    else
//    {
//        console.log('req.user : ' + JSON.stringify(req.headers));
//    }

    if( req.query.userid )
    {
        db.User.findAll({ where : { id : req.query.userid }, attributes : ['id', 'isim', 'email', 'resim', 'rol', 'firmaPozisyon', 'lastLogin', 'isApproved', 'createdAt'] } )
            .then(function( user ){
                if( !user )
                    res.json({ hata : 'kullanici bulunamadi' });
                else
                {
                    console.log('query : ' + JSON.stringify( user ));
                    var token = jwt.sign( user, secret.secretToken, { expiresInMinutes: 60 }  );
                    return res.json({ token : token, user : { id : user.id, isim : user.isim, email : user.email, rol : user.rol } });
                }
            })
    }
    else
    {
        db.User.findAll({ attributes : ['id', 'isim', 'email', 'resim', 'rol', 'firmaPozisyon', 'lastLogin', 'isApproved', 'createdAt'] })
            .then( function( users ){
                if( !users )
                {
                    res.json({ hata : 'kullanici yok' })
                }
                else
                {
                    res.json(users);
                }

            } )
    }




}

exports.checkUniqueEmail = function( req, res )
{
    db.User.find({ where : { email : req.body.field } }).then(function(user){
        if( user )
        {
            res.json({isUnique : false});
        }
        if( ! user )
        {
            res.json({isUnique : true});
        }
    })
}

exports.approveUser = function( req, res )
{
    console.log( 'user is : ' + JSON.stringify( req.body.id ) );
    db.User.find( req.params.userid).then(function( user ){
        if( user )
        {
            user.updateAttributes({
                isApproved : true
            }).success(function(){
                    if( user.email )
                    {
                        sendmail.sendMail(sendmail.uyelikOnay(user));
                    }
                    db.User.findAll().then(function( users ){
                        res.send( users );
                    })
                })
        }
        else
        {
            return res.send({ hata : 'kullanici bulunamadi' });
        }
    })

//    db.User.findAll().then( function( users ){
//        console.log('aaaaaaaaaaaaaaaaaa');
//        res.json(users);
//    } )


}

exports.login = function( req, res )
{

    if( req.body.signindetails )
    {
        var signindetails = req.body.signindetails;
        //console.log('sign in details : ' + JSON.stringify(req.body.signindetails));
        db.User.build({ isim : signindetails.Name, email : signindetails.Email, sifre : signindetails.password, rol : 'user', firmaPozisyon : signindetails.firmaPozisyon, isApproved : false })
            .setPassword().save().success(function(savedUser){
                console.log('saved user : ' + JSON.stringify(savedUser));
                return res.json(savedUser);
            })
        //return res.send(200);
        return;
    }

    var usermail = req.body.usermail || '';
    var password = req.body.password || '';

    if( usermail == '' || password == '' )
    {
        return res.send(401)
    }

    db.User.find({ where : { email : usermail } }).then(function(user){
        if( !user )
        {
            return res.send(401);
        }

        user.comparePassword(password, function( err, isMatch ){
            if( !isMatch )
            {
                console.log(user.isim + ' login basarisiz');
                return res.send(401);
            }

            var token = jwt.sign( user, secret.secretToken, { expiresInMinutes: 60 }  );

            user.updateAttributes({ lastLogin : new Date() });

            return res.json({ token : token, user : { id : user.id, isim : user.isim, email : user.email, rol : user.rol } });
        })
    }, function(err){
        console.log(err);
        return res.send(401);
    })


}
