// multiple file uploads in multer
const { error } = require("console")
const express=require("express")
const multer = require("multer")
const path=require("path")
const app=express()
const storage=multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,__dirname+'/uploads/gallery')
    },
    filename:(req,file,cb)=>
    {
        cb(null,Date.now()+'.jpg')
    }
})
const filter=(req,file,cb)=>
{
    const ext=path.extname(file.originalname).toLowerCase()
    if(ext==='.png'||ext==='.jpg'||ext==='.jpeg')
        cb(null,true)
    else
        cb(new Error("Only .png and .jpg files are allowed"),false)
}
const upload=multer({storage:storage,fileFilter:filter})
app.get('/',(req,res)=>
{ 
    res.send(`<form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="image" multiple>
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/upload',upload.array("image",5),(req,res)=>
{
    let imageArr=[];
    req.files.forEach((val)=>
    {
        imageArr.push(val.originalname) 
    })
   res.send(`${imageArr}`) 
})
app.listen(3000,()=>
{
    console.log("server started");
})

// store data in json
const express=require("express")
const multer=require("multer")
const path=require("path")
const fs=require('fs')
const app=express()
app.use(express.urlencoded({extended:true}))
const storage=multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,__dirname+'/uploads/resumes')
    },
    filename:(req,file,cb)=>
    {
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const fileFilter=(req,file,cb)=>
{
   let ext=path.extname(file.originalname).toLowerCase()
   if(ext==='.pdf')
    cb(null,true)
   else
    cb(new Error("Only pdf required"),false)
}

const upload=multer({storage:storage,fileFilter:fileFilter})
app.get('/',(req,res)=>
{
    res.send(`<form action="upload" method="post" enctype="multipart/form-data">
        Name:<input type="text" name="name"><br>
        Email:<input type="text" name="email"><br>
        Contact<input type="tel" name="contact"><br>
        <input type="file" name="resume"><br>
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/upload',upload.single("resume"),(req,res)=>
{
    let {name,email,contact}=req.body
    fs.readFile(__dirname+'/users.json','utf-8',(err,data)=>
    {
        if(err)
            res.send(err)
        else
        {
            data=JSON.parse(data)
            let newUser={
                name:name,
                email:email,
                contact:contact,
                resume:req.file
            }
            data.push(newUser)
            fs.writeFile(__dirname+'/users.json',JSON.stringify(data),(err)=>
            {
                if(err)
                    res.send(err)
                else
                    res.json(newUser);
            })
        }
    })
})
app.listen(5000,()=>
{
    console.log("server")
})

//file size and type validation
const express=require("express")
const multer = require("multer")
const path=require("path")
const app=express()
const storage=multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,__dirname+'/uploads/products')
    },
    filename:(req,file,cb)=>
    {
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const filter=(req,file,cb)=>
{
    const ext=path.extname(file.originalname).toLowerCase()
    if(ext==='.png'||ext==='.jpg')
        cb(null,true)
    else
        cb(new Error("Only .png and .jpg files are allowed"),false)
}
const upload=multer({storage:storage,fileFilter:filter,limits:{fileSize:2*1024*1024}})
app.get('/',(req,res)=>
{ 
    res.send(`<form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="image">
        <button type="submit">Submit</button>
        </form>`)
})
app.post('/upload',upload.single("image"),(req,res)=>
{
   res.send(`${req.file.path} ${req.file.size}`) 
})
app.listen(5000,()=>
{
    console.log("server started");
})
