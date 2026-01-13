const express=require("express")
const router=require('./routes/user')
const app=express()

app.use('/api',router)

app.listen(5000,()=>
{
    console.log("server started")
})