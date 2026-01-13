const express=require('express')
const fs=require('fs')
const path=require('path')
const router=express.Router()

router.get('/product',(req,res)=>
{
     fs.readFile(path.join(__dirname,"../product.json"),'utf-8',(err,data)=>
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

router.get('/product/:category/:id',(req,res)=>
{
     let {category,id}=req.params
       fs.readFile(path.join(__dirname,"../product.json"),'utf-8',(err,data)=>
    {
        if(err)
            res.send(err)
        else
        {
            data=JSON.parse(data)
            let product=data.find(val=>val.productId==id&&val.productCategory==category)
            if(!product)
                res.status(404).json({message:"post not found"});
            res.json(product)
        }
    })  
})

module.exports=router