const mongoose = require('mongoose');

const validator = require('validator');
const userSchema = require('./userSchema');
const bcrypt = require('bcrypt');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


var User = mongoose.model('User', userSchema);

module.exports = {
    register: (args) => {
        // console.log("Starting user registration !", JSON.stringify(args))
        const validationErrors = [];
        return new Promise(((resolve, reject) => {
            if (!validator.isEmail(args.email)) validationErrors.push({
                msg: 'Please enter a valid email address.',
                status: 400
            });
            if (!validator.isLength(args.password, {min: 8})) validationErrors.push({
                msg: 'Password must be at least 8 characters long',
                status: 400
            });
            if (args.password !== args.confirmPassword) validationErrors.push({
                msg: 'Passwords do not match',
                status: 400
            });
            // console.log("Prosao validacije: ", JSON.stringify(validationErrors));
            if (validationErrors.length) {
                return reject(validationErrors);
            }
            args.email = validator.normalizeEmail(args.email, {gmail_remove_dots: false});


            const user = new User({
                email: args.email,
                password: args.password,
                profile:{
                    gender: args.gender,
                    username : args.username,
                    phone : args.phone,
                    birthday:  args.birthday
                }
            });

            User.findOne({email: args.email}, (err, existingUser) => {
                if (err) {
                    console.log("Error while finding if user already exist");
                    return reject(err);
                }
                if (existingUser) {
                    let msgErr = {msg: 'Account with that email address already exists.', status: 400};
                    console.log('errors', msgErr);
                    return reject(msgErr);
                }
                user.save((err, createdUser) => {
                    if (err) {
                        console.log("Error saving user, some field are invalid");
                        let rejectionError = { status: 400};
                        if(err._message){
                            rejectionError.msg = err._message;
                        }
                        return reject(rejectionError);
                    }
                    console.log("User has been successfully created !");
                    return resolve(createdUser);
                });
            });
        }));

    },

    /**
     * Login user.
     */
    loginUser: (email, password) => {
        return new Promise(((res, rej) => {
            User.findOne({ email : email}, (err, foundUser) => {
                if (err) {
                    console.log("getSingleUserByEmail :: error :: ", err);
                    return rej(err);
                }
                else if(foundUser !== null) {
                    bcrypt.compare(password, foundUser.password, function (err, result) {
                        if (result) {
                            res( foundUser);
                        } else {
                            res();
                        }
                    })
                }else{
                    rej({msg: "User with that email is not found", status: 404});
                }

            });
        }));
    },

    /**
     * GET /account/:userId
     * Profile page.
     */
    getSingleUserById: (userId) => {
        return new Promise(((res, rej) => {
            console.log("getting user with id : ",userId);
            User.findOne({_id: userId}, (err, foundUser) => {
                if (err) {
                    return rej(err);
                }
                if(foundUser){
                 console.log("user found !")
                  res(foundUser);
                }

            });
        }));
    },

    /**
     * Profile get email.
     */
    getSingleUserByEmail: (email) => {
        return new Promise(((res, rej) => {
            User.findOne({ email : email}, (err, foundUser) => {
                if (err) {
                    console.log("getSingleUserByEmail :: error :: ", err);
                    return rej(err);
                }
                else if(foundUser !== null) {
                    res(foundUser);
                }else{
                    rej({msg: "User with that email is not found", status: 404});
                }

            });
        }));
    },


};
