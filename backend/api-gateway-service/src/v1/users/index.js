
//
// User API routes
//  - routes secured by jwt
//

// include libs
var request = require('request');

module.exports = function(router, auth) {

    var userHandlers = {

        get : function (req, res, next) {

            let uri = process.env.USER_SERVICE_ENDPOINT+'/v1/user';
            uri += req.params.id ? '/'+req.params.id : '';

            request({
                uri: uri,
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                    'x-authorized' : req.headers['x-authorized']
                },
                qs : req.query,
                json : true
            }, function(err, response, body){
                if(err) {
                    return res.status(500).json({error:err});
                }

                res.status(response.statusCode).json(body);
            });

        },

        post : function(req, res) {

            request({
                uri: process.env.USER_SERVICE_ENDPOINT+'/v1/user',
                method: 'POST',
                json: req.body,
                headers : {
                    'content-type' : 'application/json',
                    'x-authorized' : req.headers['x-authorized']
                },
                qs : req.query
            }, function(err, response, body){
                if(err) {
                    return res.status(500).json({error:err});
                }

                res.status(response.statusCode).json(body);
            });

        },

        put : function(req, res) {
            request({
                uri: process.env.USER_SERVICE_ENDPOINT + '/v1/user/' + req.params.id,
                method: 'PUT',
                json: req.body,
                headers : {
                    'content-type' : 'application/json',
                    'x-authorized' : req.headers['x-authorized']
                },
                qs : req.query
            }, function(err, response, body){
                if(err) {
                    return res.status(500).json({error:err});
                }

                res.status(response.statusCode).json(body);
            });
        },

        delete : function(req, res) {
            request.delete({
                uri: process.env.USER_SERVICE_ENDPOINT + '/v1/user/' + req.params.id,
                method: 'DELETE',
                headers : {
                    'content-type' : 'application/json',
                    'x-authorized' : req.headers['x-authorized']
                },
                qs : req.query,
                json:true
            }, function(err, response, body){
                if(err) {
                    return res.status(500).json({error:err});
                }

                res.status(response.statusCode).json(body);
            });
        }
        
    };

    // ----- user routes ----- //

    // 
    // get all users
    //
    router.get('/user', auth.jwt, userHandlers.get);

    // 
    // get a specific user
    //
    router.get('/user/:id', auth.jwt, userHandlers.get);

    // 
    // create a user
    //
    router.post('/user', auth.jwt, userHandlers.post);

    // 
    // update a user
    //
    router.put('/user/:id', auth.jwt, userHandlers.put);

    // 
    // delete a user
    //
    router.delete('/user/:id', auth.jwt, userHandlers.delete);


    return userHandlers;
};