const express=require('express')
const {connection}=require('./config/db')
const cors=require('cors')
const {userRouter}=require('./routes/user.route')


const app=express()
app.use(express.json())
app.use(cors())
app.use('/user',userRouter)


app.listen(4000,async()=>{
    try{
        await connection
        console.log('Connected to database')
    }catch(err){
        console.log(err)
        console.log('Connecction error')
    }
    console.log('Server running on port 4000')
})