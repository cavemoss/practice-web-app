import { useEffect, useState, useRef } from "react"
import eyeOpened from '../assets/icons/eye-svgrepo-com.svg'
import eyeClosed from '../assets/icons/eye-off-svgrepo-com.svg'
import css from '../assets/styles/auth.module.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom"


export default function NewPassword() {

    const navigate = useNavigate()

    const PWD_REG = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}/

    const [passwordError, setPasswordError] = useState({inputFieldError: null, errorMessage: ''})
    const [repeatPwdError, setRepeatPwdError] = useState({inputFieldError: null, errorMessage: ''})
    const [toggle, setToggle] = useState(eyeOpened)

    const pwdRef = useRef()
    const repeatRef = useRef()
    const submitRef = useRef()

    const [userInput, setUserInput] = useState({
        password: null,
        repeatPwd: null
    })

    function toggleHidePassword() {
        const passwordInput = document.querySelectorAll('#pwd')
        
        if(toggle == eyeOpened) { 
            passwordInput.forEach(element => element.setAttribute('type', ''))
            setToggle(eyeClosed)
        }
        else if(toggle == eyeClosed) {
            passwordInput.forEach(element => element.setAttribute('type', 'password'))
            setToggle(eyeOpened)
        }
    }
    
    function onChangePassword(event) {setUserInput({...userInput, password: event.target.value})}
    useEffect(() => setPasswordError({inputFieldError: '', errorMessage: ''}), [userInput.password])

    function onChangeRepeatPwd(event) {setUserInput({...userInput, repeatPwd: event.target.value})}
    useEffect(() => setRepeatPwdError({inputFieldError: '', errorMessage: ''}), [userInput.password, userInput.repeatPwd])

    async function handelSubmit(event) {
        event.preventDefault()

        if(!userInput.password) {
            setPasswordError({inputFieldError: css.inputFieldError, errorMessage: `Enter password`})
            return
        }

        else if(!PWD_REG.test(userInput.password)) {
            setPasswordError({inputFieldError: css.inputFieldError, errorMessage: `Password is too weak`})
            return
        }

        else if(userInput.password != userInput.repeatPwd) {
            setRepeatPwdError({inputFieldError: css.inputFieldError, errorMessage: `Passwords don't match`})
            return
        }

        let response = await axios.post('/backend/auth/set-new-pwd', {password: userInput.password})
        response = response.data

        if(response.message) alert(response.httpStatus)
        else {
            setPasswordError({inputFieldError: css.inputFieldNotification, errorMessage: 'Password has been reset'})
            
            submitRef.current.style.display = 'none'
            repeatRef.current.style.display = 'none'
            pwdRef.current.style.pointerEvents = 'none'

            const passwordInput = document.querySelectorAll('#pwd')
            passwordInput.forEach(element => element.setAttribute('type', ''))
            setToggle(eyeClosed)
        }

    }

    return(
        <>
            <div className={css.card}>
                <h1>Set New Password</h1>
                <form onSubmit={handelSubmit}>

                    <br />

                    <div id={passwordError.inputFieldError} ref={pwdRef}>
                        <div className={css.inputField}>
                            <input onChange={onChangePassword} type="password" id="pwd" placeholder=" " />
                            <p>new password</p>
                            <img src={toggle} onClick={toggleHidePassword} style={{left: '95px'}}/>
                        </div>
                        <div className={css.errorMessage}>{passwordError.errorMessage}</div>
                    </div>

                    <div id={repeatPwdError.inputFieldError} ref={repeatRef}>
                        <div className={css.inputField}>
                            <input onChange={onChangeRepeatPwd} type="password" id="pwd" placeholder=" " />
                            <p>repeat password</p>
                            <img style={{left: '74.5px'}} src={toggle} onClick={toggleHidePassword} />
                        </div>
                        <div className={css.errorMessage}>{repeatPwdError.errorMessage}</div>
                    </div>

                    <button type="submit" ref={submitRef}>Set New Password</button>

                    <div className={css.hints}>
                        <p>Login <span className={css.link} onClick={() => navigate('/login')}>here</span></p>
                        <p>Proceed as a <span className={css.link} onClick={() => navigate('/posts')}>guest</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}