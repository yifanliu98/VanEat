var Restaurants = require('../models/restaurants')
var Category = require('../models/category')
const { body, validationResult, sanitizeBody } = require('express-validator');
var AWS = require('aws-sdk');

// Display all restaurants
exports.category_list = (req, res) => {
    Category
        .find()
        .exec()
        .then(list_categroy => {
            res.render('category', { title: 'All Cuisines & Categories', list_categroy: list_categroy })
        })
        .catch(err => {
            res.render('category', { title: 'Error loading All Categories', list_categroy: [], error: err })
        })
}

exports.category_detail = function(req, res) {
    Category.findById(req.params.id, function(err, category, next) {
        if (err) { return next(err); }
        if (category == null) {
            var err = new Error('Category not found')
            err.status = 404
            return next(err)
        }

        Restaurants.find({ category: category.category_name })
            .exec(function(err, list_restaurants) {
                if (err) { return next(err); }
                res.render('restaurant_category', { title: 'Category: ' + category.category_name, restaurants_list: list_restaurants });
            })
    })
}

exports.category_new = function(req, res) {
    res.render('new_category', { title: 'Create a new category' });
}


exports.category_new_post = [
    body('name').isLength({ min: 1 }).trim().withMessage('Category name must be specified.'),
    sanitizeBody('name').escape(),
    (req, res, next) => {
        const errors = validationResult(req.body)
        console.log(req.files.image)
        img = req.files.image
        const filePath = 'category/' + Date.now() + "-" + img.name
        let dbURL = "https://local-restaurant-project.s3.us-east-2.amazonaws.com/" + filePath
        AWS.config.update({
            accessKeyId: "AKIAIRFZXLO2P5VFM3JQ", // Access key ID
            secretAccesskey: "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", // Secret access key
            region: "us-east-2" //Region
        });
        const s3 = new AWS.S3();
        // Binary data base64
        const fileContent = Buffer.from(req.files.image.data, 'binary');
        // Setting up S3 upload parameters
        const params = {
            Bucket: 'local-restaurant-project',
            Key: filePath, // File name you want to save as in S3
            Body: fileContent,
            ACL: 'public-read',
            ContentDisposition: 'inline',
            ContentType: img.mimetype
        };

        s3.upload(params, function(err, data) {
            if (err) {
                console.log("error uploading to s3");
                console.log(err);
                throw err;
            }
            console.log(data);
        });

        const category = new Category({
            category_name: req.body.name,
            image: dbURL,
        })
        if (!errors.isEmpty()) {
            res.render('new_category', { title: 'Create Category Error', category: category, errors: errors.array() });
            return
        } else {
            category.save(function(err) {
                if (err) { return next(err) }
                res.redirect(category.url)
            })
        }
    }
]