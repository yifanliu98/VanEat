var Dishes = require('../models/dishes');
var Restaurants = require('../models/restaurants');
const mongoose = require('mongoose');
const { body, validationResult, sanitizeBody } = require('express-validator');
var AWS = require('aws-sdk');

exports.dish_list_get = (req, res) => {
    Dishes
        .find()
        .exec()
        .then(dishes => {
            res.render('dishList', { title: 'All Dishes', dishList: dishes })
        })
        .catch(err => {
            res.render('dishList', { title: 'Error loading All Dishes', dishList: [], error: err })
        })
}

exports.dish_new_get = (req, res) => {
    Restaurants
        .find()
        .exec()
        .then(restList => {
            res.render('new_dish', { title: 'Create New Dish', restList: restList })
        })
        .catch(err => {
            res.render('new_dish', { title: 'Error Create New Dish', restList: [], error: err })
        })
}

exports.dish_detail_get = (req, res) => {
    Dishes
        .findById(req.params.id)
        .exec()
        .then(dish => {
            if (!dish) {
                res.render('dish_detail', { title: 'Error Loading Dish' })
            } else {
                Restaurants
                    .findById(dish.restaurant)
                    .exec()
                    .then(result => {
                        res.render('dish_detail', { title: "Dish Detail", dish: dish, restaurant: result })
                    })
            }
        }).catch(err => {
            console.log(err)
            res.render('dish_detail', { title: 'Error Loading Dish' })
        })
}


exports.dish_new_post = [
    body('dishName').isLength({ min: 1 }).trim().withMessage('Dish name must be specified.'),
    sanitizeBody('dish-name').escape(),
    (req, res, next) => {
        const errors = validationResult(req.body)
            // use fileupload instead of multer
        console.log(req.files.image)
        img = req.files.image
        const filePath = 'dishes/' + Date.now() + "-" + img.name
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

        const dish = new Dishes({
            _id: new mongoose.Types.ObjectId(),
            dishName: req.body.dishName,
            img: dbURL,
            restaurant: req.body.restaurant
        })

        if (!errors.isEmpty()) {
            res.render('new_dish', { title: 'Create Dish Error', dish: dish, errors: errors.array() })
            return
        } else {
            dish.save(function(err) {
                if (err) { return next(err) }
                res.redirect(dish.url)
            })
        }
    }
]