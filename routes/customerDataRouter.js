var express=require('express');
const CustData=require('../model/customerdata');
var bodyparser=require('body-parser');
var auth=require('../auth');

var CustDataRouter=express.Router();

CustDataRouter.use(bodyparser.json());

CustDataRouter.route('/data')
.get(auth.verifyUser,(req,res,next)=>{
    CustData.find()
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',result:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));

})
.post(auth.verifyUser,(req,res,next)=>{         //Add new task
    req.body.status=false;
    console.log(req.body);

    CustData.create(req.body)
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',result:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.put(auth.verifyUser,(req,res,next)=>{          //request for help
    req.body.status=false;

    CustData.findByIdAndUpdate({_id:req.body._id},{staff_name:req.body.staff_name,staff_id:req.body.staff_id})
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',result:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));
})
.delete(auth.verifyUser,auth.verifyMainAdmin,(req,res,next)=>{
    CustData.findByIdAndRemove({_id:req.body._id})
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',result:data});
    },(err)=>{
        console.log(err);
    })
    .catch((err)=>next(err));
});

CustDataRouter.put('/assign',auth.verifyUser,auth.verifyMainAdmin,(req,res,next)=>{        // Admin assign to Staff

    CustData.findByIdAndUpdate({_id:req.body._id},{staff_name:req.body.staff_name,staff_id:req.body.staff_id})
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'success',result:data});
    },(err)=>console.log(err))
    .catch((err)=>next(err));

});

module.exports=CustDataRouter;