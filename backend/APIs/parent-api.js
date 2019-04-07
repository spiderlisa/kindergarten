var db_helper = require('../dbhelper');
var queries = require('../sql-queries');

exports.fillParentBills = function (req, res) {
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
                } else {
                    res.redirect('/');
                }
            });
        }
    });
};