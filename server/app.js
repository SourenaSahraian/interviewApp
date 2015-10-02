var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');
var ObjectId = require('mongodb').ObjectID;

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);


//CORS support - making these APIs public
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


mongo_url = 'mongodb://127.0.0.1/demoApp';
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


function log_request_params(req) {

    console.log('params: ' + JSON.stringify(req.params));
    console.log('body: ' + JSON.stringify(req.body));
    console.log('query: ' + JSON.stringify(req.query));


}

app.get('/api/issues', function (req, res) {

    log_request_params(req);
    mongo.connect(mongo_url, function (err, db) {

        var col = db.collection('messages'); //TODO change to issues
        col.find().sort({_id: 1}).toArray(function (err, result) {
            if (err)
                throw err;
            if (result == null) {
                res.send('no data was found')
            }

            else {
                var data = result;
                res.send(JSON.stringify(data))
                // res.jsonp(req.query.callback + '(' + JSON.stringify(data) + ');' );

            }

        })

    })

})


//get an individual issue
app.delete('/api/issues/:issue_Id', function (req, res) {

    log_request_params(req);
    mongo.connect(mongo_url, function (err, db) {
        //extract the id parameter
        var search_by_id = req.params.issue_Id;
        //TODO make sure it s a number

        var col = db.collection('messages'); //TODO change to issues

        try {
            col.remove({_id: ObjectId(search_by_id.toString())}).sort({_id: 1}).toArray(function (err, result) {
                if (err)
                    throw err;
                if (result == null) {
                    res.send('no data was found')
                }

                else {
                    var data = result;
                    res.send(JSON.stringify(data))

                }

            })

        }
        catch (e) {
            console.log(e)
            res.send('data not found ! ')

        }

    })

})


app.put('/api/issues/:issue_Id', function (req, res) {

    log_request_params(req);
    mongo.connect(mongo_url, function (err, db) {
        //extract the id parameter
        var search_by_id = req.params.issue_Id;
        //TODO make sure it s a number

        var col = db.collection('messages'); //TODO change to issues

        try {
            col.findAndModify({_id: ObjectId(search_by_id.toString())}, [['_id', 'asc']], {
                $set: {
                    name: req.body.name,
                    description: req.body.desc
                }
            }, {}, function (err, object) {
                if (err) {
                    console.warn(err.message);
                }
                else {
                    res.send('data was updated successfully')

                }
            })

        }
        catch (e) {
            console.log(e)
            res.send('data not found ! ')

        }

    })

})


app.post('/api/create', function (req, res) {
    // res.send('post is intercepted with issue_id:  '+  req.body)
    mongo.connect(mongo_url, function (err, db) {
        if (err)
            throw err;

        var col = db.collection('messages'); //TODO change to issues
        col.insert({name: req.body.name, description: req.body.desc}, function () {
            console.log('data was inserted');

        });
    })

    res.send('success')
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/*mongoose.connect('mongodb://localhost/meanapp')
 mongoose.connection.once('open', function () {

 //load the mongoose models
 app.models = require('./models/index');
 var routes = require('./routes');

 _.each(routes, function (controller, route) {
 console.log(route)  ;
 app.use(route, controller(app, route));
 })


 })*/


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
