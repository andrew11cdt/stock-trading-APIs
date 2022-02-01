var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
const Schema = mongoose.Schema;
// var uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        unique: true,
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    password: {
        type: String,
        index: true
    },
    wallets: [{ref: 'Wallet', type: Schema.Types.ObjectId}],
    created: Date,
    updated: Date,
});
// UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
});

module.exports = mongoose.model('User', userSchema);
