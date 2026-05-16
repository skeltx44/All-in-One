const express = require("express")
const router = express.Router()

const posts = require("../data/posts")

router.get("/", (req, res) => {
  res.json(posts)
})

router.post("/", (req, res) => {
  const { title, tags, content } = req.body

  const newPost = {
    id: Date.now(),
    title,
    content,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    author: "나",
    date: new Date().toLocaleDateString("ko-KR"),
    likes: 0,
    comments: 0,
  }

  posts.unshift(newPost)

  res.status(201).json(newPost)
})

module.exports = router