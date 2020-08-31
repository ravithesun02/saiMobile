var mongoose=require('mongoose');

const Schema=mongoose.Schema;

const CustData=new Schema({
    imei:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    remark:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
    cost:{
        type:Number
    },
    staff_name:{
        type:String
    },
    staff_id:{
        type:String
    }
});

module.exports=mongoose.model('CustData',CustData);