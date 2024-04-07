import { useEffect, useRef, useState } from "react"
import css from "../assets/styles/pages.module.css"
import axios from "axios"

export default function Comment(props) {

    const [userData, setUserData] = useState()
    const [content, setContent] = useState({author: '', published: '', likes: [], replies: []})

    const delBtn = useRef()

    const [replayOpen, setReplyOpen] = useState(false)
    const [reply, setReply] = useState()

    function onChangeTextarea(event) {setReply(event.target.value)}

    async function deleteComment() {
        let response = await axios.delete(`/backend/pages/delete-comment?id=${props.commentId}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function leaveReply(event) {
        event.preventDefault()
        let response = await axios.post(`/backend/pages/leave-reply?id=${props.commentId}`, {reply})
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function populateComment() {
        let response = await axios.get(`/backend/pages/populate-comment?id=${props.commentId}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent(response.data)
    }

    async function getUser() {
        let response = await axios.get('/backend/pages/get-user')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setUserData(response.data)
    }

    useEffect(() => {
        getUser()
        populateComment()
    }, [])

    useEffect(() => {
        if(userData) if(userData.username == content.author.username) delBtn.current.style.display = 'block'
    })

    return(
        <>
            <div className={css.comment}>
            
                <div className={css.commentBody}>
                    <div className={css.author}>
                        <img src={content.author.picture} />
                        <div className={css.opInfo}>
                            <h3>{content.author.name || content.author.username}</h3>
                            <p>{content.author.username}</p>
                        </div>
                    </div>
                    
                    <div className={css.body}>
                        <p>{content.body}</p>
                        <div className={css.footer}>
                            <i class="fa-regular fa-heart" id={css.iconL}><span style={{display: (content.likes.length > 0) ? ('inline') : ('none')}}>{content.likes.length}</span></i>
                            <i class="fa-regular fa-comment" id={css.iconC} onClick={() => setReplyOpen(true)}><span style={{display: (content.replies.length > 0) ? ('inline') : ('none')}}>{content.replies.length}</span></i>     
                            <i class="fa-regular fa-trash-can" id={css.iconD} onClick={deleteComment} ref={delBtn} style={{display: 'none'}}></i>
                        </div>
                    </div>
                    
                </div>

                
                <div className={css.replies}>
                    {content.replies.map(doc => <Comment key={doc._id} commentId={doc._id} />)}
                </div>

            </div>
            
            {
                (replayOpen) ?
                (
                    <form onSubmit={leaveReply} className={css.form}>
                        <p>Leave a reply</p>
                        <textarea placeholder=" " onChange={onChangeTextarea}></textarea>
                        <button>Reply</button>
                    </form>
                ) :
                (<></>)
            }
        </>
    )
}