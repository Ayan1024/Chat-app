import mongoose from "mongoose"



export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`MONGODB CONNECTED: ${conn.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error:", error)
    }
}