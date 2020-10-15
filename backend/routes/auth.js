if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const router = require('express').Router()
const User = require('../models/users')
const bcrypt= require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const fetch = require('node-fetch')
const checkAuth = require('../middleware/check-auth')
const client = new OAuth2Client("564996899561-b38remq66lcdtkhge5l8bgr33putgero.apps.googleusercontent.com")
const Restaurants = require('../models/restaurants');
const Reviews = require('../models/review');
const review = require('../models/review')
router.post('/register', (req, res, next) => {
    User.find({ email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'User Existed'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
});

// delete user if needed
router.delete('/:id', (req, res, next) => {
    User.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

// POST Login 
router.post('/login', (req, res, next ) => {
    User.find({ email: req.body.email})
        .exec()
        .then(user => {
            // if got not user
            if (user.length < 1) {
                // not using 404 here, to prevent hacker
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "1h",
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token,
                        email: user[0].email,
                        userId: user[0]._id,
                        reviews: user[0].reviews,
                        favorites: user[0].favorites,
                        username: user[0].username
                    })
                }
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

// google login
router.post('/google', (req, res) => {
    const { tokenId } = req.body
    
    client
    .verifyIdToken({idToken: tokenId, audience: "564996899561-b38remq66lcdtkhge5l8bgr33putgero.apps.googleusercontent.com"})
    .then(response => {
        // console.log(response.payload)
        const { email_verified, name, email } = response.payload
        if (email_verified) {
            User
                .findOne({email: email})
                .then(user => {
                    if (user) {
                        const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        }, 
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "1h",
                        })

                        return res.status(200).json({
                            message: 'Auth Successful',
                            token: token,
                            email: user.email,
                            userId: user._id,
                            reviews: user.reviews,
                            favorites: user.favorites,
                            username: user.username
                        })

                    } else {
                        bcrypt.hash(email , 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    error: err
                                })
                            }
                            let newUser = new User({
                                _id: new mongoose.Types.ObjectId(),
                                username: name,
                                email: email,
                                password: hash,
                                isThirdParty: true,
                                reviews: [],
                                favorites: []
                            })
                            newUser.save((err, data) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: "Failed to Create this User"
                                    })
                                }
                                const token  = jwt.sign(
                                    {
                                        email: data.email,
                                        userId: data._id
                                    }, 
                                    process.env.JWT_KEY, 
                                    {
                                        expiresIn: "1h",
                                    }
                                )
    
                                return res.status(200).json({
                                    message: 'Google User Created',
                                    token: token,
                                    email: newUser.email,
                                    userId: newUser._id,
                                    reviews: newUser.reviews,
                                    favorites: newUser.favorites,
                                    username: newUser.username
                                })
                            })
                        })
                    }
                })
        } else {
            res.status(400).json({
                error: "Something went wrong"
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

// facebook login

router.post('/facebook', (req, response) => {
    const { userID, accessToken } = req.body
    
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,email&access_token=${accessToken}`
    fetch(urlGraphFacebook, {
      method: 'GET',  
    })
    .then(res => res.json())
    .then(res => {
        const {email, name} = res
        User
        .findOne({email: email})
        .then(user => {
            if (user) {
                const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                }, 
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h",
                })

                return response.status(200).json({
                    message: 'Auth Successful',
                    token: token,
                    email: user.email,
                    userId: user._id,
                    reviews: user.reviews,
                    favorites: user.favorites,
                    username: user.username
                })

            } else {
                bcrypt.hash(email , 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }

                    let newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: name,
                        email: email,
                        password: hash,
                        isThirdParty: true,
                        reviews: [],
                        favorites: []
                    })
                    newUser.save((err, data) => {
                        if (err) {
                            return res.status(400).json({
                                error: "Failed to Create this User"
                            })
                        }
                        const token  = jwt.sign(
                            {
                                email: data.email,
                                userId: data._id
                            }, 
                            process.env.JWT_KEY, 
                            {
                                expiresIn: "1h",
                            }
                        )

                        return response.status(200).json({
                            message: 'FaceBook User Created',
                            token: token,
                            email: newUser.email,
                            userId: newUser._id,
                            reviews: newUser.reviews,
                            favorites: newUser.favorites,
                            username: newUser.username
                        })
                    })
                })
            }
        }).catch(err => {
            response.status(500).json({
                error: err,
                message: "Error Logging to FaceBook"
            })
        })
    })
})


router.get('/', checkAuth, (req,res,next) => {
    User
        .find()
        .exec()
        .then(users => {
            return res.status(200).json({
                user: users
            })
        }).catch(err => {
            return res.status(500).json({
                error: err
            })
        })

});

router.get('/check', checkAuth, (req, res) => {
    User
    .findById(req.userData.userId)
    .exec()
    .then(user => {
        return res.status(200).json({
            message: 'User is Auth',
            username: user.username,
            userId: user._id,
            email: user.email,
            reviews: user.reviews,
            favorites: user.favorites
        })
    })
})

router.get('/favorites', checkAuth,(req, res) => {
    User
        .findById(req.userData.userId)
        .exec()
        .then(user => {
            if (user.favorites.length < 1) {
                return res.status(200).json({
                    user_favorites: []
                })
            }
            console.log(user.favorites)
            Restaurants
            .find({
                '_id': {
                    $in: user.favorites
                }
            })
            .exec()
            .then(docs => {
                let user_favorites = docs.map(doc => {
                    return ({
                        restaurantId: doc._id,
                        name: doc.name,
                        image: doc.image,
                        rate: doc.rate,
                        address: doc.address
                    })
                })
                return res.status(200).json({
                    user_favorites: user_favorites
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

router.get('/reviews', checkAuth, (req, res) => {
    console.log(req.userData.userId)
    User
        .findById(req.userData.userId)
        .exec()
        .then(user => {
            // if (user.reviews.length < 1) {
            //     return res.status(404).json({
            //         message: 'User do not review yet'
            //     })
            // }
            Reviews
                .find({'userId':req.userData.userId})
                .exec()
                .then(reviews => {
                    return res.status(200).json({
                        review: reviews
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

router.post('/userFavorite', checkAuth, (req, res) => {
    User
        .findOneAndUpdate(
                {_id: req.userData.userId},
                {"$addToSet": {"favorites": req.body.restaurantId}}
            )
        .exec()
        .then(user => {
            res.status(200).json({
                message: 'favorite Success'
            }) 
        }).catch(err => {
            return res.status(500).json({
                message: 'Failed to favorite restaurant'
            })
        })
});

router.post('/userUnfavorite', checkAuth, (req, res) => {
    User
        .findOneAndUpdate(
                {_id: req.userData.userId},
                {"$pull": {"favorites": req.body.restaurantId}}
            )
        .exec()
        .then(user => {
            res.status(200).json({
                message: 'unfavorite Success'
            }) 
        }).catch(err => {
            return res.status(500).json({
                message: 'Failed to unfavorite restaurant'
            })
        })
});
module.exports = router;
