const express = require("express")
const router = express.Router()
const pool = require("../db")

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      "SELECT * FROM user_careers WHERE user_id = $1",
      [userId]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "진로 정보 조회 실패" })
  }
})

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      selected_career,
      interest_field,
      goal,
    } = req.body

    const result = await pool.query(
      `
      INSERT INTO user_careers
      (user_id, selected_career, interest_field, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [user_id, selected_career, interest_field, goal]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "진로 정보 생성 실패" })
  }
})

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const { selected_career, interest_field, goal } = req.body

    const result = await pool.query(
      `
      UPDATE user_careers
      SET
        selected_career = $1,
        interest_field = $2,
        goal = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $4
      RETURNING *
      `,
      [selected_career, interest_field, goal, userId]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "진로 정보 수정 실패" })
  }
})

module.exports = router