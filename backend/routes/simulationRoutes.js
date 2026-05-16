const express = require("express")
const router = express.Router()

const simulationExampleResult = require("../data/simulations")

router.post("/", (req, res) => {
  const { question } = req.body

  res.json({
    ...simulationExampleResult,
    question,
  })
})

module.exports = router