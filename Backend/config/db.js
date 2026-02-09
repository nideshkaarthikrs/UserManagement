import mongoose from "mongoose"
import 'dotenv/config';

const connectionString = process.env.MONGO_URI

async function connectDB() {
    try {
        let connection = await mongoose.connect(connectionString)
        console.log("Connected to MongoDB")
    }catch(error) {
        console.error("Connection error: ", error.message)
    }
}

export default connectDB