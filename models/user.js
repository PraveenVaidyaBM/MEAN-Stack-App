const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database.js')

const userSchema = mongoose.Schema({
    name : {type : String},
    email : {type : String,required : true},
    userName : {type : String,required : true},
    password : {type : String,required : true}
});

const User=module.exports=mongoose.model('User',userSchema)

module.exports.getUserById=function(id,callback){
    User.findById(id,callback)
}

module.exports.getUserByUsername=function(userName,callback){
    const query ={userName:userName}
    User.findOne(query,callback)
}


module.exports.comparePassword=function(plainPassword,hashedpassword,callback){
    bcrypt.compare(plainPassword,hashedpassword,(err,isMatch)=>{
        if(err) throw err
        callback(null,isMatch)
    })
}

module.exports.addUser=function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if (err) throw err;
            newUser.password=hash;
            newUser.save(callback)
        })
    })
}