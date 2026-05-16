const express = require("express")
const cors = require("cors")

const postRoutes = require("./routes/postRoutes")
const userRoutes = require("./routes/userRoutes")
const infoRoutes = require("./routes/infoRoutes")
const characterRoutes = require("./routes/characterRoutes")
const simulationRoutes = require("./routes/simulationRoutes")

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend server is running")
})

app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)
app.use("/api/infoItems", infoRoutes)
app.use("/api/characters", characterRoutes)
app.use("/api/simulations", simulationRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})