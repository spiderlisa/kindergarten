var db_helper = require('../dbhelper');
var queries = require('../sql-queries');

exports.fillParentBills = function (req, res) {
    var userId = req.params.parentId;
    var sql = queries.guardianById;
    db_helper.getObjectsFromDb([sql, userId], function (err, parent_info) {
        if (!err) {
            sql = queries.childrenByGuardId;
            db_helper.getObjectsFromDb([sql, userId], function (err, children_info) {
                if (!err) {

                    sql = queries.billsByTeacherId;
                    db_helper.getObjectsFromDb([sql, userId], function (err, bills) {
                        if (!err && req.session.loggedin === true && req.session.username === parent_info[0].guardian_email.trim()) {

                            res.render('parentBills', {
                                pagetitle: "Рахунки",
                                user: parent_info[0],
                                children: children_info,
                                bills: bills,
                                type: "parent",
                            });
                        } else {
                            res.redirect('/');
                        }
                    });
                }
            });
        }
    });
};