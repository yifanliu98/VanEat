var express = require('express');
var router = express.Router();
var passport = require('passport');
var indexController = require('../controllers/indexController');
var initializePassport = require('../passport-config');

initializePassport(passport)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/restaurants')
  }
  return next()
}

router.post('/search', checkAuthenticated, indexController.search)
router.get('/user', checkAuthenticated, indexController.users_list);

/* GET home page. */
// ADMIN LOGIN
router.get('/' , function(req, res, next) {
  res.redirect('/login')
});

router.get('/login', checkNotAuthenticated, indexController.admin_sign_in_get)

router.post('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true,
}))

router.get('/register', checkAuthenticated, indexController.admin_create_get)

router.post('/register', checkAuthenticated, indexController.admin_create_post)


module.exports = router;
