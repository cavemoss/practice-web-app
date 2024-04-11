import UserInfo from "./UserInfo.jsx"
import css from '../assets/styles/pages.module.css'
import { useNavigate } from "react-router-dom"

export default function ProfileCard (props) {

    const navigate = useNavigate()

    return(
        <>
            <UserInfo data={props.data}/>
            <div style={{marginTop: '-40px'}} className={css.links}>
                <p><span onClick={() => navigate('/logout')}>Logout</span></p>
            </div>
        </>
    )
}