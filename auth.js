var passport = require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const AdminUser=require('./model/adminusers');
var jwtStrategy=require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');
require('dotenv').config();

exports.getToken=function(user){
    return jwt.sign(user,process.env.SECRET_KEY,{expiresIn:'12000000 days'});
};

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: "http://localhost:8000/admin/return"
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      AdminUser.findOne({
        'googleId': profile.id 
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new AdminUser({
                name: profile.displayName,
                emailId: profile._json.email,
                googleId:profile.id,
                user_role:{
                    isAdmin:false,
                    isStaff:true
                }
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            }); 
        } else {
            //found user. Return
            return done(err, user);
        }
    });
  }
));

var opts={};

opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken() ;
opts.secretOrKey=process.env.SECRET_KEY;

exports.jwtPassport=passport.use(new jwtStrategy(opts, (jwt_payload,done)=>{
    console.log(jwt_payload);

        AdminUser.findOne({_id:jwt_payload._id},(err,user)=>{  
            if(err)
            { 
                 return done(err,false);
            }
            else if(user)
                return done(null,user);
            else
                return done(null,null);
        });
}));

exports.verifyUser=passport.authenticate('jwt',{session:false});

exports.verifyMainAdmin=(req,res,next)=>{
    if(req.user.user_role.isAdmin)
    {
        next();
    }
    else
    {
        let err=new Error('You are not authorized to perform this operation !');
        err.status=403;
        next(err);
    }
}






