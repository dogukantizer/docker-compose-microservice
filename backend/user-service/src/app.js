
const PORT = 8080;
const SERVICE_NAME = 'UserService';
const VERSION = 'v1';

// ----------------------------- //

// setup app
var port = process.env.PORT || PORT;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// include app
var userService = require('./'+VERSION)(express);

// init 
app.use('/'+VERSION, userService);
app.listen(PORT);

console.log(SERVICE_NAME + ' ' +VERSION + ' running on http://localhost:' + PORT);