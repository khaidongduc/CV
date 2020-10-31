const mongoose = require('mongoose');
const passportLocalMoongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

userSchema = new Schema().plugin(passportLocalMoongoose);

module.exports.User = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema;