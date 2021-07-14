'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveHotel',mdAuth.ensureAuthAdmin,hotelController.saveHotel);
api.post('/login', hotelController.login);
api.delete('/deleteHotel/:id', mdAuth.ensureAuthHotel ,hotelController.deleteHotel); 
api.put('/updateHotel/:id', mdAuth.ensureAuthHotel, hotelController.updateHotel);
api.get('/listHotels', mdAuth.ensureAuthAdmin, hotelController.listHotels);
api.get('/listHotelsAZ', mdAuth.ensureAuth, hotelController.listHotelsAZ);
api.get('/listHotelsZA', mdAuth.ensureAuth, hotelController.listHotelsZA);



module.exports = api;