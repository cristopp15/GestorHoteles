'use strict'

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/Hotels2018102', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conexion correcta a la base de datos');
        app.listen(port, ()=>{
            console.log('El servidor esta corriendo en el puerto:', port);
        })
    })

    .catch(err=>{
        console.log('Error al conectar', err);
    })