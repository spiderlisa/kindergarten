var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var db_connection = require('./dbhelper');

function configureEndpoints(app) {
    const routes = require('./routes/routes');
    const parent_routes = require('./routes/parent-routes');
    const teacher_routes = require('./routes/teacher-routes');
    const admin_routes = require('./routes/admin-routes');

    app.use('/', routes);
    app.use('/p', parent_routes);
    app.use('/t', teacher_routes);
    app.use('/a', admin_routes);

    app.use(express.static(path.join(__dirname, '..')));
}

function startServer(port) {
    var app = express();

    app.set('views', path.join(__dirname, '../frontend/views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    configureEndpoints(app);

    db_connection.connectToDB();

    app.listen(port, function () {
        console.log('App running on http://localhost:'+port+'/');
    });
}

exports.startServer = startServer;