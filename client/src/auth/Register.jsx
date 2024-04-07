import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import css from '../assets/styles/auth.module.css'
import eyeOpened from '../assets/icons/eye-svgrepo-com.svg'
import eyeClosed from '../assets/icons/eye-off-svgrepo-com.svg'
import axios from 'axios'


export const NAME_REG = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
export const EMAIL_REG =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const PWD_REG = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}/

export default function Register() {

    const navigate = useNavigate()

    const [usernameError, setUsernameError] = useState({inputFieldError: null, errorMessage: ''})
    const [emailError, setEmailError] = useState({inputFieldError: null, errorMessage: ''})
    const [passwordError, setPasswordError] = useState({inputFieldError: null, errorMessage: ''})
    const [repeatPwdError, setRepeatPwdError] = useState({inputFieldError: null, errorMessage: ''})
    const [toggle, setToggle] = useState(eyeOpened)

    const [userInput, setUserInput] = useState({
        name: null,
        username: null,
        email: null,
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

    function onChangeName(event) {setUserInput({...userInput, name: event.target.value})}

    function onChangeUsername(event) {setUserInput({...userInput, username: event.target.value})}
    useEffect(() => setUsernameError({inputFieldError: null, errorMessage: ''}), [userInput.username])

    function onChangeEmail(event) {setUserInput({...userInput, email: event.target.value})}
    useEffect(() => setEmailError({inputFieldError: null, errorMessage: ''}), [userInput.email])

    function onChangePassword(event) {setUserInput({...userInput, password: event.target.value})}
    useEffect(() => setPasswordError({inputFieldError: null, errorMessage: ''}), [userInput.password])

    function onChangeRepeatPwd(event) {setUserInput({...userInput, repeatPwd: event.target.value})}
    useEffect(() => setRepeatPwdError({inputFieldError: null, errorMessage: ''}), [userInput.password, userInput.repeatPwd])

    async function handelSubmit(event) {
        event.preventDefault()

        if(!userInput.username) {
            setUsernameError({inputFieldError: css.inputFieldError, errorMessage: `Enter username`})
            return
        }
        
        else if(!NAME_REG.test(userInput.username)) {
            setUsernameError({inputFieldError: css.inputFieldError, errorMessage: `Invalid username`})
            return
        }

        else if (!userInput.email) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Enter email`})
            return
        }

        else if (!EMAIL_REG.test(userInput.email)) {
            setEmailError({inputFieldError: css.inputFieldError, errorMessage: `Invalid email`})
            return
        }

        else if(!userInput.password) {
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

        let response = await axios.post('/backend/auth/sign-up', {
            name: userInput.name,
            username: userInput.username,
            email: userInput.email,
            password: userInput.password
        }); response = response.data

        if(response.message) {   
            if(response.message.keyValue.username) {
                setUsernameError({inputFieldError: css.inputFieldError, errorMessage: 'Account with this username already exists'})
            }
            else if(response.message.keyValue.email) {
                setEmailError({inputFieldError: css.inputFieldError, errorMessage: 'Account with this email already exists'})
            }
            else {
                alert(response.httpStatus)
            }
        } else {
            navigate('/sign-up/add-info')
        }
    }

    return(
        <>
            <div className={css.card}>
                <h1>Sign Up</h1>
                <form onSubmit={handelSubmit}>

                    <br />

                    <div>
                        <div className={css.inputField}>
                            <input onChange={onChangeName} placeholder="not required" />
                            <p>Your Name</p>
                        </div>
                    </div>

                    <br />

                    <div id={usernameError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangeUsername} placeholder=" " />
                            <p>username</p>
                        </div>
                        <div className={css.errorMessage}>{usernameError.errorMessage}</div>
                    </div>

                    <div id={emailError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangeEmail} placeholder=" " />
                            <p>email</p>
                        </div>
                        <div className={css.errorMessage} style={{paddingRight: '30px'}}>{emailError.errorMessage}</div>
                    </div>

                    <br /> 

                    <div id={passwordError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangePassword} type="password" id="pwd" placeholder=" " />
                            <p>password</p>
                            <img src={toggle} onClick={toggleHidePassword} />
                        </div>
                        <div className={css.errorMessage}>{passwordError.errorMessage}</div>
                    </div>

                    <div id={repeatPwdError.inputFieldError}>
                        <div className={css.inputField}>
                            <input onChange={onChangeRepeatPwd} type="password" id="pwd" placeholder=" " />
                            <p>repeat password</p>
                            <img style={{left: '74.5px'}} src={toggle} onClick={toggleHidePassword} />
                        </div>
                        <div className={css.errorMessage}>{repeatPwdError.errorMessage}</div>
                    </div>

                    <br />

                    <button type="submit">Sign Up</button>

                    <div className={css.hints}>
                        <p>Login <span className={css.link} onClick={() => navigate('/login')}>here</span></p>
                        <p>Proceed as a <span className={css.link} onClick={() => navigate('/wild')}>guest</span></p>
                    </div>
                </form>
            </div>
        </>
    )
}