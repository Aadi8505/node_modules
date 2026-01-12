// static route based on query
const express = require('express');
const app = express();
app.get("/greet", (req, res) => {
    const queri = req.query.lang
    
    if(queri == 'fr') {
        res.send("Bonjour")
    } else if(queri == 'hi') {
        res.send("Namaste")
    } 
    res.send("Hello")
})
app.listen(3000, () => {
    console.log("server started at http://localhost:3000/greet")
})

// month/yr wise dynamic routing
const express = require("express");
const app = express();
const PORT = 3000;
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
app.get("/blog/:year/:month/:slug", (req, res) => {
  const { year, month, slug } = req.params;
  const monthIndex = parseInt(month, 10) - 1;
  const monthName = months[monthIndex];
  res.send(`Viewing blog post: "${slug}"<br>Published: ${monthName}, ${year}`);
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// dynamic route to display user profile
const express = require('express');
const app = express();
const users = [
    { id: '101', name: 'Alice', age: 25 },
    { id: '102', name: 'Bob', age: 30 },
    { id: '103', name: 'Charlie', age: 22 }
];
app.get('/user/:id', (req, res) => {
     const id = req.params.id;  
    const user = users.find(u => u.id == id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
})
app.listen(3000, () => {
    console.log("server started at http://localhost:3000/user/106")
})