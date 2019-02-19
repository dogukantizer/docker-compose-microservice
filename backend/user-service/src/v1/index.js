
// 
// Setup our router
// and include all routes
//
module.exports = function(express){

    var router = express.Router();
    
    // User Model
    var User = require('./models/user');

    // include routes
    require('./routes/auth')(router, User);
    require('./routes/user')(router, User);

    return router;
};
