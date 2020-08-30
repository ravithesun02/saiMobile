var mongoose=require('mongoose');

var Schema=mongoose.Schema;

const UserRole=new Schema({
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    }, 
    isStaff:{
        type:Boolean,
        required:true,
        default:true
    }
});

const AdminUser=new Schema({
    name:{
        type:String,
        required:true
    },
    user_role:UserRole,
    emailId:{ 
        type:String,
        required:true
    },
    googleId:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

module.exports=mongoose.model('AdminUser',AdminUser);