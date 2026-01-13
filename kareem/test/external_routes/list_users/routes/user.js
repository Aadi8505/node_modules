const express=require("express")
const fs=require("fs")
const path=require("path")
const router=express.Router();

router.get('/users',(req,res)=>
{
   fs.readFile(path.join(__dirname,"../users.json"),'utf-8',(err,data)=>
{
    if(err)
        res.send(err)
    else
    {
        data=JSON.parse(data)
        res.json(data)
    }
})
})
router.get('/users/:id',(req,res)=>
{
    let {id}=req.params
   fs.readFile(path.join(__dirname,"../users.json"),'utf-8',(err,data)=>
{
    if(err)
        res.send(err)
    else
    {
        data=JSON.parse(data)
        let user=data.find(val=>val.userId==id)
        res.json(user)
    }
})  
})
module.exports=router