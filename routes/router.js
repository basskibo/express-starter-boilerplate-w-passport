const express = require('express');
const services = require('./services');
const chalk = require('chalk');
const auth = require('./auth');
const restrict = require('../libs/middleware/restrict');
const passport = require('passport');
const psp = require('../config/passport');
const redisClient = require('../libs/redisHandler');

module.exports = (function () {
    let router = express.Router();

    function registerUserRouter(service, routePrefix) {

        /*
        * Route for user registration
        */
        router.post(routePrefix + '/register', function (req, res, next) {
            service.registerUser(req).then(rsp => {
                res.json(rsp);
            }).catch(err => {
                console.log(err.msg)
                res.writeHead(err.status);
                res.end(err.msg);
            })
        });

        /*
        * Route for login user
        */
        router.post(routePrefix + '/login', passport.authenticate('local', { failureFlash: true ,failureFlash: 'Invalid username or password.'}), function (req, res, next) {
            const {email, password} = req.query;
            if (!email) {
                return res.status(400).json({
                    errors: {
                        msg: 'Email is required',
                    },
                });
            }

            if (!password) {
                return res.status(400).json({
                    errors: {
                        msg: 'Password is required',
                    },
                });
            }

            service.login(email, password).then(rsp => {
                console.log("Login finished successfully !");
                return res.json(rsp);
            }).catch(err => {
                console.log("ee", err)
                res.writeHead(err.status);
                res.end(err.msg);
            });

        });

        /*
              * Route for fetching user by identifier or _id
              */
        router.get(routePrefix + '/logout', function (req, res) {
            // console.log("loging out user: " +JSON.stringify(req.session));
            req.logout();
            req.session.destroy(function (err) {
                // cannot access session here
                res.status(200);
                res.json({"msg": "User logged out!"})

            });
            // res.redirect('/');
        });

        /*
        * Route for fetching user by identifier or _id
        */
        router.get(routePrefix + '/get/:userId', restrict, function (req, res, next) {
            const reqParams = req.params;
            // console.log("Request started for getuserid" , JSON.stringify(req.session.passport.user));
            service.getUserById(reqParams).then(rsp => {
                res.json(rsp);
            }).catch(err => {
                res.writeHead(err.status);
                res.end(err.msg);
            });
        });


    }


    registerUserRouter(services.user, '/user');

    console.log("%s Router has been initialized !", chalk.green('✔'));

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        console.log('is authenticated?: ' + req.isAuthenticated()); // This always returns false
        console.log('is isUnauthenticated?: ' + req.isUnauthenticated()); // This always returns false
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.status(401);
        res.end()
    }

    return router;
}());
