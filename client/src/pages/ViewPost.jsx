import { useEffect, useState } from 'react'
import Post from '../components/Post.jsx'
import css from '../assets/styles/pages.module.css'
import Comment from '../components/Comment.jsx'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function ViewPost() {

    const { id } = useParams()

    const [content, setContent] = useState()

    async function populatePost() {
        let response = await axios.get(`/backend/pages/populate-post?id=${id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent(response.data)
    }

    useEffect(() => {
        populatePost()
    }, [])

    if(content) return(
        <>
            <div className={css.postContainer}>
                <Post post_id={id} static width='auto'/>
                <div className={css.commentSection}>
                    {content.comments.map(doc => <Comment key={doc._id} comment_id={doc._id} />)}
                </div>
            </div>
        </>
    )
}