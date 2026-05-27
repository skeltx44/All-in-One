const express = require("express")
const router = express.Router()
const pool = require("../db")

const getLevelByExp = (exp) => {
  if (exp >= 50) return 3
  if (exp >= 20) return 2
  return 1
}

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

    const postResult = await pool.query(
      `
      INSERT INTO posts
      (user_id, title, content, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [user_id, title, content, category]
    )

    await pool.query(
      `
      INSERT INTO character_activities
      (user_id, activity_type, description, exp_amount)
      VALUES ($1, $2, $3, $4)
      `,
      [user_id, "post", "게시글 작성", 5]
    )

    const currentResult = await pool.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [user_id]
    )

    const current = currentResult.rows[0]

    if (current) {
      const newExp = current.exp + 5
      const newLevel = getLevelByExp(newExp)

      await pool.query(
        `
        UPDATE characters
        SET
          exp = $1,
          level = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3
        `,
        [newExp, newLevel, user_id]
      )
    }

    res.status(201).json({
      post: postResult.rows[0],
      exp: current
        ? {
            exp_gained: 5,
            previous_level: current.level,
            new_level: getLevelByExp(current.exp + 5),
            leveled_up: getLevelByExp(current.exp + 5) > current.level,
          }
        : null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "게시글 생성 실패"
    })
  }
})

module.exports = router