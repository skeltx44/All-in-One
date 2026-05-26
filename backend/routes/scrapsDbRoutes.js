const express = require("express")
const router = express.Router()
const pool = require("../db")

router.post("/", async (req, res) => {
  try {
    const { user_id, info_item_id } = req.body

    const result = await pool.query(
      `
      INSERT INTO scraps
      (user_id, info_item_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [user_id, info_item_id]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)

    if (err.code === "23505") {
      return res.status(409).json({
        error: "이미 저장된 정보입니다"
      })
    }

    res.status(500).json({
      error: "스크랩 저장 실패"
    })
  }
})

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const result = await pool.query(
      `
      SELECT
        scraps.id,
        scraps.created_at,
        info_items.*
      FROM scraps
      JOIN info_items
      ON scraps.info_item_id = info_items.id
      WHERE scraps.user_id = $1
      ORDER BY scraps.created_at DESC
      `,
      [userId]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "스크랩 조회 실패"
    })
  }
})

router.delete("/:userId/:infoItemId", async (req, res) => {
  try {
    const { userId, infoItemId } = req.params

    await pool.query(
      `
      DELETE FROM scraps
      WHERE user_id = $1
      AND info_item_id = $2
      `,
      [userId, infoItemId]
    )

    res.json({
      message: "스크랩 삭제 완료"
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      error: "스크랩 삭제 실패"
    })
  }
})

module.exports = router