const express= require('express');
const ejs= require('ejs')
const app = express();


app.set("view engine","ejs");
app.set('views',__dirname+"/views");


app.get("/",(req,res)=>{
      res.render("test",
        {
            username:"Abhay",
            isLoggedin: true
        }
      )
})

app.listen(3000,()=>{
    console.log("Server started................")
})