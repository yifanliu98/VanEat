const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var Admin = require('./models/admin');

function initialize(passport) {

    const authenticateUser = async (username, password, done) => {
        const admin = await Admin.findOne({ username: username }).exec();
        if (admin == null) {
            return done(null, false, { message: 'No user with that username'})
        }

        try {
            if (await bcrypt.compare(password, admin.password)) {
                console.log("success")
                return done(null, admin)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));
    passport.serializeUser((admin, done) => {
        return done(null, admin._id)
    })
    passport.deserializeUser( async (id, done) => {
        let admin = await Admin.findById(id).exec()
        return done(null, admin);
    })
}

module.exports = initialize