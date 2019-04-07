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
                                        console.error(err);
                                        res.redirect('/');
                                    }
                                });
                            }else {
                                console.error(err);
                                res.redirect('/');
                            }
                        });
                    }else {
                        console.error(err);
                        res.redirect('/');
                    }
                });
            }else {
                console.error(err);
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
                                        console.log(sql);
                                        db_helper.getObjectsFromDb([sql, userId], function (err, reviews) {
                                            if (!err) {
                                                console.log(reviews);

                                                res.render('teacherReviews', {
                                                    pagetitle: "Відгуки",
                                                    user: teacher_info[0],
                                                    reviews: reviews,
                                                    children: children,
                                                    type: type,
                                                    groups: groups_info
                                                });

                                            } else {
                                                console.error(err);
                                                res.redirect('/');
                                            }
                                        });
                                    }else {
                                        console.error(err);
                                        res.redirect('/');
                                    }
                                });
                            }else {
                                console.error(err);
                                res.redirect('/');
                            }
                        });
                    }else {
                        console.error(err);
                        res.redirect('/');
                    }
                });
            }else {
                console.error(err);
                res.redirect('/');
            }
        });
    }else {
        res.redirect('/');
    }
};

exports.addNewReview = function (req, res) {
    if(req.session.loggedin === true) {

        var userId = req.params.teacherId;
        console.log(req.body);
        var child = req.body.child;
        var textReview = req.body.textReview;
        var url = "/t/"+userId+"/reviews";

        var sql = queries.insertReview;

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        db_helper.insertObjectsToDb([sql, userId , child,  dateTime   ,textReview],
            function (err) {

                if (!err && req.session.loggedin === true) {

                    res.redirect(url);
                }
            });

    }
};

exports.markPresence = function (req, res) {
    if(req.session.loggedin === true) {

        var userId = req.params.teacherId;
        console.log(req.body);

       /* var child = req.body.child;
        var textReview = req.body.textReview;
        var url = "/t/"+userId+"/reviews";

        var sql = queries.insertReview;

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        db_helper.insertObjectsToDb([sql, userId , child,  dateTime   ,textReview],
            function (err) {

                if (!err && req.session.loggedin === true) {

                    res.redirect(url);
                }
            });
            */
    }
};