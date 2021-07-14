'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    address: String,
    date1: String,
    date2: String,
    username: String,
    email: String,
    password: String,
    price: String,
    stars: Number
})

module.exports = mongoose.model('hotel', hotelSchema);