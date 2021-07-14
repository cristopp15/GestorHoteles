
'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'contrasenia';
var key2 = 'contrasenia2';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        age: user.age,
        role: user.role,
        iat:  moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, key);
}

exports.createToken = (hotel)=>{
     var payload = {
         sub: hotel._id,
         name: hotel.name,
         date1: hotel.date1,
         date2: hotel.date2,
         username: hotel.username,
         price: hotel.price,
         iat: moment().unix(),
         exp: moment().add(15,"minutes").unix()

     }
     return jwt.encode(payload, key2)
 }