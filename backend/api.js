var db_helper = require('./dbhelper');
var queries = require('./sql-queries');

exports.getSignIn = function(req, res) {
    res.render('signIn');
};

exports.fillParentBills = function (req, res) {
    var userId = req.params.parentId;

    var sql = queries.guardianById;
    console.log(queries.guardianById);
    db_helper.getObjectsFromDb([sql, userId], function (err, parent_info) {
        if (!err) {

            sql = queries.childrenByGId;
            db_helper.getObjectsFromDb([sql, userId], function (err, children_info) {
                if (!err) {
                    res.render('parentBills', {
                        pagetitle: "Рахунки",
                        user: parent_info[0],
                        children: children_info,
                        bills: [
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
};