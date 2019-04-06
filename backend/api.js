var db_helper = require('./dbhelper');
var queries = require('./sql-queries');

exports.getSignIn = function(req, res) {
    res.render('signIn');
};

exports.fillParentBills = function (req, res) {
    var userId = req.params.parentId;

    var sql = queries.guardianById;
    db_helper.getObjectsFromDb([sql, userId], function (err, parent_info) {
        if (!err) {

            sql = queries.childrenByGuardId;
            db_helper.getObjectsFromDb([sql, userId], function (err, children_info) {
                if (!err) {
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
            });
        }
    });

    /*
    var sql1 = "SELECT guardian_id, guardian_email FROM guardian WHERE guardian_email=@userEmail";
    db_helper.getObjectsFromDb([sql1, "olena-vkl@ukr.net"], function (err, res) {
        console.log(res);
    });
    */
};

exports.fillTeacherPresence = function (req, res) {
    var userId = req.params.teacherId;

    var sql = queries.teacherById;
    db_helper.getObjectsFromDb([sql, userId], function (err, teacher_info) {
        if (!err) {
            sql = queries.childrenByGroupId;
            db_helper.getObjectsFromDb([sql, 3], function (err, children_info) {
                if (!err) {
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
            });
        }
    });
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