import { useEffect, useState, useRef } from 'react'
import css from '../assets/styles/auth.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function ConfirmEmail() {

    const navigate = useNavigate()

    const [userData, setUserData] = useState({})
    const picRef = useRef()
    const emailError = {inputFieldError: css.inputFieldNotification, errorMessage: `We've sent the email verification link to this email address`}

    async function fetchData() {

        let response = await axios.get('/backend/auth/sign-up/confirm-email')
        response = response.data

        if(response.message) {
            alert(response.httpStatus)
            navigate('/login')
        }
        else setUserData(response.data)
    }

    useEffect(() => {fetchData()}, [])

    return(
        <>       
            <div className={css.card}>
                
                <div className={css.userDataOuter}>
                    <div className={css.userData}>
                        <img ref={picRef} src={userData.picture}/>
                        <div className={css.userDataText}>
                            <h2>{userData.name || userData.username}</h2>
                            <p>{userData.username}</p>
                        </div>
                    </div>
                    <p>{userData.bio}</p>
                </div>

                <div id={emailError.inputFieldError} style={{marginTop: '20px'}}>
                    <div className={css.inputField}>
                        <input value={userData.email} style={{pointerEvents: 'none'}}/>
                        <p>email address</p>
                    </div>
                    <div className={css.errorMessage}>{emailError.errorMessage}</div>
                </div>

                <div className={css.hints}>
                    <p>Login <span className={css.link} onClick={() => navigate('/login')}>here</span></p>
                    <p>Proceed as a <span className={css.link} onClick={() => navigate('/posts')}>guest</span></p>
                </div>
            </div>
        </>
    )
}