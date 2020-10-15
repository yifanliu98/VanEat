const Admin = require('../models/admin');
const {body, sanitizeBody, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const Restaurants = require('../models/restaurants');
const Category = require('../models/category');
const User = require('../models/users');

exports.admin_sign_in_get = (req, res) => {
    res.render('login', {title: 'login'})
}

exports.admin_sign_in_post = (req, res) => {
    res.send('Auth Admin Login')
}

exports.admin_create_get = (req, res) => {
    res.send('Admin create')
}

exports.admin_sign_in_post = function(req, res) {
    res.send("Auth user")
}

exports.admin_create_get = function(req, res) {
    res.render('register', {title: 'register'});
}

exports.admin_create_post = [

    body('username').isLength({min: 1}).trim().withMessage('First name must be specified'),
    body('password').isLength({min: 6}).withMessage('Password Length is must larger than 6'),
    body('confirm_password').custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            throw new Error('Password does not match');
        } else {
            return value;
        }
    }),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('register', {title: "Register", errors: errors.array()})
        } else {
            // can create the new user, added to DB
            hashedPassword = await bcrypt.hash(req.body.password, 10);

            var admin = new Admin({
                username: req.body.username,
                password: hashedPassword,
            });

            admin.save((err) => {
                // if have error, then display the error
                if (err) {
                    if (err.code === 11000) {
                        res.render('register', {title: "Register", duplicate: true});
                    } else {
                        return next(err);
                    }
                }
                res.redirect('/login')
            })
        }
    }
]


exports.search = (req, res) => {
    const target = req.body.search
    Category
        .find({ category_name: target})
        .exec()
        .then(category_list => {
            Restaurants
                .find({ name: target })
                .exec()
                .then(list_restaurants => {
                    res.render('index', { title: 'Searching results of ' + target, category_list: category_list, restaurants_list: list_restaurants })
                })
                .catch(err => {
                    res.render('index', { title: 'Error loading the searching result', category_list: [], restaurants_list: [], error: err })
                })
        })
}


exports.users_list = (req, res) => {
    Admin
        .find()
        .exec()
        .then(admin_list => {
            User
                .find()
                .exec()
                .then(user_list => {
                    res.render('user', { admin_list: admin_list, user_list: user_list })
                })
                .catch(err => {
                    res.render('index', { title: 'Error loading All Users', admin_list: [], user_list: [], error: err })
                })
        })    
    
    
    
    
}