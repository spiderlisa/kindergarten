var db_helper = require('./dbhelper');
var queries = require('./sql-queries');
var json = require('./data/kindergarten-data.json');
var apiPassword = require('./api_password');

exports.getSignIn = function(req, res) {
    res.render('signIn');
};

exports.logout = function(request, response) {
    request.session.loggedin = false;
    response.redirect('/');
    response.end();
};

exports.authenticate = function(request, response) {

    console.log(json.kindergarten.admin.password);
    console.log(json.kindergarten.admin.login);

    var email = request.body.email;
    var password = request.body.password;

    var hash;
    var salt;
    var REGISTERED;
    var status;
    var id;

    if (email && password) {

        if (email === json.kindergarten.admin.login && password === json.kindergarten.admin.password) {

            console.log("HELLOO");
            request.session.loggedin = true;
            request.session.username = email;

            response.redirect('/a/register-child');

            response.end();
        } else {

            console.log("KOOOOOO");
            var sqlG = queries.guardianByEmail;
            var sqlT = queries.teacherByEmail;

            db_helper.getObjectsFromDb([sqlG, email], function (err, parent_info) {
                if (!err) {
                    if (parent_info[0] === undefined)  //if there is no such email in parents table
                    {
                        db_helper.getObjectsFromDb([sqlT, email], function (err, teacher_info) {
                            if (!err) {
                                if (teacher_info[0] === undefined) // if there is also no such email in teachers table
                                {
                                    response.redirect('/');
                                } else {
                                    hash = teacher_info[0].teacher_hashpassword;
                                    salt = teacher_info[0].teacher_salt;
                                    REGISTERED = (hash === apiPassword.hashSaltCombinedWithPassword(password, salt).hash);
                                    if (REGISTERED) {
                                        status = 't';
                                        id = teacher_info[0].teacher_id;
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
                    } else {
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
    }
    else {
        response.redirect('/');
        response.end();
    }
};

exports.fillParentBills = function (req, res) {
    var sqlG = queries.guardianByEmail;
    var userId = req.params.parentId;
    var sql = queries.guardianById;
        db_helper.getObjectsFromDb([sql, userId], function (err, parent_info) {
            if (!err) {
                sql = queries.childrenByGuardId;
                db_helper.getObjectsFromDb([sql, userId], function (err, children_info) {
                    if (!err && req.session.loggedin === true && req.session.username === parent_info[0].guardian_email.trim()) {

                        res.render('parentBills', {
                            pagetitle: "Рахунки",
                            user: parent_info[0],
                            children: children_info,
                            bills: [ //TODO
                                {
                                    child_name: "Іван Іванов",
                                    period: "лютий 2019",
                                    sum: 578,
                                    status: "не сплачено",
                                    end_date: "31.03.2019"
                                },
                                {
                                    child_name: "Марія Іванова",
                                    period: "лютий 2019",
                                    sum: 670,
                                    status: "не сплачено",
                                    end_date: "31.03.2019",
                                }
                            ],
                            type: "parent",
                        });
                    }
                    else
                    {
                        res.redirect('/');
                    }
                });
            }



        });

};

exports.fillTeacherPresence = function (req, res) {

    if(req.session.loggedin === true)
    {
        var userId = req.params.teacherId;

        var sql = queries.teacherById;
        db_helper.getObjectsFromDb([sql, userId], function (err, teacher_info) {
            if (!err) {
                sql = queries.childrenByGroupId;
                db_helper.getObjectsFromDb([sql, 3], function (err, children_info) {
                    if (!err && req.session.loggedin === true && req.session.username === teacher_info[0].teacher_email.trim()) {
                        res.render('teacherPresence', {
                            pagetitle: "Відвідування",
                            user: teacher_info[0],
                            groups: [ // TODO
                                {
                                    id: 3,
                                    name: "Сонечко",
                                    number: 23,
                                },
                                {
                                    id: 4,
                                    name: "Пташка",
                                    number: 21,
                                }
                            ],
                            main_group: "Сонечко",
                            children: children_info,
                            type: "teacher",
                            presence: true,
                        });
                    }
                    else
                    {
                        res.redirect('/');
                    }
                });
            }
        });
    }
    else
    {
        res.redirect('/');
    }

};

exports.fillTeacherReviews = function (req, res) {

};

exports.renderRegChildPage = function (req, res) {
    db_helper.getObjectsFromDb([queries.guardians], function (err, guardians) {
        if(!err) {
            db_helper.getObjectsFromDb([queries.groups], function (err, groups) {
                if(!err) {
                    res.render('adminPage', {
                        pagetitle: "Реєстрація",
                        parents: guardians,
                        groups: groups,
                        reg_type: "child"
                    });
                }
            });
        }
    });
};

exports.renderRegParentPage = function (req, res) {
    res.render('adminPage', {
        pagetitle: "Реєстрація",
        reg_type: "parent"
    })
};

exports.renderRegTeacherPage = function (req, res) {
    db_helper.getObjectsFromDb([queries.groups], function (err, groups) {
        if(!err) {
            res.render('adminPage', {
                pagetitle: "Реєстрація",
                groups: groups,
                reg_type: "teacher"
            });
        }
    });
};

function normaliseForDB(val,norm)
{
    var n = norm-val.length;
    var value = val;
    for (var i = 0; i < n; i++) {
        value = value+ " ";
    }
    return value;
}
