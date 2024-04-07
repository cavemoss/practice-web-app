import css from "../assets/styles/pages.module.css"

export default function User(props) {

    const user = props.data

    if(!user) return(<></>)

    return(
        <div className={css.user} onClick={props.onClick}>
            <img src={user.picture} />
            <div className={css.info}>
                <h3>{user.name || user.username}</h3>
                <p>{user.username}</p>
            </div>
            <p className={css.bio}>{user.bio}</p>
        </div>
    )
}