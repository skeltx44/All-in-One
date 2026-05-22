const express = require("express")
const router = express.Router()
const pool = require("../db")

const selectUserFields = `
  id,
  email,
  nickname,
  created_at,
  updated_at
`

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ${selectUserFields}
      FROM users
      ORDER BY id ASC
    `)

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "유저 조회 실패" })
  }
})

router.post("/", async (req, res) => {
  try {
    const { email, password, nickname } = req.body

    if (!email || !password || !nickname) {
      return res.status(400).json({ error: "필수 항목이 누락되었습니다." })
    }

    const userResult = await pool.query(
      `
      INSERT INTO users (email, password_hash, nickname)
      VALUES ($1, $2, $3)
      RETURNING ${selectUserFields}
      `,
      [email, password, nickname]
    )

    const newUser = userResult.rows[0]

    await pool.query(
      `
      INSERT INTO characters (user_id, level, exp, badge)
      VALUES ($1, $2, $3, $4)
      `,
      [newUser.id, 1, 0, "starter"]
    )

    await pool.query(
      `
      INSERT INTO user_careers (user_id, selected_career, interest_field, goal)
      VALUES ($1, $2, $3, $4)
      `,
      [newUser.id, null, null, null]
    )

    res.status(201).json(newUser)
  } catch (err) {
    console.error(err)

    if (err.code === "23505") {
      return res.status(409).json({ error: "이미 가입된 이메일입니다." })
    }

    res.status(500).json({ error: "유저 생성 실패" })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." })
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "존재하지 않는 이메일입니다." })
    }

    const user = result.rows[0]

    if (user.password_hash !== password) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." })
    }

    res.json({
      message: "로그인 성공",
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "로그인 실패" })
  }
})

module.exports = router