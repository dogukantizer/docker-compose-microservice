//
// Setup our router
// and include all routes
//

module.exports = function(express){

    var router = express.Router();

    // Auth returns a simple middlewear
    // function to authenticate requests
    // via our JWT AuthService
    var auth = require('./auth')(router);

    // include all other API Endpoints
    var handlers = {};
    handlers.users = require('./users')(router, auth);

    return router;
};
