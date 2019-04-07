var db_helper = require('../dbhelper');
var queries = require('../sql-queries');
var json = require('../data/kindergarten-data.json');
var apiPassword = require('./api_password');

exports.getSignIn = function(req, res) {
    res.render('signIn', {
        feedback: false
    });
};

exports.logout = function(request, response) {
    request.session.loggedin = false;
    response.redirect('/');
    response.end();
};

exports.authenticate = function(request, response) {
    var email = request.body.email;
    var password = request.body.password;

    var hash;
    var salt;
    var REGISTERED;
    var status;
    var id;

    if (email && password) {

        if (email === json.kindergarten.admin.login && password === json.kindergarten.admin.password) {
            request.session.loggedin = true;
            request.session.username = email;

            response.redirect('/a/register-child');

            response.end();
        } else {
            var sqlG = queries.guardianByEmail;
            var sqlT = queries.teacherByEmail;

            db_helper.getObjectsFromDb([sqlG, email], function (err, parent_info) {
                if (!err) {
                    if (parent_info[0] === undefined)  { //if there is no such email in parents table
                        console.log("Search in parents");
                        db_helper.getObjectsFromDb([sqlT, email], function (err, teacher_info) {
                            if (!err) {
                                if (teacher_info[0] === undefined) { // if there is also no such email in teachers table
                                    response.redirect('/');
                                } else {
                                    console.log("Search in parents");
                                    hash = teacher_info[0].teacher_hashpassword;
                                    salt = teacher_info[0].teacher_salt;
                                    REGISTERED = (hash === apiPassword.hashSaltCombinedWithPassword(password, salt).hash);
                                    if (REGISTERED) {
                                        status = 't';
                                        id = teacher_info[0].teacher_id;
                                        console.log(REGISTERED);
                                        request.session.loggedin = true;
                                        request.session.username = email;

                                        var url;
                                        db_helper.getObjectsFromDb([queries.mainGroupByTeacherId, id], function (err, group) {
                                            if (!err) {
                                                console.log(group);
                                                if (group.length == 0) {
                                                    url = '/' + status + '/' + id + '/reviews';
                                                    response.redirect(url);
                                                } else {
                                                    url = '/' + status + '/' + id + '';
                                                    response.redirect(url);
                                                }
                                            }
                                        });
                                    } else response.redirect('/');
                                }
                            } else response.redirect('/');
                        });
                    } else {
                        console.log("Parent");
                        hash = parent_info[0].guardian_hashpassword;
                        salt = parent_info[0].guardian_salt;
                        REGISTERED = (hash === apiPassword.hashSaltCombinedWithPassword(password, salt).hash);
                        if (REGISTERED) {
                            status = 'p';
                            id = parent_info[0].guardian_id;
                            console.log(REGISTERED);
                            request.session.loggedin = true;
                            request.session.username = email;

                            var url = '/' + status + '/' + id + '';

                            response.redirect(url);
                            response.end();
                        } else response.redirect('/');
                    }
                } else response.redirect('/');
            });
        }
    } else {
        response.redirect('/');
        response.end();
    }
};