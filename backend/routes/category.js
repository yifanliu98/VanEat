var express = require('express');
var router = express.Router();
var multer = require('multer');
var categroy_controller = require('../controllers/categoryController');
var initializePassport = require('../passport-config');
var passport = require('passport');

initializePassport(passport)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/* GET users listing. */
router.get('/', checkAuthenticated, categroy_controller.category_list);
router.get('/new', checkAuthenticated, categroy_controller.category_new);
router.post('/new', checkAuthenticated, categroy_controller.category_new_post);
router.get('/:id', checkAuthenticated, categroy_controller.category_detail);

module.exports = router;
