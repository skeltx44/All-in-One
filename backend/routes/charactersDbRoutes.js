const express = require("express")
const router = express.Router()
const pool = require("../db")

const getLevelByExp = (exp) => {
  if (exp >= 50) return 3
  if (exp >= 20) return 2
  return 1
}

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [userId]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "캐릭터 조회 실패" })
  }
})

router.put("/:userId/exp", async (req, res) => {
  try {
    const { userId } = req.params
    const { exp } = req.body

    const currentResult = await pool.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [userId]
    )

    const current = currentResult.rows[0]
    const newExp = current.exp + exp
    const newLevel = getLevelByExp(newExp)

    const result = await pool.query(
      `
      UPDATE characters
      SET
        exp = $1,
        level = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
      RETURNING *
      `,
      [newExp, newLevel, userId]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "경험치 업데이트 실패" })
  }
})

router.post("/:userId/activities", async (req, res) => {
  try {
    const { userId } = req.params
    const { activity_type, description, exp_amount } = req.body

    await pool.query(
      `
      INSERT INTO character_activities
      (user_id, activity_type, description, exp_amount)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, activity_type, description, exp_amount]
    )

    const currentResult = await pool.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [userId]
    )

    const current = currentResult.rows[0]

    const totalExp = current.exp + exp_amount
    const newLevel = getLevelByExp(totalExp)
    const newExp = totalExp

    const updatedResult = await pool.query(
      `
      UPDATE characters
      SET
        exp = $1,
        level = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
      RETURNING *
      `,
      [newExp, newLevel, userId]
    )

    const updatedCharacter = updatedResult.rows[0]

    res.json({
      character: updatedCharacter,
      exp_gained: exp_amount,
      previous_level: current.level,
      new_level: newLevel,
      leveled_up: newLevel > current.level,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "활동 저장 실패" })
  }
})

module.exports = router