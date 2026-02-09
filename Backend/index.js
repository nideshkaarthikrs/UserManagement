import express from "express"
import connectDB from "./config/db.js"
import verifyToken from "./middleware/auth.js"

//Importing routes:
import authRoutes from './routes/auth.js'

const app = express()
const PORT = 3001

// Middlewares:
// Middleware to parse JSON into JS object
app.use(express.json())


//API Routes:
app.use("/api", authRoutes)


// Connecting to MongoDB
connectDB()


// Sample protected route
app.get('/me', verifyToken, (req, res) => {
    const userInfo = req.user
    return res.json(userInfo)
})

// Listening to port
app.listen(PORT, () => {
    console.log("Server listening at port", PORT)
})