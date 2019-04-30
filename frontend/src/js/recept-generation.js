var url = "/p/receipt/";
var pdf = require('html-pdf');
var Framework7 = require('Framework7');

function generateReceipt(id) {
    console.log(id);

    backendGet(url+id, function (err, html) {
        if (!err) {
            console.log(html);
            var filepath = "./bill.pdf";
            pdf.create(html).toFile(filepath, function(err, res) {
                console.log(res.filename);
            });
        } else {
            console.error("Failed to generate receipt.\n" + err);
        }
    });
}

function backendGet(url, callback) {
    Framework7.request({
        url: url,
        type: 'GET',
        success: function (data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    });
}

module.exports = generateReceipt;