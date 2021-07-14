'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.delete('/deleteUser/:id',mdAuth.ensureAuth, userController.deleteUser);
api.put('/updateUser/:id',mdAuth.ensureAuth, userController.updateUser);
api.get('/listUsers', userController.listUsers);


module.exports = api;   