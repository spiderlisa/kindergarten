var db_helper = require('../dbhelper');
var queries = require('../sql-queries');

exports.fillTeacherPresence = function (req, res) {
    if(req.session.loggedin === true) {
        var userId = req.params.teacherId;
        var sql = queries.teacherById;
        db_helper.getObjectsFromDb([sql, userId], function (err, teacher_info) {
            if (!err && req.session.username === teacher_info[0].teacher_email.trim()) {

                sql = queries.childrenFromMainTeacherGroup;
                db_helper.getObjectsFromDb([sql, userId], function (err, children_info) {
                    if (!err) {

                        sql=queries.groupsByTeacherId;
                        db_helper.getObjectsFromDb([sql, userId], function (err, groups_info) {
                            if (!err) {

                                sql = queries.mainGroupByTeacherId;
                                db_helper.getObjectsFromDb([sql, userId], function (err, maingroup) {
                                    if (!err) {

                                        res.render('teacherPresence', {
                                            pagetitle: "Відвідування",
                                            user: teacher_info[0],
                                            groups: groups_info,
                                            main_group: maingroup[0],
                                            children: children_info,
                                            type: "head_teacher",
                                            presence: true,
                                        });

                                    } else {
                                        res.redirect('/');
                                    }
                                });
                            }else {
                                res.redirect('/');
                            }
                        });
                    }else {
                        res.redirect('/');
                    }
                });
            }else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
};

exports.fillTeacherReviews = function (req, res) {
    if(req.session.loggedin === true) {
        var userId = req.params.teacherId;
        var sql = queries.teacherById;
        db_helper.getObjectsFromDb([sql, userId], function (err, teacher_info) {
            if (!err && req.session.username === teacher_info[0].teacher_email.trim()) {

                sql=queries.groupsByTeacherId;
                db_helper.getObjectsFromDb([sql, userId], function (err, groups_info) {
                    if (!err) {

                        sql = queries.mainGroupByTeacherId;
                        db_helper.getObjectsFromDb([sql, userId], function (err, maingroup) {
                            if (!err) {
                                var type;
                                if (maingroup.length != 0)
                                    type = "head_teacher";
                                else
                                    type = "teacher";

                                sql = queries.childrenFromAllTeachersGroups;
                                db_helper.getObjectsFromDb([sql, userId], function (err, children) {
                                    if (!err) {

                                        sql = queries.allReviewsForTeacher;
                                        db_helper.getObjectsFromDb([sql, userId], function (err, reviews) {
                                            if (!err) {

                                                res.render('teacherReviews', {
                                                    pagetitle: "Відгуки",
                                                    user: teacher_info[0],
                                                    reviews: reviews,
                                                    children: children,
                                                    type: type,
                                                    groups: groups_info
                                                });

                                            } else {
                                                res.redirect('/');
                                            }
                                        });
                                    }else {
                                        res.redirect('/');
                                    }
                                });
                            }else {
                                res.redirect('/');
                            }
                        });
                    }else {
                        res.redirect('/');
                    }
                });
            }else {
                res.redirect('/');
            }
        });
    }else {
        res.redirect('/');
    }
};