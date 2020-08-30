var AdminUser=require('../model/adminusers');
var express=require('express');
var auth=require('../auth');
var bodyparser=require('body-parser');
const passport = require('passport');


var AdminUserRouter=express.Router();

AdminUserRouter.use(bodyparser.json());

AdminUserRouter.route('/login')
.get(passport.authenticate('google',{scope:['profile','email']}));


AdminUserRouter.get('/return',passport.authenticate('google'),(req,res,next)=>{
    
    let token=auth.getToken({_id:req.user._id});
    console.log(req.user);
    console.log(token);
    res.cookie('token',token);
    res.redirect('https://localhost:3000');

});

AdminUserRouter.route('/loggedIn')
.get(auth.verifyUser,(req,res,next)=>{

    AdminUser.findOne({_id:req.user._id})
    .then((data)=>{
        res.setHeader('Content-Type','application/json');
        res.statusCode=200;
        res.json({status:'success',user:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));

});

AdminUserRouter.get('/getAlluser',auth.verifyUser,(req,res,next)=>{
    AdminUser.find()
    .then((data)=>{
        res.setHeader('Content-Type','application/json');
        res.statusCode=200;
        res.json({status:'success',result:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));
});

module.exports=AdminUserRouter;