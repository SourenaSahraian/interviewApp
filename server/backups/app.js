var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

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
app.all('/*', function(req, res, next) {
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


mongo_url= 'mongodb://127.0.0.1/demoApp';
var mongo = require('mongodb').MongoClient;


var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/api/issues', function (req, res) {

    console.log('params: ' + JSON.stringify(req.params));
    console.log('body: ' + JSON.stringify(req.body));
    console.log('query: ' + JSON.stringify(req.query));



    mongo.connect(mongo_url, function (err, db) {

        var col = db.collection('messages'); //TODO change to issues
        col.find().sort({_id: 1}).toArray(function (err, result) {
            if(err)
                throw err;
            if (result == null) {
                res.send('no data was found')
            }

            else {
                var data = result;
                res.send( JSON.stringify(data))
               // res.jsonp(req.query.callback + '(' + JSON.stringify(data) + ');' );

            }

        })

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
