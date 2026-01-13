const express = require('express')

const router = express.Router()

const comments = [
  { id: 101, postId: 1, author: "Alice", content: "Great post!" },
  { id: 102, postId: 1, author: "Bob", content: "Thanks for sharing." },
  { id: 103, postId: 2, author: "Charlie", content: "I found this really helpful." },
  { id: 104, postId: 3, author: "Dave", content: "Interesting thoughts." }
];

router.get('/comments', (req, res) => {
    res.json(comments)
})

router.get('/comments/:comment', (req, res) => {
     const id = req.params.comment;  
    const comment = comments.find(u => u.id == id);
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ message: "Comment not found" });
    }
})

module.exports = router