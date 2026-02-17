import express from "express"
import connectDB from "./config/db.js"
import verifyToken from "./middleware/auth.js"

//Importing routes:
import authRoutes from './routes/auth.js'
import User from "./models/User.js"

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
app.get('/me', verifyToken, async (req, res) => {
    const userId = req.user.userId

    const userData = await User.findById(userId).select("-password -__v")

    if (!userData) {
        return res.status(404).send("User not found")
    }

    return res.json(userData)
})

// Listening to port
app.listen(PORT, () => {
    console.log("Server listening at port", PORT)
})