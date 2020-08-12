const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const config= require('../config/database.js')

router.post('/register', (req, res, next) => {
    console.log(req.body)
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password
    });

    User.addUser(newUser,(err,user)=>{
        if(err){
            res.json({success:false,msg:'Error adding user'})
        }
        else{
            return res.json({success:true,msg:`User added successfully ${newUser.name}`})
        }
    })
})

router.post('/authenticate',(req,res,next) => {
    userName= req.body.userName,
      password= req.body.password
      User.getUserByUsername(userName,(err,userObj)=>{
        if(err) throw err
        if(!userObj){
            return res.json({success:false,message:'user not found'})
        }
        User.comparePassword(password,userObj.password, (err,isMatch)=>{
            if(err) throw err
            if(!isMatch){
                return res.json({success:false,message:'password does not match'})
            }else{
                const token= jwt.sign(userObj.toJSON(),config.secret,{
                    expiresIn:604800
                })
                res.json({
                    success:true,
                    token:`Bearer ${token}`,
                    user:{
                        id:userObj._id,
                        name:userObj.name,
                        userName:userObj.userName,
                        email:userObj.email
                    }
                    })
            }
        })
      })
})

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next) => {
    res.json({
        user: req.user
    })
})

module.exports=router;