import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import { GridFsStorage } from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import verifyUser from '../middleware/session.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { selectUser } from '../db/models/user-model.js'

dotenv.config()
const media = express.Router()


let gfs, gridFsBucket
let connection = mongoose.connection

connection.once('open', () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(connection.db, {bucketName: 'uploads'})
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
})

let storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (request, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) return reject(err)
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})

let upload = multer({ storage })


media.post('/post', verifyUser, upload.single('file'), async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.post({
            body: request.body.text, 
            video: `http://localhost:8000/backend/media/file/${request.file.filename}`
        })
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

media.get('/video/:filename', async (request, response) => {
    const file = await gfs.files.findOne({ filename: request.params.filename });
    const readstream = gridFsBucket.openDownloadStream(file._id)
    readstream.pipe(response)
})


export default media