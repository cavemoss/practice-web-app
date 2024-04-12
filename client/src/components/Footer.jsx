import { backendDataContext } from '../pages/Base.jsx'
import css from '../assets/styles/pages.module.css'
import heart from '../assets/icons/heart-regular.svg'
import comment from '../assets/icons/comment-regular.svg'
import repost from '../assets/icons/retweet-solid.svg'
import trash from '../assets/icons/trash-can-regular.svg'
import { overlayContext } from '../pages/Base.jsx'
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Footer(props) {

    const navigate = useNavigate()

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
        replies:  props.replies? props.replies.length : null,
        comments: props.comments? props.comments.length : null,
        reposts: props.reposts? props.reposts.length : null,
        likes: props.likes.length
    })

    async function like() {
        let response = await axios.put(`/backend/pages/like?id=${props.post_id}`)
        response = response.data
        if(response.message) {
            if(response.statusCode === 401) return
            else alert(response.httpStatus)
        }
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
        if(response.message) {
            if(response.statusCode === 401) return
            else alert(response.httpStatus)
        }
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

        if(user === 'guest') return

        switch(params) {
            case 'repost': {
                setNewRef(true)
                setReference_id(props.post_id)
                break
            }
            case 'comment': {
                navigate(`/post/${props.post_id}`)
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
                <div className={css.icon}>
                    <img src={comment} onClick={() => openOverlay('reply')}/>
                    <p style={{visibility: stats.replies > 0? 'visible' : 'hidden'}}>{stats.replies}</p>
                </div>

                <div className={css.icon}>
                    <img src={heart} onClick={likeComment}/>
                    <p style={{visibility: stats.likes > 0? 'visible' : 'hidden'}}>{stats.likes}</p>
                </div>

                <div className={css.icon}>
                    <img ref={deleteCommentRef} src={trash} style={{display: 'none'}} onClick={deleteComment} />
                </div>
            </div>
        </>
    )

    return(
        <>
            <div className={css.footer} style={{pointerEvents: props.pointer? props.pointer : 'all' }}>

                <div className={css.icon} onClick={event => {event.stopPropagation(); openOverlay('comment')}}>
                    <img src={comment} />
                    <p style={{visibility: stats.comments > 0? 'visible' : 'hidden'}}>{stats.comments}</p>
                </div>

                <div className={css.icon} onClick={event => {event.stopPropagation(); like()}}>
                    <img src={heart} />
                    <p style={{visibility: stats.likes > 0? 'visible' : 'hidden'}}>{stats.likes}</p>
                </div>

                <div className={css.icon} onClick={event => {event.stopPropagation(); openOverlay('repost')}}>
                    <img src={repost} />
                    <p style={{visibility: stats.reposts > 0? 'visible' : 'hidden'}}>{stats.reposts}</p>
                </div>

                <div className={css.icon} style={{display: 'none'}} ref={deletePostRef} onClick={event => {event.stopPropagation(); deletePost()}}>
                    <img src={trash} />
                </div>

            </div>
        </>
    )
}