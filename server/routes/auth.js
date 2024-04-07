import express from 'express'
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import Response from '../middleware/response.js'
import { jwtSession, decodeJwt, pwdReset } from '../middleware/session.js'
import { createUser, selectUser } from '../db/models/user-model.js'
import { PORT, transporter } from '../server.js'

dotenv.config()
const auth = express.Router()

/**
 * @method POST
 * @desc Handle initial sign up, sign jwt token to open sign up session
 */
auth.post('/sign-up', async (request, response) => {

    try {
        await createUser({
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        })

        // Signing jwt token to open sign up session
        const payload = {username: request.body.username}
        const token = jsonwebtoken.sign({payload}, process.env.JWT_KEY, {expiresIn: '1d'})
        response.cookie('sign_up_session', token)

        response.send(new Response(201, 'Created'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method PUT
 * @desc Make use of the sign up session jwt token and update user document with additional info
 */
auth.put('/sign-up/add-info', jwtSession, async (request, response) => {

    try {
        const user = await selectUser({username: request.payload.username})
        await user.editProfile({bio: request.body.bio, picture: request.body.profilePic})
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method GET
 * @desc Make use of the sign up session jwt token and send email conformation link
 */
auth.get('/sign-up/confirm-email', jwtSession, async (request, response) => {

    try {
        const user = await selectUser({username: request.payload.username})
        response.send(new Response(200, 'OK', null, user))  // new Response

        const payload = {username: request.payload.username}
        const token = jsonwebtoken.sign({payload}, process.env.JWT_KEY, {expiresIn: '1d'})
        try {
            transporter.sendMail({
                from: process.env.AUTH_EMAIL,
                to: user.email,
                subject: 'Confirm Email',
                text: `Click on this link to verify your email: http://localhost:${PORT}/backend/auth/verify?token=${token}`,
            })
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method GET
 * @desc Set user email as verified redirect to login page and terminate sign up session
 */
auth.get('/verify', decodeJwt, async (request, response) => {

    try {   
        const user = await selectUser({username: request.payload.username})
        await user.editProfile({emailVerified: true}) 
        response.cookie = 'sign_up_session=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        response.redirect(process.env.FRONTEND_URL + `/login/${user.email}`)
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Handle user login, sign jwt token to open login session
 */
auth.post('/login', async (request, response) => {

    try {   
        const user = await selectUser({email: request.body.email, password: request.body.password})

        if(!user) response.send(new Response(404, 'Not Found', 'Authentication error'))  // new Response
        else {
            if(user.emailVerified) {
                // Signing jwt token to open a login session
                const payload = {username: user.username}
                const token = jsonwebtoken.sign({payload}, process.env.JWT_KEY, {expiresIn: '1d'})
                response.cookie('session', token) 

                response.send(new Response(200, 'OK'))  // new Response
            } 
            else {
                console.log(user)
                user.deleteProfile()
                response.send(new Response(401, 'Unauthorized', 'Email is not verified'))  // new Response
            } 
        }
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Send password reset link
 */
auth.post('/login/reset-password', async (request, response) => {

    try {
        const user = await selectUser({email: request.body.email})

        if(!user) response.send(new Response(404, 'Not Found', 'Authentication error'))  // new Response
        else {

            const payload = {username: user.username}
            const token = jsonwebtoken.sign({payload}, process.env.JWT_KEY, {expiresIn: '1d'})
            transporter.sendMail({
                from: process.env.AUTH_EMAIL,
                to: user.email,
                subject: 'Password Reset',
                text: `Click on this link to reset password: http://localhost:${PORT}/backend/auth/reset?token=${token}`,
            })

            response.send(new Response(200, 'OK'))  // new Response
        }
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method GET
 * @desc Sign jwt token to open password reset session and redirect to set new password page
 */
auth.get('/reset', decodeJwt, async (request, response) => {

    try {   
        // Signing jwt token to open a password reset session
        const payload = {username: request.payload.username}
        const token = jsonwebtoken.sign({payload}, process.env.JWT_KEY, {expiresIn: '1d'})
        response.cookie('pwd_reset_session', token)

        response.redirect(process.env.FRONTEND_URL + '/login/reset-password/new-password')
        
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

/**
 * @method POST
 * @desc Make use of password reset jwt token session and set new password
 */
auth.post('/set-new-pwd', pwdReset, async (request, response) => {

    try {  
        const user = await selectUser({username: request.payload.username})
        await user.editProfile({password: request.body.password})
        response.cookie = 'pwd_reset_session=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        response.send(new Response(200, 'OK'))  // new Response
    } catch (error) {
        console.log(error)
        response.send(new Response(500, 'Internal Server Error', error))  // new Response
    }
})

export default auth