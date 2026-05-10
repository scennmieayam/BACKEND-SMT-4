var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import flash
const flash = require("connect-flash");
// import session
const session = require("express-session");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// mengambil fungsi yang route mahasiswa
const mahasiswaRouter = require("./routes/mahasiswa");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// menggunakan session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
// menggunakan flash
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES DEFAULT
app.use('/', indexRouter);
app.use('/users', usersRouter);
// menggunakan routes mahasiswa
app.use("/mahasiswa", mahasiswaRouter);



// =======================
// ERROR HANDLER
// =======================

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;