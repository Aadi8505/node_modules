const express = require('express')
const ejs = require('ejs');
const app = express();

app.set("view engine", "ejs")
app.set("views", __dirname + "/view")

let errData = {
    // {
        // errorType: "VALIDATION",
        // statusCode: 422,
        // message: "Please check your form inputs",
        // timestamp: Date.now(),
        // requestUrl: '/notValid'
    // },
    // {
        errorType: "NOT_FOUND" ,
        statusCode: 404,
        message: "Page not found",
        timestamp: Date.now(),
        requestUrl: '/pageNotFound'
    // },
    // {
    //     errorType: "SERVER_ERROR",
    //     statusCode: 500,
    //     message: "Internal server error",
    //     timestamp: Date.now(),
    //     requestUrl: "/intenalServerError"
    // }
}

app.get("/",(req,res)=>{
  res.render("error-layout",{errData})
})

app.listen(3000)