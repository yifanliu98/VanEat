var restaurantsRouter = require('../restaurants');

var express = require('express');
var router = express.Router();
var Restaurants = require('../../models/restaurants');
var Categories = require('../../models/category');
var Reviews = require('../../models/review');
var Dishes = require('../../models/dishes');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a aaaapi');
});

router.get('/restaurants', (req,res,next) => {
    Restaurants
        .find()
        .exec()
        .then(rest => {
            return res.status(200).json({
                restaurant: rest
            })
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })

});



router.get('/restaurantsName', (req,res,next) => {
    Restaurants
        .find()
        .exec()
        .then(rest => {
            var arrayObj = new Array();
            for (var i = 0; i < rest.length; i++){
                arrayObj.push({
                    id: rest[i]._id,
                    name: rest[i].name
                })   
            } 
            arrayObj = Array.from(new Set(arrayObj))
            return res.status(200).json({               
                restaurantName: arrayObj                
            })
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })

});

router.get('/restaurants/:id', (req, res) => {
    Restaurants
        .findById(req.params.id)
        .exec()
        .then(rest => {
            if (rest.length < 1) {
                return res.status(404).json({
                    message: 'No Restaurant Found'
                })
            }
            Reviews
                .find({'restaurantId':req.params.id})
                .exec()
                .then(reviews => {
                    Dishes
                        .find({'restaurant':req.params.id})
                        .exec()
                        .then(dishes => {
                            return res.status(200).json({
                                restaurant: {
                                    rest,
                                    reviews: reviews,
                                    dishes: dishes
                                }
                            })
                        }).catch(err => {
                            return res.status(500).json({
                            error: err
                        })
                    })
                }).catch(err => {
                    return res.status(500).json({
                        error: err
                    })
                })
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
});

router.get('/category', (req, res) => {
    Categories
        .find()
        .exec()
        .then(cat => {
            return res.status(200).json({
                category: cat
            })
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })
});

router.get('/category/:catname', (req, res) => {
    console.log(req.params.catname)
    Restaurants
        .find({category: req.params.catname})
        .exec()
        .then(rest => {
            if (rest.length < 1) {
                return res.status(404).json({
                    message: 'No Restaurant Found'
                })
            }
            return res.status(200).json({
                restaurant: rest
            })
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                error: err
            })
        })
});



module.exports = router;