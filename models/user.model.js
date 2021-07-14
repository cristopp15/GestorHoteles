'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    age: Number,
    role: String
});

module.exports= mongoose.model('user', userSchema);