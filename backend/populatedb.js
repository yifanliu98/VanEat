var userArgs = process.argv.slice(2);
var async = require('async');

var User = require('./models/users')
var Resuaruant = require('./models/restaurants')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var restaurants = [];


function userCreate(name, email, password, phone_number, points, createdAt, cb) {
    userdetail = {
        name: name,
        email: email,
        password: password,
        phone_number: phone_number,
        points: points,
        createdAt: createdAt
    };

    var user = new User(userdetail);

    user.save(function(err) {
        if (err) {
            console.log("error occur \n")
            cb(err, null)
            return
        }
        console.log('New user: ' + user);
        users.push(user)
        cb(null, user)
    });
}


function restaurantCreate(name, address, phone_number, category, average_price, rate, review, cb) {
    restaurantdetail = {
        name: name,
        address: address,
        phone_number: phone_number,
        category: category,
        average_price: average_price,
        rate: rate,
        review: review
    };

    var restaurant = new Resuaruant(restaurantdetail);

    restaurant.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New restaurants: ' + restaurant);
        restaurants.push(restaurant)
        cb(null, restaurant)
    });
}

function createUsers(cb) {
    async.parallel([
            function(callback) {
                userCreate('Amy', 'asdf2@gmail.com', "1234asdf", "7789879887", 0, "2020-07-28", callback);
            },
            function(callback) {
                userCreate('Ben', 'lala2@asd.com', "1234asdf", false, false, "2020-07-28", callback);
            },
        ],
        // optional callback
        cb);
}

function createRestaurants(cb) {
    async.parallel([
            function(callback) {
                restaurantCreate('Take Sushi', '2344 Hasting Street, Burnaby', "1234567890", false, 30, 3, false, callback);
            },
            function(callback) {
                restaurantCreate('Togo Sushi', '2345 Main Street, Vancouver', false, false, false, 3, false, callback);
            },
        ],
        // optional callback
        cb);
}


async.series([
        // createUsers,
        createRestaurants
    ],
    // Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Restaurants: ' + restaurants);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });