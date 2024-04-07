import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import connectDB from './db/connect-db.js'
import auth from './routes/auth.js'
import pages from './routes/pages.js'
import media from './routes/media.js'


const app = express()
app.use(bodyParser.json({ limit: '1gb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/backend/auth', auth)
app.use('/backend/pages', pages)
app.use('/backend/media', media)

dotenv.config()
export const PORT = process.env.PORT || 8080
const databaseURL = process.env.DATABASE_URL

connectDB(databaseURL)
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PWD,
    }
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))