var mailcfg = require('../configuration/mailconfig');
var nodemailer = require('nodemailer');

var configAyarlari = mailcfg.mailConfig();

var smtpTransport = nodemailer.createTransport(configAyarlari.transport, {
    service : configAyarlari.service,
    auth : {
        user : configAyarlari.user,
        pass : configAyarlari.pass
    }
})

var uyelikistek = function( user ){
    return {
        from : configAyarlari.user,
        to   : user.email,
        subject : 'EOSTOK Üyelik',
        text : 'Üyelik bilgileriniz sisteme ulaşmıştır. Kontrol edilip onaylandıktan ' +
                'sonra tekrar haber verilecektir.'

    }
}

var uyelikOnay = function( user ){
    return {
        from : configAyarlari.user,
        to   : user.email,
        subject : 'EOSTOK Üyelik Onay',
        text : 'Ertunç Özcan Medikal Stok Sistemi Üyeliğiniz Onaylanmıştır.'
    }
}

exports.sendMail = function(emailtype)
{
    smtpTransport.sendMail( emailtype, function( err,response ){
        if( err )
            console.log(err);
        else
            console.log('mail yollandi : ' + response.message);
    } )
}


exports.uyelikistek = uyelikistek;
exports.uyelikOnay = uyelikOnay;
