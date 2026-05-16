const express = require("express")
const router = express.Router()

const infoItems = require("../data/infoItems")

router.get("/", (req, res) => {
  res.json(infoItems)
})

module.exports = router