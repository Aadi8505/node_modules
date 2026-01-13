const express = require('express')

const router = express.Router()

const posts = [
  { id: 1, title: "First Post", content: "This is the content of the first post." },
  { id: 2, title: "Second Post", content: "Here goes the content of the second post." },
  { id: 3, title: "Third Post", content: "Insights and stories from the third post." }
];

router.get('/post', (req, res) => {
    res.json(posts)
})

router.get('/post/:postId', (req, res) => {
     const id = req.params.postId;  
    const post = posts.find(u => u.id == id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: "post not found" });
    }
})

module.exports = router