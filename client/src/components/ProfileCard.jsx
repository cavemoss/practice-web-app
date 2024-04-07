import { useNavigate } from "react-router-dom"
import css from "../assets/styles/pages.module.css"

export default function ProfileCard(props) {

    const navigate = useNavigate()

    const you = props.user

    return(
        <>
            <div className={css.profileCard} onClick={props.onClick}>
                <img src={you.picture}></img>
                <div className={css.profileInfo}>
                    <h3>{you.name || you.username}</h3>
                    <p>{you.username}</p>
                </div>
            </div>
            <p><span onClick={() => navigate('/logout')}>logout</span></p>
        </>
    )
}