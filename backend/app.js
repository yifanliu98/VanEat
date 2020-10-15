if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser')
var multer = require('multer')
var passport = require('passport');
var fileupload = require('express-fileupload')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantsRouter = require('./routes/restaurants');
var categoryRouter = require('./routes/category');

var apiRouter = require('./routes/api/api')
var authRoute = require('./routes/auth')
var reviewApiRoute = require('./routes/api/review')
var dishesRoute = require('./routes/dishes')
var flash = require('express-flash');
var session = require('express-session');
var methodOverRide = require('method-override');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')))
app.use('/static', express.static('static'))
app.use(fileupload())
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverRide('_method'));


//midware
app.use(express.json());

app.use('/', indexRouter);

app.use('/api', apiRouter);
app.use('/api/user', authRoute);
app.use('/api/review', reviewApiRoute)

app.use('/users', usersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/category', categoryRouter);
app.use('/static', express.static('public'))

app.use('/dishes', dishesRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://MaggieQiao:1234@cluster0-18juc.azure.mongodb.net/local_restaurants?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// uploads images
// https://www.youtube.com/watch?v=gQ5ou0G_frw
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'restaurants/new')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})

// test

module.exports = app;