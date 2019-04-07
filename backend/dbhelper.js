var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

let dbConnection;

/**
 * Returns array of objects from DB as a result of SELECT request
 *
 * params[0] - sql query
 * params[1...] - parameters for the query in order of appearance/use
 */
exports.getObjectsFromDb = function (params, callback) {
    var request = new Request(params[0], function(err, rowCount) {
        //console.log(params[0]);
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' rows');
        }
        callback(err, result);
    });

    if (params.length > 1) {
        var paramNames = parameterNames(params[0]);
        paramNames.forEach(function (name, i) {
            console.log(name + " - " + params[i + 1]);
            if ((typeof name) == "string" && /[\u0400-\u04FF]/.test(name)) {
                request.addParameter(name, TYPES.NChar, params[i + 1]);
            } else if ((typeof name) == "string") {
                request.addParameter(name, TYPES.VarChar, params[i + 1]);
            } else if ((typeof name) == "num" && name.includes(".")) {
                request.addParameter(name, TYPES.Real, params[i + 1]);
            } else if ((typeof name) == "num") {
                request.addParameter(name, TYPES.Int, params[i + 1]);
            } else if ((typeof name) == "bool") {
                request.addParameter(name, TYPES.Bit, params[i + 1]);
            } else {
                console.error("DB helper failed to get values from DB because actions " +
                    "for this parameter type are not predefined.");
            }
        });
    }

    function parameterNames(sql) {
        var p1 = sql.split('@');
        var p2 = [];
        p1.forEach(function (p, i) {
            if (i>0) {
                var r = p.split(' ');
                p2.push(r[0]);
            }
        });
        console.log("Param names: " + p2);
        return p2;
    }

    var result = [];
    request.on('row', function (columns) {
        var obj = {};
        columns.forEach(function(column) {
            if (column.metadata.colName.toString().includes("dob")) {
                obj[column.metadata.colName] = convertDate(column.value.toString());
            } else if (column.metadata.colName.toString().includes("time")) {
                obj[column.metadata.colName] = convertDateTime(column.value.toString());
            } else {
                obj[column.metadata.colName] = column.value;
            }
        });
        result.push(obj);
    });

    dbConnection.execSql(request);
    return result;
};


exports.connectToDB = function () {
    var config = {
        authentication: {
            type: "default",
            options: {
                userName: 'AnneManzhura',
                password: '28Kissme*',
            }
        },
        server: 'annemanzhuraserver.database.windows.net',
        options:
            {
                database: 'Kindergarten',
                encrypt: true,
                rowCollectionOnRequestCompletion: true
            }
    };

    dbConnection = new Connection(config);

    dbConnection.on('connect', function(err) {
            if (err)
                console.log(err);
            else {
                console.log("Connection established.");
            }
        }
    );
};

function convertDate (d) {
    var parts = d.split(" ");
    var months = {
        Jan: "01", Feb: "02", Mar: "03",
        Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09",
        Oct: "10", Nov: "11", Dec: "12"};

    return parts[2]+"."+months[parts[1]]+"."+parts[3];
}

function convertDateTime (d) {
    var parts = d.split(" ");
    var months = {
        Jan: "01", Feb: "02", Mar: "03",
        Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09",
        Oct: "10", Nov: "11", Dec: "12"};

    return parts[2]+"."+months[parts[1]]+"."+parts[3]+" "+parts[4];
}