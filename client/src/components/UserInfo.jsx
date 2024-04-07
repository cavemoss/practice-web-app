import css from "../assets/styles/pages.module.css"

export default function UserInfo(props) {

    if(!props.user) return(<></>)

    return(
        <>
            <div className={css.userInfo}>
                <img src={props.user.picture} />
                <div className={css.info}>
                    <h3>{props.user.name || props.user.username}</h3>
                    <p>{props.user.username}</p>
                </div>
                {(props.displayDate) ? (<p className={css.date}>{new Date(props.displayDate).toLocaleString()}</p>) : (<></>)}
            </div>
        </>
    )
}