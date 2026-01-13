// Basic Authentication and Role-based Redirection
const express=require("express")
const session=require("express-session")
const fs=require("fs")
const app=express()
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:"dhfxrfg4y25452"
}))
app.use(express.urlencoded({extended:true}))
function auth()
{
    return (req,res,next)=>
    {
    if(req.session.user)
        next()
    else
        res.send("Acess denied")
   }
}
app.get('/',(req,res)=>
{
    res.send(`<form action="/login" method="post">
        UserName:<input type="text" name="username"><br>
        Password:<input type="text" name="password"><br>
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/login',(req,res)=>
{
   let {username,password}=req.body
   fs.readFile(__dirname+'/user.json','utf-8',(err,data)=>
{
    if(err)
        res.send(err)
    else
    {
        data=JSON.parse(data)
        let user=data.find(val=>val.username==username&&val.password==password)
        if(!user)
            res.send("User not exist")
        else
        {
            if(user.role=='user')
            {
            req.session.user={
                username:user.username,
                LoginTimestamp:new Date().toLocaleString(),
                role:user.role
            }
            res.redirect('/userPage')
            }
            else
            {
                req.session.user={
                username:user.username,
                LoginTimestamp:new Date().toLocaleString(),
                role:user.role
            }
            res.redirect('/adminPage')
            }
        }
    }
})
})
app.get('/userPage',auth(),(req,res)=>
{
    res.send("Welcome User")
})
app.get('/adminPage',auth(),(req,res)=>
{
    res.send("Welcome admin")
})
app.listen(5000,()=>
{
    console.log("server")
})
//
//Session Persistence and Profile Access
//
const express=require("express")
const session=require("express-session")
const fs=require("fs")
const app=express()
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:"dhfxrfg4y25452"
}))
app.use(express.urlencoded({extended:true}))
function auth()
{
    return (req,res,next)=>
    {
    if(req.session.user)
        next()
    else
        res.redirect("/login")
   }
}
app.get('/',(req,res)=>
{
    res.send(`<form action="/login" method="post">
        UserName:<input type="text" name="username"><br>
        Password:<input type="text" name="password"><br>
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/login',(req,res)=>
{
   let {username,password}=req.body
   fs.readFile(__dirname+'/user.json','utf-8',(err,data)=>
{
    if(err)
        res.send(err)
    else
    {
        data=JSON.parse(data)
        let user=data.find(val=>val.username==username&&val.password==password)
        if(!user)
            res.send("User not exist")
        else
        {
            req.session.user={
                username:user.username,
                LoginTimestamp:new Date().toLocaleString(),
                role:user.role
            }
            res.redirect('/profilePage')
        }
            
    }
})
})
app.get('/profilePage',auth(),(req,res)=>
{
    res.send(`${req.session.user.username}    ${req.session.user.LoginTimestamp}   ${req.sessionID}`)
})
app.listen(5000,()=>
{
    console.log("server")
})
//
//Session Expiration and Cleanup
//
const express=require("express")
const session=require("express-session")
const fs=require("fs")
const app=express()
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:"dhfxrfg4y25452",
    cookie:{
        maxAge:1*60*1000
    }
}))
app.use(express.urlencoded({extended:true}))
function auth()
{
    return (req,res,next)=>
    {
    if(req.session.user)
        next()
    else
        res.redirect("/")
   }
}

app.get('/',(req,res)=>
{
    res.send(`<form action="/login" method="post">
        UserName:<input type="text" name="username"><br>
        Password:<input type="text" name="password"><br>
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/login',(req,res)=>
{
   let {username,password}=req.body
   fs.readFile(__dirname+'/user.json','utf-8',(err,data)=>
{
    if(err)
        res.send(err)
    else
    {
        data=JSON.parse(data)
        let user=data.find(val=>val.username==username&&val.password==password)
        if(!user)
            res.send("User not exist")
        else
        {
            req.session.user={
                username:user.username,
                LoginTimestamp:new Date().toLocaleString(),
                role:user.role
            }
            res.redirect('/profilePage')
        }
            
    }
})
})
app.get('/profilePage',auth(),(req,res)=>
{
    res.send(`${req.session.user.username}    ${req.session.user.LoginTimestamp}   ${req.sessionID}`)
})
app.listen(5000,()=>
{
    console.log("server")
})