import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Comment from  "../components/Comment.jsx"
import css from "../assets/styles/pages.module.css"
import Post from "../components/Post.jsx"
import ProfileCard from "../components/ProfileCard.jsx"

export default function ViewPost(props) {

    const navigate = useNavigate()

    const { id } = useParams()
    const [userData, setUserData] = useState()
    const [content, setContent] = useState()

    const [commentOpen, setCommentOpen] = useState(false)
    const [comment, setComment] = useState('')

    function onChangeTextarea(event) {setComment(event.target.value)}
    function onClickComment() {
        if(!commentOpen) setCommentOpen(true)
        else setCommentOpen(false)
    }

    async function createNewComment(event) {
        event.preventDefault()
        
        let response = await axios.post(`/backend/pages/leave-comment?id=${id}`, {comment})
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function getUser() {
        let response = await axios.get('/backend/pages/get-user')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setUserData(response.data)
    }

    async function fetchPost() {
        let response = await axios.get(`/backend/pages/get-post?id=${id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent({...response.data, comments: response.data.comments.reverse()})
    }

    useEffect(() => {
        getUser()
        fetchPost()
    }, [])

    if(!content) return (<></>)

    return(
        <>
            <div className={css.navbar}>
                <div className={css.left}>
                    <h1></h1>
                </div>
                <div className={css.center}>
                    <h2 onClick={() => navigate('/wild')}>Got Back</h2>
                </div>
                <div className={css.right}>
                    {
                        (userData) ? 
                        
                        (
                            <ProfileCard user={userData} onClick={() => {
                                navigate(`/profile/${userData.username}`)
                                window.location.reload()
                            }}/>
                        ) : 

                        (   
                            <>
                                <button id={css.login}>Login</button>
                                <button>Sign Up</button>
                            </>
                        )
                    }
                </div>
            </div>

            <div className={css.content} style={{marginTop: 20}}>
                <div className={css.postPage}>

                    <div className={css.header}>
                        <img src={content.op.picture} />
                        <div className={css.opInfo}>
                            <h3>{content.op.name || content.op.username}</h3>
                            <p>{content.op.username}</p>
                        </div>
                        <p className={css.date}>{new Date(content.published).toLocaleString()}</p>
                    </div>

                    <div className={css.body}>
                        {content.body}
                    </div>

                    <div className={css.media}>
                        {
                            (content.video) ?
                            (
                                <video controls >
                                    <source src={content.video} type="video/mp4" />
                                </video>
                            ):
                            (<></>)
                        }
                    </div>
                    
                    <div className={css.reference}>
                        {
                            (content.reference) ?
                            (
                                <Post 
                                    key={content.reference._id} 
                                    postId={content.reference._id} 
                                    onClick={() => navigate(`/post/${content.reference._id}`)} 
                                    isReference={true}
                                />
                            ) :
                            (<></>)
                        }
                    </div>

                    <div className={css.footer} style={{pointerEvents: (props.isReference) ? ('none') : ('all')}}>
                        <i class="fa-regular fa-comment" id={css.iconC} onClick={onClickComment}><span>{(content.comments.length > 0) ? (content.comments.length) : ('')}</span></i>
                        <i class="fa-regular fa-heart" id={css.iconL}><span>{(content.likes.length > 0) ? (content.likes.length) : ('')}</span></i>
                        <i class="fa-solid fa-retweet" id={css.iconR} onClick={() => setModelOpen(true)}><span>{(content.reposts.length > 0) ? (content.reposts.length) : ('')}</span></i>
                    </div>

                    {
                        (userData && commentOpen) ?
                        (
                            <form onSubmit={createNewComment} className={css.form}>
                                <p>Leave a comment</p>
                                <textarea placeholder=" " onChange={onChangeTextarea}></textarea>
                                <button>Comment</button>
                            </form>
                        ) :
                        (<></>)
                    }
                    
                    <div className={css.commentSection}>
                        {content.comments.map(doc => <Comment key={doc._id} commentId={doc._id} />)}
                        
                    </div>
                    
                </div>
            </div>
        </>
    )
}