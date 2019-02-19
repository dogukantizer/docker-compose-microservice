

//
// Auth routes
//

// jwt
var jwt = require('jsonwebtoken');

module.exports = function(router, User) {

    // -------- DEV ---------- //
    // TODO REMOVE IN PRODUCTION!
    // create users
    User.findOne({
      username: 'admin'
    }, function(err, user){

      if(!user) {
        let admin = new User({
          name: 'Admin User',
          username: 'admin',
          email: 'admin@test.com',
          password: 'adminpassword',
          group: 'admin'
        });
        admin.save();
      }
    });

    // ------------------------ //

    //
    // Obtain a token for a user
    //
    // expects body to contain
    // username and password params
    //
    router.post('/token', function(req, res) {

      // TODO this is where we could implement
      // 3rd party OAuth providers

      // find the user
      // by username
      User.findOne({
        username: req.body.username
      }, function(err, user) {

        if (err) {
            return res.status(500).json({err: err});
        }

        if (!user) {

          return res.status(400).json({ message: 'Authentication failed.' });

        } else if (user) {

          // check if password matches
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) {
              return res.status(400).json({ message: 'Authentication failed.' });
            }

            if(!isMatch) {
              return res.status(400).json({ message: 'Authentication failed.' });
            }
            // if user is found and password
            // is right create a token
            delete user.password;
            let token = jwt.sign(user, process.env.JWT_AUTH_SECRET);

            // return the information including token as JSON
            res.json({
              user: user,
              token: token
            });

          });

        }

      });
    });

    //
    // authenticate anything with
    // a pre-existing jwt token
    //
    // expects body to contain a token param
    //
    router.post('/auth', function(req, res) {

        // verify a jwt token
        jwt.verify(req.body.token, process.env.JWT_AUTH_SECRET, function(err, decoded) {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token.' });
            } else {
                // remove sensitive info
                delete decoded.password;
                res.json(decoded);
            }
        });

    });

    //
    // register a user
    //
    //   - expects body to contain params
    //     return user with a token
    //
    router.post('/register', function(req, res) {

        // force user / vendor group
        if(req.body.group !== 'user' && req.body.group !== 'vendor') {
          res.status(400).json({message : 'Invalid user group.'});
        }

        var user = new User(req.body);
        user.save(function(err, user) {
            if(err) {
                console.log(err);
                return res.status(500).json({error: err.errmsg || err.message});
            }

            // create token for registered user
            let token = jwt.sign(user, process.env.JWT_AUTH_SECRET);
            res.json({user: user, token : token});
        });
    });

};
