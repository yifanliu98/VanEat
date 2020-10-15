var express = require('express');
var router = express.Router();
var dishController = require('../controllers/dishController')
var passport = require('passport');

var initializePassport = require('../passport-config');

initializePassport(passport)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
    
}

// root

router.get('/', checkAuthenticated, dishController.dish_list_get)

// create new dish GET
router.get('/new', checkAuthenticated, dishController.dish_new_get)

// dish detail GET
router.get('/:id', checkAuthenticated, dishController.dish_detail_get)

// // new dish POST
router.post('/new', checkAuthenticated , dishController.dish_new_post)


module.exports = router;  