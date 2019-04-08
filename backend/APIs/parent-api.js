var db_helper = require('../dbhelper');
var queries = require('../sql-queries');
var json = require('../data/kindergarten-data.json');
var pdf = require('html-pdf');
var Framework7 = require('Framework7');

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

exports.getBillInfo = function (req, res) {
    var id = req.params.id;
    var sql = queries.getBillInfo;
    db_helper.getObjectsFromDb([sql, id], function (err, bill) {
        if (!err) {
            var data = {
                bill: bill[0],
                info: json.kindergarten.billing_details
            };
            res.render('receipt', data);

            /*var ejs = require('ejs');
            var path = require('path');

            ejs.renderFile((path.join(__dirname, '../../frontend/views') + '/receipt.ejs'), data, {}, function (err, html_str) {
                if (err)  {
                    console.error(err);
                } else {
                    var filepath = "./bill"+id+".pdf";
                    var options = { "format": 'A4', "orientation": 'horizontal' };

                    pdf.create(html_str, options).toFile(filepath, function (err, res_pdf) {
                        console.log(res_pdf.filename);
                        res.contentType("application/pdf");
                        res.send(res_pdf);

                    });
                }
            });*/
        }
    });
};