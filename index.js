require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const courseRouter = require("./routes/course.router")
const studentRouter = require("./routes/student.router")
const errorHandler = require("./middleware/errorHandler")

const app = express()

// middleware
app.use(express.json())

// Routes
app.use("/api/courses", courseRouter)
app.use("/api/students", studentRouter)

// handle unknown routes (404)
app.use((req, res, next) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

// central error handling middleware
app.use(errorHandler)

// connect to database and start server
const PORT = process.env.PORT || 3000

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})