const express = require("express")
const cors = require("cors")

const simulationRoutes = require("./routes/simulationRoutes")
const usersDbRoutes = require("./routes/usersDbRoutes")
const charactersDbRoutes = require("./routes/charactersDbRoutes")
const userCareersDbRoutes = require("./routes/userCareersDbRoutes")
const postsDbRoutes = require("./routes/postsDbRoutes")
const infoDbRoutes = require("./routes/infoDbRoutes")

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend server is running")
})

app.use("/api/simulations", simulationRoutes)
app.use("/api/db/users", usersDbRoutes)
app.use("/api/db/characters", charactersDbRoutes)
app.use("/api/db/user-careers", userCareersDbRoutes)
app.use("/api/db/posts", postsDbRoutes)
app.use("/api/db/info-items", infoDbRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})