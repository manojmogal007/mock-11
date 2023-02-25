const {Usermodel}=require('../models/user.model')
const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')


const userRouter=express.Router()

userRouter.post('/register',async(req,res)=>{
    const {profile,name,bio,phone,email,password}=req.body
    try{
        bcrypt.hash(password, 4,async function(err, hash) {
            if(err){
                console.log(err)
                res.send({'msg':'Signup unsuccessful'}) 
            }else{
                const new_user=new Usermodel({profile,name,bio,phone,email,password:hash})
                await new_user.save()
                res.send({'msg':'Signup successful'})
            }
        });
    }catch(err){
        console.log(err)
        res.send({'msg':'Signup unsuccessful'})
    }
})


userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    const user= await Usermodel.find({email})
    // res.send(user)
   try{
        if(user.length>0){
            bcrypt.compare(password, user[0].password,await function(err, result) {
                if(result){
                    var token = jwt.sign({ user_id: user[0]._id }, 'auth');
                    res.send({'msg':'Login successful','token':token})
                }else{
                    console.log(err)
                    res.send({'msg':'Login unsuccessful'})
                }
            });
        }

   }catch (err){
    console.log(err)
    res.send({'msg':'Login unsuccessful'})
   }
})

userRouter.get('/getprofile',async(req,res)=>{
    const token=req.headers.authorization
    var decoded = jwt.verify(token, 'auth');
    // console.log(decoded)
    const user= await Usermodel.find({_id:decoded.user_id})
    try{
        if(user.length>0){
            res.send({'msg':'Profile found','user':user[0]})
        }else{
            console.log(err)
            res.send({'msg':'Profile not found'})
        }
    }catch(err){
        console.log(err)
        res.send({'msg':'Something went wrong'})
    }
})

userRouter.patch('/editprofile',async(req,res)=>{
    const {profile,name,bio,phone,email,password}=req.body
    var decoded = jwt.verify(token, 'auth');
    try{
        bcrypt.hash(password, 4,async function(err, hash) {
            if(err){
                console.log(err)
                res.send({'msg':'Edit unsuccessful'}) 
            }else{
                await Usermodel.findByIdAndUpdate({_id:decoded.user_id},{profile,name,bio,phone,email,password:hash})
                res.send({'msg':'Edit successful'})
            }
        });
    }catch(err){
        console.log(err)
        res.send({'msg':'Edit unsuccessful'})
    }
})

module.exports={userRouter}






// {
//     "profile":"https://tse1.mm.bing.net/th?id=OIP.rmim2jYzNpSCslo60INohQHaF9&pid=Api&rs=1&c=1&qlt=95&w=153&h=123",
//     "name":"Manoj",
//     "bio":"Web developer",
//     "phone":58943543,
//     "email":"manoj@gmail.com",
//     "password":"manoj@12"
//   }