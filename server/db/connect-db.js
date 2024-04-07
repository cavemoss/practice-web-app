import mongoose from "mongoose"

async function connectDB(databaseURL) {
    const defaultURL = 'mongodb://localhost:27017'
    try {
        await mongoose.connect(databaseURL || defaultURL)
        console.log(`Database connected. ${databaseURL || defaultURL} `)
    } catch(error) {
        console.log(error)
    }
}

export default connectDB