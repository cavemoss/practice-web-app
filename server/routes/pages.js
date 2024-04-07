import express from 'express'
import mongoose from 'mongoose'
import Response from '../middleware/response.js'
import verifyUser from '../middleware/session.js'
import UserModel, { selectUser } from '../db/models/user-model.js'
import PostModel, { selectPost } from '../db/models/post-model.js'
import { selectComment } from '../db/models/comment-model.js'
const ObjectId = mongoose.Types.ObjectId
const pages = express.Router()

pages.get('/get-user', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        response.send(new Response(200, 'OK', null, user))
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method GET
 * @desc placeholder description
 */
pages.get('/populate-wild', async (request, response) => {

    try{
        const posts = await PostModel.find() 
        const people = await UserModel.find()

        response.send(new Response(200, 'OK', null, {  // new Response
            posts: posts.reverse() || [],
            people: people.reverse() || []
        }))  

    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/get-profile', async (request, response) => {

    try{
        const user = await selectUser({username: request.query.username})
        response.send(new Response(200, 'OK', null, user))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})



pages.get('/populate-post', async (request, response) => {

    try{
        const post = await selectPost(request.query.id)
        response.send(new Response(200, 'OK', null, post))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/populate-profile', async (request, response) => {

    try{
        const op = await selectUser({username: request.query.username})
        const posts = op.posts.reverse()
        response.send(new Response(200, 'OK', null, posts))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/follow', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})

        console.log(request.query.action)
        if(request.query.action == 'follow') await user.follow({username: request.query.username})
        else if(request.query.action == 'unfollow') await user.unfollow({username: request.query.username})

        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
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

pages.post('/create-new-reference', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.repost(new ObjectId(request.query.id), {body: request.body.body})
        response.send(new Response(201, 'Created'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/get-post', async (request, response) => {

    try{
        const post = await selectPost(request.query.id)
        response.send(new Response(200, 'OK', null, post))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.get('/populate-comment', async (request, response) => {
    
    try{
        const comment = await selectComment(request.query.id)
        response.send(new Response(200, 'OK', null, comment))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.post('/leave-comment', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.comment(new ObjectId(request.query.id), request.body.comment)
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

pages.post('/leave-reply', verifyUser, async (request, response) => {

    try{
        const user = await selectUser({username: request.payload.username})
        await user.reply(new ObjectId(request.query.id), request.body.reply)
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

pages.delete('/delete-ownerless-post', async(request, response) => {

    try{
        await PostModel.deleteOne({_id: new ObjectId(request.query.id)})
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

export default pages