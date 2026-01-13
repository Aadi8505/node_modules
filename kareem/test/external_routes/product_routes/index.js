const express=require("express")
const product=require("./routes/product")
const app=express()

app.use('/api',product)
app.listen(5000,()=>
{
    console.log("server started")
})