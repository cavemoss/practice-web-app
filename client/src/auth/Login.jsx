import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EMAIL_REG } from "./Register.jsx"
import eyeOpened from '../assets/icons/eye-svgrepo-com.svg'
import eyeClosed from '../assets/icons/eye-off-svgrepo-com.svg'
import css from '../assets/styles/auth.module.css'
import axios from 'axios'

export default function Login(){

    const navigate = useNavigate()
    const { email } = useParams()
    const inputRef = useRef()

    const [emailError, setEmailError] = useState({inputFieldError: null, errorMessage: ''})
    const [passwordError, setPasswordError] = useState({inputFieldError: null, errorMessage: ''})
    const [toggle, setToggle] = useState(eyeOpened)

    const [userInput, setUserInput] = useState({
        email: null,
        password: null,
    })

    function toggleHidePassword() {
        const passwordInput = document.querySelectorAll('#pwd')
        
        if(toggle == eyeOpened) { 
            passwordInput.forEach(element => element.setAttribute('type', 'text'))
            setToggle(eyeClosed)
        }
        else if(toggle == eyeClosed) {
            passwordInput.forEach(element => element.setAttribute('type', 'password'))
            setToggle(eyeOpened)
        }
    }

    function onChangeEmail(event) {setUserInput({...userInput, email: event.target.value})}
    useEffect(() => setEmailError({inputFieldError: null, errorMessage: ''}), [userInput.email])

    function onChangePassword(event) {setUserInput({...userInput, password: event.target.value})}
    useEffect(() => setPasswordError({inputFieldError: null, errorMessage: ''}), [userInput.password])

    useEffect(() => {
        if(email) {
            inputRef.current.value = email
            setEmailError({inputFieldError: css.inputFieldNotification, errorMessage: `Email successfully verified`})
        }
    }, [])

    async function handleSubmit(event){
        event.preventDefault()

        if(email) setUserInput({...userInput, email: email})

        else if(!userInput.email) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Enter email`})
            return
        }

        else if (!EMAIL_REG.test(userInput.email)) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Invalid email`})
            return
        }

        if(!userInput.password) {
            setPasswordError({inputFieldError: css.inputFieldError, errorMessage: `Enter password`})
            return
        }

        let response = await axios.post('/backend/auth/login', {
            email: userInput.email || email,
            password: userInput.password
        }); response = response.data

        if(response.message) {   
            if(response.statusCode === 404) setPasswordError({inputFieldError: css.inputFieldError, errorMessage: 'Wrong password'})
            else if(response.statusCode === 401) setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Email is not verified. Please Sign Up and verify email`})
            else alert(response.httpStatus)
        } else {
            navigate('/posts')
        }
    }

    return(
        <>
            <div className={css.card}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>

                    <br />

                    <div id={emailError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangeEmail} placeholder=" " ref={inputRef}/>
                            <p>email</p>
                        </div>
                        <div className={css.errorMessage}>{emailError.errorMessage}</div>
                    </div>

                    <div id={passwordError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangePassword} type="password" id="pwd" placeholder=" " />
                            <p>password</p>
                            <img src={toggle} onClick={toggleHidePassword} />
                        </div>
                        <div className={css.errorMessage}>{passwordError.errorMessage}</div>
                    </div>

                    <button type="submit">Login</button>
                    <p className={css.reset} onClick={() => navigate('/login/reset-password')}><span>reset password</span></p>

                    <div className={css.hints}>
                        <p>Sign up <span className={css.link} onClick={() => navigate('/sign-up')}>here</span></p>
                        <p>Proceed as a <span className={css.link} onClick={() => navigate('/posts')}>guest</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}