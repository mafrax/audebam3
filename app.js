var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var routes = require('./routes');
var session = require('express-session');
var app = express();


/*  PASSPORT SETUP  */

const passport = require('passport');

require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


require('./routes/index.js')(app, passport);
require('./routes/users.js')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));




module.exports = app;
