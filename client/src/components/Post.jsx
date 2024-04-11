import { useEffect, useState } from 'react'
import css from '../assets/styles/pages.module.css'
import { useNavigate } from 'react-router-dom'
import UserInfo from './UserInfo.jsx'
import Footer from './Footer.jsx'
import ImagesFlex from './ImagesFlex.jsx'
import axios from 'axios'

export default function Post(props) {

    const navigate = useNavigate()

    const [content, setContent] = useState()

    const [postDeleted, setPostDeleted] = useState(false)

    async function populatePost() {
        let response = await axios.get(`/backend/pages/populate-post?id=${props.post_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent(response.data)
    }

    useEffect(() => {
        populatePost()
    }, [])

    function displayMedia() {
        if(content.video)  return(
            <div className={css.videoWrapper}>
                <video controls>
                    <source src={content.video}></source>
                </video>
            </div>
        ) 
        else if(content.images) return(<ImagesFlex images={content.images} />)
    }

    function displayReference() {
        if(content.reference) if(!props.reference) return(
            <Post post_id={content.reference._id} reference />
        )
        else return(<></>)
    }

    if(content) return(
        <>
            <div
            style={{ maxWidth: props.width, display: (postDeleted) ? 'none' : 'block' }}
            className={css.post} 
            id={(props.static) ? (css.static) : ('')}>

                <div onClick={() => navigate(`/post/${content._id}`)}>
                    <UserInfo data={content.op} date={content.published} />
                </div>

                <div className={css.body} onClick={() => navigate(`/post/${content._id}`)}>
                    {content.body}
                </div>

                <div className={css.media}>
                    {displayMedia()}
                </div>

                {(content.reference) ? (<p id={css.ref}>reference</p>) : (<></>)}
                <div className={css.reference} onClick={() => navigate(`/post/${content.reference._id}`)}>
                    {displayReference()}
                </div>
                
                <Footer 
                post_id={props.post_id}
                delete={setPostDeleted}
                op={content.op.username}
                likes={content.likes} 
                comments={content.comments} 
                reposts={content.reposts}/>
            </div>
        </>
    )
}