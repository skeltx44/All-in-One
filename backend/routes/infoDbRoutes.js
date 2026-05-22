const express = require("express")
const router = express.Router()
const pool = require("../db")

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM info_items
      ORDER BY deadline ASC
      `
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "정보 조회 실패" })
  }
})

module.exports = router