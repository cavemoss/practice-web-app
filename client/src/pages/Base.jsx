import { Outlet, useNavigate } from 'react-router-dom'
import css from '../assets/styles/pages.module.css'
import { createContext, useEffect, useState } from 'react'
import ProfileCard from '../components/ProfileCard.jsx'
import New from '../components/New.jsx'
import axios from 'axios'

export const backendDataContext = createContext()
export const overlayContext = createContext()

export default function Base() {

    const navigate = useNavigate()

    const [backendData, setBackendData] = useState({user: null, posts: null, people: null})

    const [newPost, setNewPost] = useState(false)
    const [newRef, setNewRef] = useState(false)
    const [reference_id, setReference_id] = useState(null)

    const [newComment, setNewComment] = useState(false)
    const [post_id, setPost_id] = useState(null)
    const [newReply, setNewReply] = useState(false)
    const [comment_id, setComment_id] = useState(null)
    const [authorUsername, setAuthorUsername] = useState(null)

    const context = {
        setNewPost,
        setNewRef,
        setReference_id,
        setNewComment,
        setPost_id,
        setNewReply,
        setComment_id,
        setAuthorUsername
    }

    async function fetchBackendData() {
        let response = await axios.get('/backend/pages/fetch-backend-data')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setBackendData(response.data)
    }

    useEffect(() => {
        fetchBackendData()
    }, [])

    function Navbar() {

        if(backendData.user) return (
            <>
                <ProfileCard data={backendData.user}/>
                <div className={css.options}>
                    <div className={css.option} onClick={() => navigate('/posts')}>Posts</div>
                    <div className={css.option} onClick={() => navigate('/people')}>People</div>
                    <div className={css.option}>For You</div>
                </div>
            </>
        )

        else return (
            <>
                <div className={css.links}>
                    <p><span onClick={() => navigate('/sign-up')}>Sign Up</span></p>
                    <p><span onClick={() => navigate('/login')}>Login</span></p>
                </div>
                <div className={css.options}>
                    <div className={css.option}>Posts</div>
                    <div className={css.option}>People</div>
                </div>
            </>
        )
    }
    
    return(
        <div className={css.pages}>
            <div className={css.navbar}>
                {Navbar()}
            </div>
            <div className={css.content}>
                <backendDataContext.Provider value={backendData}>
                    <overlayContext.Provider value={context}>
                        <Outlet /> 
                        {(newPost) ? (<New />) : (<></>)}
                        {(newRef) ? (<New reference={reference_id}/>) : (<></>)}
                        {(newComment) ? (<New commentUnder={post_id}/>) : (<></>)}
                        {(newReply) ? (<New replyUnder={comment_id} replyTo={authorUsername}/>) : (<></>)}
                    </overlayContext.Provider>
                </backendDataContext.Provider>
            </div>
        </div>
    )
}