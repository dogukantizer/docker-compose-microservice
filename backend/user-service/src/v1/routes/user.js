
//
// User REST API routes
//

// TODO dont select password field

module.exports = function(router, User) {

    // get all
    router.get('/user', function(req, res) {

        // get the user authorized to make this request
        let authorized = req.headers['x-authorized'] || '';

        // validate permissions
        if(authorized.indexOf('user') !== -1) {
            return res.status(403).end();
        }

        let filter = req.query.filter ? req.query.filter : {};
        let sort = req.query.sort ? req.query.sort : {};

        User.find(filter).sort(sort).exec(function(err, users) {
            if(err) {
                return res.status(500).json({error : err});
            }

            res.json(users);
        });

    });

    // get one
    router.get('/user/:id', function(req, res) {

        // get the user authorized to make this request
        let authorized = req.headers['x-authorized'] || '';

        // requires admin / manager or
        // or ownership permissions
        if(authorized.indexOf('user') !== -1) {
            if(authorized.indexOf(req.params.id) === -1) {
                return res.status(403).end();
            }
        }

        User.findOne({ _id : req.params.id }, function(err, user){
            if(err) {
                return res.status(500).json({error : err});
            }

            res.json(user);
        });

    });

    // create
    router.post('/user', function(req, res) {
        
        // get the user authorized to make this request
        let authorized = req.headers['x-authorized'] || '';

        // requires admin / manager or
        // or ownership permissions
        if(authorized.indexOf('user') !== -1) {
            return res.status(403).end();
        }

        var user = new User(req.body);
        user.save(function(err, user){
            if(err) {
                return res.status(500).json({error : err});
            }

            res.json(user);
        });
        
    });

    // update
    router.put('/user/:id', function(req, res) {

        // get the user authorized to make this request
        let authorized = req.headers['x-authorized'] || '';

        // requires admin / manager or
        // or ownership permissions
        if(authorized.indexOf('user') !== -1) {
            if(authorized.indexOf(req.params.id) === -1) {
                return res.status(403).end();
            }
        }

        // updating group requires 
        // admin permissions (?)
        if(authorized.indexOf('admin') === -1 && req.body.group) {
            delete req.body.group;
        }

        User.findOne({ _id : req.params.id }, function (err, user) {
            if(err) {
                return res.status(500).send(err);
            }

            if(!user) {
                return res.status(400).json({message: 'user not found'});
            }

            for(var key in req.body) {
                user[key] = req.body[key];
            }

            user.save();

            res.json(user);
        });

    });

    // delete
    router.delete('/user/:id', function(req, res) {

        // get the user authorized to make this request
        let authorized = req.headers['x-authorized'] || '';

        // requires admin / manager permissions
        if(authorized.indexOf('user') !== -1) {
            return res.status(403).end();
        }
        
        User.findOne({ _id : req.params.id }, function (err, user){
            if(err) {
                return res.status(500).json({err : err});
            }

            if(!user) {
                return res.status(400).json({message: 'user not found'});
            }

            user.remove();
            res.status(200).end();
        });
        
    });

};