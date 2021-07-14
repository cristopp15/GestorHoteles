'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveHotel(req, res){
    var params = req.body;
    var hotel = new Hotel();

    if(params.name && params.date1 && params.date2 && params.username && params.email && params.password && params.price && params.stars){
        Hotel.findOne({$or:[{username: params.username},
                        {email: params.email}]}, (err, find)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(find){
                res.send({message: "Nombre de usuario o email ya utilizado"});
            }else{
                hotel.name = params.name;
                hotel.username = params.username;
                hotel.email = params.email;
                hotel.address = params.address;
                hotel.date1 = params.date1;
                hotel.date2 = params.date2;
                hotel.price = params.price;
                hotel.stars = params.stars;

                bcrypt.hash(params.password,null,null,(err, passwordOk)=>{
                    if(err){
                        res.status(500).send({message :'Error en encriptar'});
                    }else if(passwordOk){
                        hotel.password = passwordOk;

                        hotel.save((err, hotelSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general', err});
                            }else if(hotelSaved){
                                res.send({message:'Usuario guardado', hotel: hotelSaved});
                            }else{
                                res.status(418).send({message: 'No se guardo el usuario'});
                            }
        
                        })

                    }else{
                        res.status(418).send({message: 'Error inesperado'});
                    }
                })
            }

      })

    }else {
        res.status(418).send({message: 'Ingrese todos los datos necesarios'});
    }



}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Hotel.findOne({$or:[{username: params.username},
                {email: params.email}]},(err,check)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'});
                    }else if(check){
                        bcrypt.compare(params.password, check.password, (err, passwordOk)=>{
                            if(err){
                                res.status(500).send({message: 'Error general 2'});
                            }else if(passwordOk){
                                if(params.getToken = true){
                                    res.send({token: jwt.createToken(check)});
                                }else{
                                    res.send({message: 'Bienvenido', check});
                                }
                            }else{
                                res.send({message: 'Contrasenia incorrecta'});
                            }
                        });
                    }else{
                        res.send({message: 'Datos de empresa incorrectos'});
                    }
                });
        }else{
            res.send({message: 'Ingresa la contrasenia'});
        }

    }else{
        res.send({message: 'Ingresa tu correo o tu usuario'});
    }
}


function deleteHotel(req, res){
    var hotelId = req.params.id;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'No tienes acceso a esta ruta'});
    }else{
        Hotel.findByIdAndRemove(hotelId, (err, hotelDeleted)=>{
            if(err){
                res.status(500).send({message:"Error general", err});
            }else if(hotelDeleted){
                res.send({message: 'Hotel eliminado:', hotelDeleted});
            }else{
                res.status(418).send({message: 'Error al eliminar', err});
            }
        })
    }

}



function updateHotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'No tienes acceso a esta ruta'});
    }else{
        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(hotelUpdated){
                res.send({message:'Hotel actualizado', hotelUpdated});
            }else{
                res.status(418).send({message: 'Error al actualizar', err});
            }
        })

    }
}

function listHotels(req, res){
    Hotel.find({},(err, hotels)=>{
        if(err){
            res.status(500).send({message: 'Error general', err});
        }else if(hotels){
            res.send({hotels});
        }else{
            res.status(418).send({message: 'No hay registros', err})
        }

    })
}

function listHotelsZA(req, res){
    var sort = {name : -1};
    Hotel.find({},(err, hotels)=>{
        if(err){
            res.status(500).send({message: 'Error general', err});
        }else if(hotels){
            res.send({hotels});
        }else{
            res.status(418).send({message: 'No hay registros', err})
        }

    }).sort(sort);
}


function listHotelsAZ(req, res){
    var sort = {name : 1};
    Hotel.find({},(err, hotels)=>{
        if(err){
            res.status(500).send({message: 'Error general', err});
        }else if(hotels){
            res.send({hotels});
        }else{
            res.status(418).send({message: 'No hay registros', err})
        }

    }).sort(sort);
}



module.exports = {
    saveHotel,
    deleteHotel,
    updateHotel,
    login,
    listHotels,
    listHotelsAZ,
    listHotelsZA
}