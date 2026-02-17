import express from "express"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config';
import upload from "../middleware/upload.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router()

router.post('/register', upload.single("profileFile"), async (req, res) => {
    
    let { username, firstname, lastname, password, email, mobile } = req.body

    let file = req.file

    if (!username || !firstname || !lastname || !password || !email || !mobile || !file) {
        return res.status(400).send("All fields are required")
    }

    let profileFile = file.path

    try {
        // Hashing the password using bcrypt before storing it in DB
        let saltRounds = 10
        password = await bcrypt.hash(password, saltRounds)
        const newUser = await User.create({ username, firstname, lastname, password, email, mobile, profileFile })
        // console.log("User saved successfully:", newUser._id);
        return res.status(201).send("User Created")
    }catch(error) {
        if (error.code === 11000) {
            return res.status(409).send("Duplicate username or email or mobile")
        }
        return res.status(500).send(`Internal Server Error`)
    }

})


router.post('/login', async (req, res) => {
    try {
            const { username, password } = req.body
            if (!username || !password) {
                return res.status(400).send("All fields are required")
            }
            const user = await User.findOne({username})
            if (!user) {
                return res.status(401).send("User not found")
            }
            let isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).send("Wrong password")
            }
            // Since the password matches we are gonna generate JWT and return it
            const payload = {
                userId: user._id,
                username: user.username,
                mobile: user.mobile
            }
            const secret = process.env.JWT_SECRET
            const options = {expiresIn: "1h"}
            const token = jwt.sign(payload, secret, options)
            return res.json({"token":token})
    }catch(error) {
            return res.status(500).send(`Internal Server Error`)
    }
})

router.get('/download-profile', verifyToken , async (req, res) => {
    let user = await User.findById(req.user.userId)
    if (!user) {
        return res.status(404).send("User not found!")
    }
    if (!user.profileFile) {
        return res.status(404).send("File not found!")
    }
    res.download(user.profileFile)
})

export default router