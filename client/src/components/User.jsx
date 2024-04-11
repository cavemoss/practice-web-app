import css from '../assets/styles/pages.module.css'
import { useNavigate } from 'react-router-dom'
import UserInfo from './UserInfo.jsx'

export default function User(props) {
    const navigate = useNavigate()

    const user = props.data
    
    if(user) return (
        <>
            <div className={css.post} style={{maxWidth: '650px'}} onClick={() => navigate(`/profile/${user.username}`)}>
                <UserInfo data={user} withBio />  
            </div>
        </>
    )
}