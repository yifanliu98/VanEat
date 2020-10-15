var express = require('express');
var router = express.Router();
var Review = require('../../models/review');
var User = require('../../models/users')
var moment = require('moment')
const checkAuth = require('../../middleware/check-auth')
const Restaurants = require('../../models/restaurants');
var AWS = require('aws-sdk');

router.post('/', checkAuth, (req, res) => {
    console.log(req.body)
        // const servername = "http://localhost:8080"
    const servername = "https://local-restaurant-project.s3.us-east-2.amazonaws.com/"
    let fileList = []
        // if there is image uploaded, then store the image
    if (req.files) {
        const file = req.files['files[]']
        console.log(file)
        if (Array.isArray(file)) {
            file.forEach(fl => {
                let filePath = 'reviews/' + Date.now() + "-" + fl.name
                AWS.config.update({
                    accessKeyId: "AKIAIRFZXLO2P5VFM3JQ", // Access key ID
                    secretAccesskey: "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", // Secret access key
                    region: "us-east-2" //Region
                });
                const s3 = new AWS.S3();
                // Binary data base64
                const fileContent = Buffer.from(fl.data, 'binary');
                // Setting up S3 upload parameters
                const params = {
                    Bucket: 'local-restaurant-project',
                    Key: filePath, // File name you want to save as in S3
                    Body: fileContent,
                    ACL: 'public-read',
                    ContentDisposition: 'inline',
                    ContentType: fl.mimetype
                };

                s3.upload(params, function(err, data) {
                    if (err) {
                        console.log("error uploading to s3");
                        console.log(err);
                        throw err;
                    }
                    console.log(data);
                });
                fileList.push(servername + filePath);
            });
        } else {
            let filePath = 'reviews/' + Date.now() + "-" + file.name
            AWS.config.update({
                accessKeyId: "AKIAIRFZXLO2P5VFM3JQ", // Access key ID
                secretAccesskey: "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", // Secret access key
                region: "us-east-2" //Region
            });
            const s3 = new AWS.S3();
            // Binary data base64
            const fileContent = Buffer.from(file.data, 'binary');
            // Setting up S3 upload parameters
            const params = {
                Bucket: 'local-restaurant-project',
                Key: filePath, // File name you want to save as in S3
                Body: fileContent,
                ACL: 'public-read',
                ContentDisposition: 'inline',
                ContentType: file.mimetype
            };

            s3.upload(params, function(err, data) {
                if (err) {
                    console.log("error uploading to s3");
                    console.log(err);
                    throw err;
                }
                console.log(data);
            });
            fileList.push(servername + filePath);
        }
    }

    var review = new Review({
        userId: req.userData.userId,
        username: req.body.username,
        restaurantId: req.body.restaurantId,
        review: req.body.review,
        rate: req.body.rate,
        price: req.body.dollar,
        favoriteDish: req.body.favoriteDish,
        image: fileList,
    })

    review.save(function(err) {
        if (err) {
            res.status(500).json({
                error: 'Failed to create review'
            })
        } else {
            User
                .findOneAndUpdate({ _id: req.userData.userId }, { "$push": { "reviews": review._id } })
                .exec()
                .then(data => {
                    Review
                        .find({ 'restaurantId': req.body.restaurantId })
                        .exec()
                        .then(reviews => {
                            var total = 0;
                            var avgPrice = 0;
                            for (var i = 0; i < reviews.length; i++) {
                                total += parseInt(reviews[i].rate)
                                avgPrice += parseInt(reviews[i].price)
                            }
                            total = total / reviews.length
                            avgPrice = avgPrice / reviews.length
                            Restaurants
                                .findOneAndUpdate({ _id: req.body.restaurantId }, { "$set": { "rate": total, "average_price": avgPrice } })
                                .exec()
                                .then(rest => {
                                    res.status(200).json({
                                        message: 'Create Review Success'
                                    })
                                })
                        })

                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        message: 'Failed to Add Review to User'
                    })
                })
        }
    })
})

module.exports = router;