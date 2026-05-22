const express = require("express")
const router = express.Router()
const pool = require("../db")

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        posts.*,
        users.nickname AS author
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      `
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "게시글 조회 실패"
    })
  }
})

router.post("/", async (req, res) => {
  try {
    const { user_id, title, content, category } = req.body

    const result = await pool.query(
      `
      INSERT INTO posts
      (user_id, title, content, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [user_id, title, content, category]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "게시글 생성 실패"
    })
  }
})

module.exports = router