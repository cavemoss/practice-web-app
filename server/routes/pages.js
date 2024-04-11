import express from 'express'
import mongoose from 'mongoose'
import Response from '../middleware/response.js'
import verifyUser from '../middleware/session.js'
import UserModel, { selectUser } from '../db/models/user-model.js'
import PostModel, { selectPost } from '../db/models/post-model.js'
import { selectComment } from '../db/models/comment-model.js'
const ObjectId = mongoose.Types.ObjectId
const pages = express.Router()

pages.get('/fetch-backend-data', verifyUser, async (request, response) => {

    try {
        const user = await selectUser({username: request.payload.username})
        const people = await UserModel.find().sort({created:-1})
        const posts = await PostModel.find().sort({published:-1})
        response.send(new Response(200, 'OK', null, {user, people, posts}))
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))
    }
})

pages.get('/populate-post', async (request, response) => {

    try {
        const post = await selectPost(request.query.id)
        response.send(new Response(200, 'OK', null, post))
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))
    }
})

pages.delete('/delete-post', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.deletePost(new ObjectId(request.query.id))
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.delete('/delete-comment', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.deleteComment(new ObjectId(request.query.id))
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/populate-profile', async (request, response) => {

    try {
        const profile = await selectUser({username: request.query.username})
        response.send(new Response(200, 'OK', null, profile))
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))
    }
})

pages.get('/populate-comment', async (request, response) => {

    try {
        const comment = await selectComment(request.query.id)
        response.send(new Response(200, 'OK', null, comment))
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))
    }
})

pages.put('/like', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.like(new ObjectId(request.query.id))
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.put('/like-comment', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.likeComment(new ObjectId(request.query.id))
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/follow', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})

        if(request.query.action == 'follow') await user.follow({username: request.query.username})
        else if(request.query.action == 'unfollow') await user.unfollow({username: request.query.username})

        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

media.post('/leave-comment', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.comment(request.query.id, request.body.text)
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

media.post('/leave-reply', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.reply(new ObjectId(request.query.id), request.body.text)
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

export default pages