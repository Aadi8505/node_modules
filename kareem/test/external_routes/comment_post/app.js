const express = require('express');
const app = express();
const post = require('./post.js')
const comment = require('./comment.js')

app.use(express.urlencoded())
app.use('/api',post)
app.use('/api',comment)
app.listen(3000, () => {
    console.log("server started at http://localhost:3000")
})