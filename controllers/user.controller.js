'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.username && params.email && params.password){
        User.findOne({$or:[{username : params.username}, {email: params.email}]}, (err,userFind)=>{    
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(userFind){
                res.send({message: 'usuario o correo ya utilizados'});
            }else{
                user.name = params.name;
                user.lastname = params.lastname
                user.username = params.username;
                user.email = params.email;
                user.age = params.age;
                user.role = 'USER';

                bcrypt.hash(params.password,null,null,(err, passwordOk)=>{
                    if(err){
                        res.status(500).send({message :'Error en encriptar'});
                    }else if(passwordOk){
                        user.password = passwordOk;

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'});
                            }else if(userSaved){
                                res.send({message:'Usuario guardado', user: user});
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
    
    
    }else{
        res.send({message: 'Ingrese todos los campos requeridos'});
    }
 
}


function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or:[{username: params.username},
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
                        res.send({message: 'Datos de usuario incorrectos'});
                    }
                });
        }else{
            res.send({message: 'Ingresa la contrasenia'});
        }

    }else{
        res.send({message: 'Ingresa tu correo o tu usuario'});
    }
}

function deleteUser(req,res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        res.status(418).send({message:'No tienes permisos para esta ruta'})
    }else{
        User.findByIdAndRemove(userId,(err, userDeleted)=>{
            if(err){
                res.status(500).send({message: 'Error general', err})
            }else if(userDeleted){
                res.send({message:'Usuario eliminado:', userDeleted});
            }else{
                res.status(418).send({message: 'Error al eliminar', err})
            }
        })

    }


}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar usuario'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }
        });
    }
}

function listUsers(req, res){
    User.find({},(err, users)=>{
        if(err){
            res.status(500).send({message: 'Error general', err});
        }else if(users){
            res.send({users});
        }else{
            res.status(418).send({message: 'No hay registros', err})
        }

    })
}

module.exports = {
    saveUser,
    login,
    deleteUser,
    updateUser,
    listUsers
}