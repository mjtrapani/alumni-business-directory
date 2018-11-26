var createError = require('http-errors');
var bodyParser = require('body-parser')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var auth = require('basic-auth');

// read in the config file
var config = require('./config.json');
var db = null;
var dbInitError = null;
// Database

var mysql = require('mysql');
db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    database: config.db.name
});

db.connect(function(err) {
    if (err) {
        dbInitError = err;
        dbInitError.title = 'There was an error connecting to the DB';
    }
});


var indexRouter = require('./routes/index');
var listingsRouter = require('./routes/listings');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db, auth & config accessible to our router
app.use(function(req,res,next){
    req.dbInitError = dbInitError;
    req.db = db;
    req.auth = auth;
    req.config = config;
    next();
});

// Enable POST & PUT JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/listings', listingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
