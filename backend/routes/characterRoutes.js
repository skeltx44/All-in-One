const express = require("express")
const router = express.Router()

const character = require("../data/characters")

router.get("/", (req, res) => {
  res.json(character)
})

module.exports = router