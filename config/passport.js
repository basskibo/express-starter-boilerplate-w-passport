const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
const moment = require('moment');
const userSchema = require('../src/models/user/userSchema');
const userModel  = require('../src/models/user/userModel');
const User = mongoose.model('User', userSchema);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        // console.log("user desirialized !!!");
        done(err, user);
    });
});


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    userModel.getSingleUserByEmail(email)
        .then((user) => {
            if (!user || !user.comparePassword(password)) {
                console.log("Wrong username or password !");
                return done(null, false, {errors: {'email or password': 'is invalid'}});
            }
            return done(null, user);
        }).catch(done);
}));



