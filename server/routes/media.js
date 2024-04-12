import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import Response from '../middleware/response.js'
import { GridFsStorage } from 'multer-gridfs-storage'
import Grid from 'gridfs-stream'
import verifyUser from '../middleware/session.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { selectUser } from '../db/models/user-model.js'

dotenv.config()
const media = express.Router()


// GridFS Multer upload engine configuration
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


/**
 * @method POST
 * @desc Create a post containing plain text
 */
media.post('/new-post', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        const content = {body: request.body.text}

        if(request.query.id) await user.repost(request.query.id, content)
        else await user.post(content)
      
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Create a post containing a video source link
 */
media.post('/new-post-video', verifyUser, upload.single('video'), async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        const content = {
            body: request.body.text, 
            video: `http://localhost:${process.env.PORT}/backend/media/${request.file.filename}`
        }

        if(request.query.id) await user.repost(request.query.id, content)
        else await user.post(content)

        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Create a post containing an array of image source links
 */
media.post('/new-post-images', verifyUser, upload.array('images'), async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})

        let imgArray = []
        for (let i = 0; i < request.files.length; i++) {
            imgArray.push(`http://localhost:${process.env.PORT}/backend/media/${request.files[i].filename}`)
        }

        const content = {
            body: request.body.text, 
            images: imgArray
        }

        if(request.query.id) await user.repost(request.query.id, content)
        else await user.post(content)

        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Provides media source link
 */
media.get('/:filename', async (request, response) => {
    const file = await gfs.files.findOne({ filename: request.params.filename });
    const readstream = gridFsBucket.openDownloadStream(file._id)
    readstream.pipe(response)
})

export default media