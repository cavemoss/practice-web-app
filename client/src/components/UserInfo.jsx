import css from '../assets/styles/pages.module.css'
import { useNavigate } from 'react-router-dom'

export default function UserInfo(props) {
    const user = props.data

    const navigate = useNavigate()

    if(user) return(
        <>
            <div className={(props.small) ? (css.userInfoSmall) : (css.userInfo)} onClick={() => navigate(`/profile/${user.username}`)}>
                <img src={user.picture} />
                <div>
                    <h2 id={css.name}>{user.name || user.username}</h2>
                    <p id={css.username}>{user.username}</p>
                </div>
                {
                    (props.withBio)? 
                    (
                        <p className={css.bio}><span>{user.bio}</span></p>
                    ):
                    (<></>)
                }
                {
                    (props.date)?
                    (
                        <p className={css.date}>{new Date(props.date).toLocaleString()}</p>
                    ):
                    (<></>)
                }
            </div>
        </>
    ) 
}