// eslint-disable-next-line import/no-unresolved
// import models, { connectDb } from './src/models';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const logger = require('morgan');
const cors = require('cors');
const chalk = require('chalk');
const session = require('express-session');
const flash = require('express-flash');
const redisStore = require('connect-redis')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const redis   = require("redis");
const client  = redis.createClient(process.env.REDISTOGO_URL);


const isProduction = process.env.NODE_ENV === 'production';
dotenv.config({path: '.env.process'});


let indexRouter = require('./routes/router');
let service = require('./src/interfaces/service_user');

/**
 * Connect to RedisDB.
 */
client.on('connect', function() {
  console.log("%s Redis client is connected on address: " + process.env.REDISTOGO_URL , chalk.green('✔'));
});

client.on('error', function (err) {
  console.log('%s Redis connection error. Please make sure redis-server is running.' + err, chalk.red('✗'));
});

/**
 * Connect to MongoDB.
 */
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://localhost:27017/kp', {useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

db.once('open', function() {
  console.log("%s Mongo database is connected on address: " + process.env.MONGODB_URI , chalk.green('✔'));
  console.log("----------------------------------------------------------------------------------------");

});

////////////////////////////////////////////////////////////////////////////////

const app = express();


const mode   = process.env.NODE_ENV;
console.log("%s Node is started on environment: " + mode , chalk.green('✔'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  // cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new redisStore({ client: client,ttl :  260}),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.disable('x-powered-by');

app.use('/', indexRouter);

app.use('/swagger', express.static('static/swagger'))
    .use('/apidocs', express.static('static/apidocs'));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

require('./config/passport');

// app.post('user/register',service.registerUser);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
