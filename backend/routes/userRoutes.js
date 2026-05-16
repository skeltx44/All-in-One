const express = require("express")
const router = express.Router()

const user = require("../data/users")

router.get("/", (req, res) => {
  res.json(user)
})

router.put("/", (req, res) => {
  const { nickname, career, interests, goal, level, savedItems } = req.body

  if (nickname !== undefined) user.nickname = nickname
  if (career !== undefined) user.career = career
  if (interests !== undefined) user.interests = interests
  if (goal !== undefined) user.goal = goal
  if (level !== undefined) user.level = level
  if (savedItems !== undefined) user.savedItems = savedItems

  res.json(user)
})

module.exports = router