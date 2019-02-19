
//
// Auth routes
//  - returns the auth methods
//    which validate requests
//    using the User Service
//

// includes
var request = require('request');
var jwt = require('jsonwebtoken');

module.exports = function(router) {

    //
    // Main Authentication middleware methods
    //
    var auth = {

        // verify a request via jwt
        jwt : function(req, res, next) {

            // check header or url parameters or post parameters for token
            let token = req.body.token || req.query.token || req.headers['x-access-token'];

            jwt.verify(token, process.env.JWT_AUTH_SECRET, function(err, decoded) {
                if (err) {
                    return res.status(403).json({ message: 'Failed to authenticate token.' });
                } else {
                    // remove sensitive info
                    delete decoded.password;
                    // pass along our authenticated
                    // user to our request for
                    // object permission validation
                    req.headers['x-authorized'] = decoded.group+'_'+decoded._id;

                    next();
                }
            });

        }

        // TODO other types of auth?

    };

    //
    // Login obtain a new token from the user-service
    //
    router.post('/login', function(req, res) {

        // TODO only do this if we want jwt auth
        // what other types might we have?
        // TODO make this a method
        request({
            uri : process.env.USER_SERVICE_ENDPOINT+'/v1/token',
            method : 'POST',
            json : {
                username : req.body.username,
                password : req.body.password
            }
        }, function(err, response, body){
            if(err) {
                return res.status(500).json(err);
            }

            // failed
            if(response.statusCode == 400) {
                return res.status(400).json(body);
            }

            res.json(body);
        });
    });

    //
    // Register a user
    //
    router.post('/register', function(req, res) {

        // set group to user
        let user = req.body;

        // create a user
        request({
            uri: process.env.USER_SERVICE_ENDPOINT+'/v1/register',
            method: 'POST',
            json: user,
        }, function(err, response, body) {
            if(err) {
                return res.status(500).json(err);
            }

            // failed
            if(response.statusCode == 500) {
                return res.status(400).json(body);
            }

            res.json(body);
        });

    });

    //
    // Forgot password
    //
    router.post('/reset-password', auth.jwt, function(req, res) {

        // TODO

        res.json({ message: 'Reset Password!' });
    });

    //
    // Forgot username
    //
    router.post('/reset-username', auth.jwt, function(req, res) {

        // TODO

        res.json({ message: 'Reset Username!' });
    });

    // make auth methods
    // available to scope
    return auth;
};
