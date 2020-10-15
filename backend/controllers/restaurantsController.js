var Restaurants = require('../models/restaurants');
var Category = require('../models/category');
const { body, validationResult, sanitizeBody, param } = require('express-validator');
var AWS = require('aws-sdk');
const { base } = require('../models/restaurants');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

function timeTo12HrFormat(time) { // Take a time in 24 hour format and format it in 12 hour format
    var time_part_array = time.split(":");
    var ampm = 'AM';

    if (time_part_array[0] >= 12) {
        ampm = 'PM';
    }

    if (time_part_array[0] > 12) {
        time_part_array[0] -= 12;
    }

    formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;

    return formatted_time;
}

// Display all restaurants
exports.restaurants_list = (req, res) => {
    Category
        .find()
        .exec()
        .then(category_list => {
            Restaurants
                .find()
                .exec()
                .then(list_restaurants => {
                    res.render('index', { category_list: category_list, restaurants_list: list_restaurants })
                })
                .catch(err => {
                    res.render('index', { title: 'Error loading All Restaurants', category_list: [], restaurants_list: [], error: err })
                })
        })
}

exports.restaurant_detail = function(req, res) {
    Restaurants.findById(req.params.id, function(err, restaurant, next) {
        if (err) {
            console.log("error");
            res.render('restaurant_detail', { title: 'Error loading Restaurants Detail', restaurants_list: [], error: err })
        }
        if (restaurant != null) {
            res.render('restaurant_detail', { title: 'Restaurant Detail', restaurant_detail: restaurant });
        }
    })
}

exports.restaurant_new = function(req, res) {
    // res.render('new_restaurant', { title: 'Create a new restaurant' });
    Category.find()
        .exec(function(err, list_categories) {
            if (err) { return next(err); }
            res.render('new_restaurant', { title: 'Create a new restaurant', category_list: list_categories });
        })

}

// search restaurants by category
exports.restaurant_category = function(req, res, next) {
    Restaurants.find({ category: req.body.category })
        .exec(function(err, list_restaurants) {
            if (err) { return next(err); }
            res.render('restaurant_category', { title: 'Category: ' + req.body.category, restaurants_list: list_restaurants });
        })
};

exports.restaurant_new_post = [
    body('name').isLength({ min: 1 }).trim().withMessage('Restaurant name must be specified.'),
    body('address').isLength({ min: 1 }).trim().withMessage('Address must be specified.'),

    sanitizeBody('name').escape(),
    sanitizeBody('address').escape(),
    sanitizeBody('phone_number').escape(),
    sanitizeBody('category').escape(),
    sanitizeBody('monfrom').escape(),
    sanitizeBody('monto').escape(),
    sanitizeBody('tuefrom').escape(),
    sanitizeBody('tueto').escape(),
    sanitizeBody('wedfrom').escape(),
    sanitizeBody('wedto').escape(),
    sanitizeBody('thufrom').escape(),
    sanitizeBody('thuto').escape(),
    sanitizeBody('frifrom').escape(),
    sanitizeBody('frito').escape(),
    sanitizeBody('satfrom').escape(),
    sanitizeBody('satto').escape(),
    sanitizeBody('sunfrom').escape(),
    sanitizeBody('sunto').escape(),


    (req, res, next) => {
        const errors = validationResult(req.body)
            // console.log(req.files.image)
        img1 = req.files.image
            // console.log(img1.mimetype)
        let servername = "https://local-restaurant-project.s3.us-east-2.amazonaws.com/"
            // const filePath1 = './static/uploads/restaurants/' + Date.now()
        const filePath1 = 'restaurants/' + Date.now()
        img2 = req.files.banner
            // const filePath2 = './static/uploads/banner/' + Date.now()
        const filePath2 = 'banner/' + Date.now()

        var file1 = filePath1 + "-" + img1.name
        var file2 = filePath2 + "-" + img2.name

        AWS.config.update({
            accessKeyId: "AKIAIRFZXLO2P5VFM3JQ", // Access key ID
            secretAccesskey: "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", // Secret access key
            region: "us-east-2" //Region
        });
        const s3 = new AWS.S3();
        // Binary data base64
        const fileContent1 = Buffer.from(req.files.image.data, 'binary');
        const fileContent2 = Buffer.from(req.files.banner.data, 'binary');
        // Setting up S3 upload parameters
        const params1 = {
            Bucket: 'local-restaurant-project',
            Key: file1, // File name you want to save as in S3
            Body: fileContent1,
            ACL: 'public-read',
            ContentDisposition: 'inline',
            ContentType: img1.mimetype
        };
        const params2 = {
            Bucket: 'local-restaurant-project',
            Key: file2, // File name you want to save as in S3
            Body: fileContent2,
            ACL: 'public-read',
            ContentType: img2.mimetype,
            ContentDisposition: 'inline'
        };

        s3.upload(params1, function(err, data) {
            if (err) {
                console.log("error uploading to s3");
                console.log(err);
                throw err;
            }
            console.log(data);
        });

        s3.upload(params2, function(err, data) {
            if (err) {
                console.log("error uploading to s3");
                console.log(err);
                throw err;
            }
        });


        // open hours
        var mon, tue, wed, thu, fri, sat, sun
        var from = req.body.monfrom
        var to = req.body.monto
        if (from == "" || to == "") {
            mon = "closed"
        } else {
            mon = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.tuefrom
        to = req.body.tueto
        if (from == "" || to == "") {
            tue = "closed"
        } else {
            tue = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.wedfrom
        to = req.body.wedto
        if (from == "" || to == "") {
            wed = "closed"
        } else {
            wed = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.thufrom
        to = req.body.thuto
        if (from == "" || to == "") {
            thu = "closed"
        } else {
            thu = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.frifrom
        to = req.body.frito
        if (from == "" || to == "") {
            fri = "closed"
        } else {
            fri = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.satfrom
        to = req.body.satto
        if (from == "" || to == "") {
            sat = "closed"
        } else {
            sat = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }

        from = req.body.sunfrom
        to = req.body.sunto
        if (from == "" || to == "") {
            sun = "closed"
        } else {
            sun = timeTo12HrFormat(from) + " - " + timeTo12HrFormat(to)
        }
        hours = {}
        hours['Mon'] = mon
        hours['Tue'] = tue
        hours['Wed'] = wed
        hours['Thu'] = thu
        hours['Fri'] = fri
        hours['Sat'] = sat
        hours['Sun'] = sun

        file1 = servername + file1;
        file2 = servername + file2;
        const restaurant = new Restaurants({
            name: req.body.name,
            address: req.body.address,
            phone_number: req.body.phone_number,
            category: req.body.category,
            image: file1,
            banner: file2,
            hours: hours,
        })
        if (!errors.isEmpty()) {
            res.render('new_restaurant', { title: 'Create Restaurant Error', restaurant: restaurant, errors: errors.array() });
            return
        } else {
            restaurant.save(function(err) {
                if (err) { return next(err) }
                res.redirect(restaurant.url)
            })
        }
    }
]