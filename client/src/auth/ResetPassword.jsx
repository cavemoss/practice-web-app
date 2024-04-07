import { useEffect, useState, useRef } from "react"
import css from '../assets/styles/auth.module.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {

    const navigate = useNavigate()

    const submitRef = useRef()

    const inputRef = useRef()

    const EMAIL_REG =  /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/

    const [emailError, setEmailError] = useState({inputFieldError: null, errorMessage: ''})

    const [userInput, setUserInput] = useState({email: null})

    function onChangeEmail(event) {setUserInput({...userInput, email: event.target.value})}
    useEffect(() => setEmailError({inputFieldError: null, errorMessage: ''}), [userInput.email])

    async function handleSubmit(event) {
        event.preventDefault()

        if(!userInput.email) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Enter email`})
            return
        }

        else if (!EMAIL_REG.test(userInput.email)) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Invalid email`})
            return
        }

        let response = await axios.post('/backend/auth/login/reset-password', {email: userInput.email})
        response = response.data

        if(response.message) {   
            if(response.statusCode === 404) setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Account with this email address doesn't exist`})
            else alert(response.httpStatus)
        } else {
            setEmailError({inputFieldError: css.inputFieldNotification, errorMessage: `We've sent the password reset link to this email address`})
            submitRef.current.style.display = 'none'
            inputRef.current.style.pointerEvents = 'none'
        }
    }

    return(
        <>
            <div className={css.card}>
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>

                    <br />

                    <div id={emailError.inputFieldError} ref={inputRef}>
                        <div className={css.inputField}>
                            <input onChange={onChangeEmail} placeholder=" " />
                            <p>email address</p>
                        </div>
                        <div className={css.errorMessage}>{emailError.errorMessage}</div>
                    </div>

                    <button type="submit" ref={submitRef}>Reset Password</button>

                    <div className={css.hints}>
                        <p>Login <span className={css.link} onClick={() => navigate('/login')}>here</span></p>
                        <p>Proceed as a <span className={css.link} onClick={() => navigate('/wild')}>guest</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}