import jwt from "jsonwebtoken"
import 'dotenv/config'

const verifyToken = (req, res, next) => {
    
    // The token will be sent by the client to the server through the authorization request header
    const authHeader = req.headers["authorization"]

    // // Splitting "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).send("Access Denied: No token provided")
    }

    try {
        // Token verification
        const verified = jwt.verify(token, process.env.JWT_SECRET)

        // Attaching the user data to the request object for later use
        req.user = verified;

        // Moving to the next function
        next()
    }catch(error) {
        res.status(401).send("Unauthorized!!!")
    }
}

export default verifyToken