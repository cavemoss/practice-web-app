import css from '../assets/styles/pages.module.css'
import { useNavigate } from 'react-router-dom'

export default function UserInfo(props) {
    const user = props.data

    const navigate = useNavigate()

    function openProfile(event) {
        event.stopPropagation()
        navigate(`/profile/${user.username}`)
    }

    if(user) return(
        <>
            <div 
            className={props.small? css.userInfoSmall : css.userInfo} 
            style={{cursor: props.noCursor? 'auto' : 'pointer'}}>
                <img src={user.picture} onClick={openProfile}/>
                <div onClick={openProfile}>
                    <h2 id={css.name} style={{
                        inlineSize: (user.name? user.name.length : user.username.length) < 15? 'auto' : props.maxWidth? props.maxWidth: 'auto',
                        overflowWrap: 'break-word'
                    }}>{user.name || user.username}</h2>
                    <p id={css.username}>{user.username}</p>
                </div>
                {
                    props.withBio? 
                    <p className={css.bio}><span>{user.bio}</span></p>                
                    :<></>
                }
                {
                    props.date?
                    <p className={css.date}>{new Date(props.date).toLocaleString()}</p>
                    :<></>
                }
            </div>
        </>
    ) 
}