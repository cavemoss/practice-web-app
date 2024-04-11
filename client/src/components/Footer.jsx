import { backendDataContext } from '../pages/Base.jsx'
import css from '../assets/styles/pages.module.css'
import heart from '../assets/icons/heart-regular.svg'
import comment from '../assets/icons/comment-regular.svg'
import repost from '../assets/icons/retweet-solid.svg'
import trash from '../assets/icons/trash-can-regular.svg'
import { overlayContext } from '../pages/Base.jsx'
import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'


export default function Footer(props) {

    const { user } = useContext(backendDataContext)

    const { 
        setNewRef, 
        setReference_id, 
        setNewComment, 
        setPost_id,
        setNewReply,
        setComment_id,
        setAuthorUsername
    } = useContext(overlayContext)

    const [liked, setLiked] = useState(false)

    const deletePostRef = useRef()
    const deleteCommentRef = useRef()

    const [stats, setStats] = useState({
        replies:  (props.replies) ? (props.replies.length) : (null),
        comments: (props.comments) ? (props.comments.length) : (null),
        reposts: (props.reposts) ? (props.reposts.length) : (null),
        likes: props.likes.length
    })

    async function like() {
        let response = await axios.put(`/backend/pages/like?id=${props.post_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else {
            if(!liked) {
                setStats({...stats, likes: stats.likes += 1})
                setLiked(true)
            } else {
                setStats({...stats, likes: stats.likes -= 1})
                setLiked(false)
            }
        } 
    }

    async function likeComment() {
        let response = await axios.put(`/backend/pages/like-comment?id=${props.comment_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else {
            if(!liked) {
                setStats({...stats, likes: stats.likes += 1})
                setLiked(true)
            } else {
                setStats({...stats, likes: stats.likes -= 1})
                setLiked(false)
            }
        } 
    }

    async function deletePost() {
        let response = await axios.delete(`/backend/pages/delete-post?id=${props.post_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else props.delete(true)
    }

    async function deleteComment() {
        let response = await axios.delete(`/backend/pages/delete-comment?id=${props.comment_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else props.delete(true)
    }

    function openOverlay(params) {
        switch(params) {
            case 'repost': {
                setNewRef(true)
                setReference_id(props.post_id)
                break
            }
            case 'comment': {
                setNewComment(true)
                setPost_id(props.post_id)
                break
            }
            case 'reply': {
                setNewReply(true)
                setComment_id(props.comment_id)
                setAuthorUsername(props.author)
            }
        }
    }

    useEffect(() => {
        if(user) {
            if(props.likes.filter(doc => doc._id.toString() == user._id).length > 0) setLiked(true)
            if(props.op) if(user.username == props.op) deletePostRef.current.style.display = 'block'
            if(props.author) if(user.username == props.author) deleteCommentRef.current.style.display = 'block'
        }

    }, [user])

    if(props.forComment) return(
        <>
            <div className={css.footer}>
                <img className={css.icon} src={comment} onClick={() => openOverlay('reply')}/><p style={{visibility: (stats.replies > 0) ? ('visible') : ('hidden')}}>{stats.replies}</p>
                <img className={css.icon} src={heart} onClick={likeComment}/><p style={{visibility: (stats.likes > 0) ? ('visible') : ('hidden')}}>{stats.likes}</p>
                <img ref={deleteCommentRef} className={css.icon} src={trash} style={{display: 'none'}} onClick={deleteComment} />
            </div>
        </>
    )

    return(
        <>
            <div className={css.footer}>
                <img className={css.icon} src={comment} onClick={() => openOverlay('comment')}/><p style={{visibility: (stats.comments > 0) ? ('visible') : ('hidden')}}>{stats.comments}</p>
                <img className={css.icon} src={heart} onClick={like}/><p style={{visibility: (stats.likes > 0) ? ('visible') : ('hidden')}}>{stats.likes}</p>
                <img className={css.icon} src={repost} onClick={() => openOverlay('repost')}/><p style={{visibility: (stats.reposts > 0) ? ('visible') : ('hidden')}}>{stats.reposts}</p>
                <img ref={deletePostRef} className={css.icon} src={trash} style={{display: 'none'}} onClick={deletePost} />
            </div>
        </>
    )
}