
// setup db connection
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// set promise lib
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_CONN);

// create a model schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
  name : String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  group: { type: String, default: 'user' },
  created_at: Date,
  updated_at: Date,
  last_login: Date,
  login_attempts: Number
});

// setup password encryption
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// password helper method
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Create the User Model
var User = mongoose.model('User', userSchema);

// make available to scope
module.exports = User;
