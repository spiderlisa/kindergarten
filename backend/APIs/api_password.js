var crypto = require('crypto');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var json = require('../data/kindergarten-data.json');
var generatePassword = require('password-generator');

exports.generatePassword = function(email) {
    var password = generatePassword();
    var hashdata = saltHashPassword1(password);
    var salt = hashdata.salt;
    var hash =hashdata.hash;

    console.log("PASSWORD   "+password);

    var ac={user: json.kindergarten.email.user, pass: json.kindergarten.email.pass};
    var par={from: "manzhurik@gmail.com", to: [email], subject:"Password for KinderGarten", text: password}

    sendEmail(ac, par);


    var res ={hash: hash, salt: salt};
    return res;
};

function sendEmail(account, params) {
    console.log(account.user);
    console.log(account.pass);

    var smtpTransport1 = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: account.user,
            pass: account.pass
        }
    }));

    var toEmail = params.to[0];
    for (var i = 1; i < params.to.length; i++) {
        toEmail += ', ' + params.to[i];
    }

    // setup email data with unicode symbols
    var mailOptions = {
        from: params.from, // sender address
        to: toEmail, // list of receivers
        subject: params.subject, // Subject line
        text: params.text
    };

    // send mail with defined transport object
    smtpTransport1.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending mail: ' + error);
        } else {
            console.log('Message sent: %s', info.messageId);
        }
        smtpTransport1.close(); // shut down the connection pool, no more messages.
    });
}

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

exports.hashSaltCombinedWithPassword = function(userpassword, salt) {
    var hashResult = sha512(userpassword, salt);
    var res ={hash: hashResult.passwordHash, salt:hashResult.salt}

    return res;
};

exports.saltHashPassword = function(userpassword)
{
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);

    var res ={hash: passwordData.passwordHash, salt:passwordData.salt}

    return res;
};

function saltHashPassword1(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);

    var res ={hash: passwordData.passwordHash, salt:passwordData.salt}

    return res;
};



