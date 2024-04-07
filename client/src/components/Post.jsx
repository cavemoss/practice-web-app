import { createContext, useEffect, useRef, useState } from "react"
import placeholder from "../assets/icons/placeholder.webp"
import NewRef from "./NewRef"
import css from "../assets/styles/pages.module.css"
import axios from "axios"
import UserInfo from "./UserInfo.jsx"

export const newReferencePostContext = createContext()

export default function Post(props) {

    const [content, setContent] = useState(null)
    const selfRef = useRef()
    
    async function like() {
        let response = await axios.put(`/backend/pages/like?id=${props.postId}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    const [modelOpen, setModelOpen] = useState(false)
    const [newPostContent, setNewPostContent] = useState({body: null})
    const context = {
        setModelOpen,
        newPostContent,
        setNewPostContent,
        createNewPost
    }

    async function createNewPost(event) {
        event.preventDefault()

        let response = await axios.post(`/backend/pages/create-new-reference?id=${props.postId}`, {body: newPostContent.body})
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function populatePost() {
        let response = await axios.get(`/backend/pages/populate-post?id=${props.postId}`)
        response = response.data

        if(response.message) alert(response.httpStatus)
        else {
            if(response.data.op == null) {
                let response = await axios.delete(`/backend/pages/delete-ownerless-post?id=${props.postId}`)
                response = response.data
                if(response.message) alert(response.httpStatus)
                else selfRef.current.style.display = 'none'
            } else {
                setContent(response.data)
            }
        }
    }

    useEffect(() => {
        populatePost()
    }, [])

    if(!content) return(<></>)

    return(
        <>
            <div className={css.post} ref={selfRef}>

                <UserInfo user={content.op} displayDate={content.published} />

                <div className={css.body} onClick={props.onClick}>{content.body}</div>

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
                
                <div className={css.reference} onClick={props.onClick}>
                    {
                        (content.reference) ?
                        (
                            (props.isReference) ?
                            (
                                <p id={css.ref}>reference to another post...</p>
                            ) :
                            (
                                <Post 
                                    key={content.reference._id} 
                                    postId={content.reference._id} 
                                    onClick={() => navigate(`/post/${content.reference._id}`)} 
                                    isReference={true}
                                />
                            )
                        ) :
                        (<></>)
                    }
                </div>

                <div className={css.footer} style={{pointerEvents: (props.isReference) ? ('none') : ('all')}}>
                    <i class="fa-solid fa-comment" id={css.iconC}><span style={{display: (content.comments.length > 0) ? ('inline') : ('none')}}>{content.comments.length}</span></i>
                    <i class="fa-solid fa-heart" id={css.iconL} onClick={like}><span style={{display: (content.likes.length > 0) ? ('inline') : ('none')}}>{content.likes.length}</span></i>
                    <i class="fa-solid fa-retweet" id={css.iconR} onClick={() => setModelOpen(true)}><span>{content.reposts.length}</span></i>
                </div>
                
            </div>

            <newReferencePostContext.Provider value={context}>
                {(modelOpen) ? (<NewRef />) : (<></>)}
            </newReferencePostContext.Provider>
        </>
    )
}