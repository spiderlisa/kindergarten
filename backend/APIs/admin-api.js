var db_helper = require('../dbhelper');
var queries = require('../sql-queries');
var json = require('../data/kindergarten-data.json');
var apiPassword = require('./api_password');

exports.renderRegChildPage = function (req, res) {
    if (req.session.loggedin === true && req.session.username === json.kindergarten.admin.login) {
        db_helper.getObjectsFromDb([queries.guardians], function (err, guardians) {
            if (!err) {
                db_helper.getObjectsFromDb([queries.groups], function (err, groups) {
                    if (!err) {
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
    }
};

exports.renderRegParentPage = function (req, res) {
    if (req.session.loggedin === true && req.session.username === json.kindergarten.admin.login) {
        res.render('adminPage', {
            pagetitle: "Реєстрація",
            reg_type: "parent"
        });
    }
};

exports.renderRegTeacherPage = function (req, res) {
    if (req.session.loggedin === true && req.session.username === json.kindergarten.admin.login) {
        db_helper.getObjectsFromDb([queries.groups], function (err, groups) {
            if (!err) {
                res.render('adminPage', {
                    pagetitle: "Реєстрація",
                    groups: groups,
                    reg_type: "teacher"
                });
            }
        });
    }
};

exports.renderNewGroupPage = function (req, res) {
    if (req.session.loggedin === true && req.session.username === json.kindergarten.admin.login) {
        db_helper.getObjectsFromDb([queries.teachers], function (err, teachers) {
            if (!err) {
                res.render('adminPage', {
                    pagetitle: "Нова група",
                    teachers: teachers,
                    reg_type: "group"
                });
            }
        });
    }
};

exports.registerChild = function(request, response) {
    //console.log(request.body);

    var name = request.body.name;
    var lastname = request.body.lastname;
    var secondname = request.body.secondname;
    var dob = request.body.dob;
    var parent = request.body.parent;
    var group = request.body.group;
    var sql = queries.insertChild;

    db_helper.insertObjectsToDb([sql,lastname, name, secondname, dob,parent,group],
        function (err) {

            if (!err && request.session.loggedin === true) {

                response.redirect('/a/register-child');
            }
        });
};

exports.registerParent = function(request, response) {
    var last_name = request.body.last_name;
    var first_name = request.body.first_name;
    var father_name = request.body.father_name;
    var email = request.body.email;
    var phone = request.body.phone;
    var address = "м. "+ request.body.address_city+ ", вул. " + request.body.address_street +
        ", кв. " + request.body.address_flat + "";
    var work = request.body.work;
    var discount = request.body.discount;

    if(discount===undefined || discount===null) discount=0;

    var sql = queries.insertParent;

    var data = apiPassword.generatePassword(email);
    var salt = data.salt;
    var hash = data.hash;

    db_helper.insertObjectsToDb([sql, last_name, first_name, father_name, phone, address, work, email, discount, hash, salt ],
        function (err) {

            if (!err && request.session.loggedin === true) {

                response.redirect('/a/register-parent');
            }
        });
};

exports.registerTeacher = function(request, response) {


    console.log(request.body);

    var last_name = request.body.last_name;
    var first_name = request.body.first_name;
    var father_name = request.body.father_name;
    var email = request.body.email;
    var phone = request.body.phone;
    var address = "м. "+ request.body.address_city+ " вул. " + request.body.address_street +
        " кв. " + request.body.address_flat + "";
    var groups = request.body.group;


    var sql = queries.insertTeacher;
    //var sql2 = queries.insertTeacher_Group;
    var teacherId;

    var data = apiPassword.generatePassword(email);
    var salt = data.salt;
    var hash = data.hash;


    db_helper.insertObjectsToDb([sql, last_name, first_name, father_name, phone, address, email, hash, salt],
        function (err) {
            if (!err && request.session.loggedin === true) {
                //response.redirect('/a/register-teacher');
                console.log("ADDED TO TEACHERS");

                var sqlSelect = queries.selectTeacherByEmail;

                db_helper.getObjectsFromDb([sqlSelect, email], function (err, parent_info) {
                    if (!err && request.session.loggedin === true && groups.length>0)
                    {

                        teacherId = parent_info[0].teacher_id;
                        var insertSql = "insert into teacher_group values";
                        for (var i= 0; i < groups.length; i++) {
                            if (i>0) insertSql = insertSql + ",";
                            insertSql = insertSql + "(" + teacherId + "," + groups[i] + ")";
                        }

                        db_helper.insertObjectsToDb([insertSql], function (err){
                            if (!err && request.session.loggedin === true) {
                                response.redirect('/a/register-teacher');
                            }
                        });
                    } else {
                        response.redirect('/a/register-teacher');
                    }
                });
            }
        });
};

exports.registerGroup = function(request, response) {

    console.log(request.body);

    var name = request.body.name;
    var year = request.body.year;
    var teacher = request.body.teacher;

    var groupId;

    var sql = queries.insertGroup;


    db_helper.insertObjectsToDb([sql,name, year, teacher],
        function (err) {
            if (!err && request.session.loggedin === true) {
                //response.redirect('/a/register-teacher');
                console.log("ADDED TO GROUPS");

                var sqlSelect = queries.selectGroupByHeadTeacher;

                db_helper.getObjectsFromDb([sqlSelect, teacher], function (err, group_info) {
                    if (!err && request.session.loggedin === true)
                    {
                        var groups = group_info.pop();

                        groupId = groups.group_id;

                        var insertSql = "insert into teacher_group values" + "(" + teacher + ","+ groupId + ")" ;

                        db_helper.insertObjectsToDb([insertSql], function (err){
                            if (!err && request.session.loggedin === true) {
                                response.redirect('/a/new-group');
                            }
                        });
                    } else {
                        response.redirect('/a/new-group');
                    }
                });
            }
        });


};