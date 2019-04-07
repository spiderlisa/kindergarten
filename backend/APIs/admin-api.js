var db_helper = require('../dbhelper');
var queries = require('../sql-queries');
var json = require('../data/kindergarten-data.json');

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