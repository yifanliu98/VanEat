var express = require('express');
var router = express.Router();
var multer = require('multer');
var restaurant_controller = require('../controllers/restaurantsController');
var passport = require('passport');

var initializePassport = require('../passport-config');

initializePassport(passport)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')

}

/* GET users listing. */
router.get('/', checkAuthenticated, restaurant_controller.restaurants_list);



router.get('/all/cat', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/new', checkAuthenticated, restaurant_controller.restaurant_new);
router.post('/new', checkAuthenticated, restaurant_controller.restaurant_new_post);
router.get('/:id', checkAuthenticated, restaurant_controller.restaurant_detail);
router.post('/category', checkAuthenticated, restaurant_controller.restaurant_category);




// // GET request to update contact.
// router.get('/:id/update', restaurant_controller.restaurant_update_get);

// // POST request to update contact.
// router.post('/:id/update', restaurant_controller.restaurant_update_post);





module.exports = router;