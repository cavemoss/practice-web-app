import jsonwebtoken from 'jsonwebtoken'
import Response from './response.js'
import dotenv from 'dotenv'

dotenv.config()

export default function verifyUser(request, response, next) {

    const token = request.cookies.session

    if(!token) next()
    else {
        jsonwebtoken.verify(token, process.env.JWT_KEY, 

            (error, decoded) => {
                if (error) response.send(new Response(500, 'Internal Server Error'))  // new Response
                else {
                    request.payload = decoded.payload
                    next()
                }
            }
        )
    }
}

export function jwtSession(request, response, next) {

    const token = request.cookies.sign_up_session

    if(!token) response.send(new Response(400, 'Bad Request', 'JSON web token missing'))  // new Response
    else {
        jsonwebtoken.verify(token, process.env.JWT_KEY, 

            (error, decoded) => {
                if (error) response.send(new Response(500, 'Internal Server Error'))  // new Response
                else {
                    request.payload = decoded.payload
                    next()
                }
            }
        )
    }
}

export function pwdReset(request, response, next) {

    const token = request.cookies.pwd_reset_session

    if(!token) response.send(new Response(400, 'Bad Request', 'JSON web token missing'))  // new Response
    else {
        jsonwebtoken.verify(token, process.env.JWT_KEY, 

            (error, decoded) => {
                if (error) response.send(new Response(500, 'Internal Server Error'))  // new Response
                else {
                    request.payload = decoded.payload
                    next()
                }
            }
        )
    }
}

export function decodeJwt(request, response, next) {

    const token = request.query.token

    if(!token) response.send(new Response(400, 'Bad Request', 'JSON web token missing'))  // new Response
    else {
        jsonwebtoken.verify(token, process.env.JWT_KEY, 

            (error, decoded) => {
                if (error) response.send(new Response(500, 'Internal Server Error'))  // new Response
                else {
                    request.payload = decoded.payload
                    next()
                }
            }
        )
    }
}
