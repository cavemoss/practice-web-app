import { useEffect, useState } from 'react'
import css from '../assets/styles/pages.module.css'
import UserInfo from './UserInfo.jsx'
import Footer from './Footer.jsx'
import axios from 'axios'

export default function Comment(props) {

    const [content, setContent] = useState()

    const [commentDeleted, setCommentDeleted] = useState(false)

    async function populatePost() {
        let response = await axios.get(`/backend/pages/populate-comment?id=${props.comment_id}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent(response.data)
    }

    useEffect(() => {
        populatePost()
    }, [])

    if(content) return(
        <div style={{display: commentDeleted? 'none' : 'block'}}>
            <div className={css.comment}>
                <div className={css.commentHeader}>
                    <UserInfo data={content.author} small maxWidth='133px'/>
                </div>
                <div className={css.commentBody}>
                    <div className={css.body}>{content.body}</div>
                    <Footer
                    pointer='all'
                    forComment
                    author={content.author.username}
                    comment_id={props.comment_id}
                    delete={setCommentDeleted}
                    likes={content.likes} 
                    replies={content.replies} />
                </div>
                <div className={css.date}>{new Date(content.published).toLocaleString()}</div>
            </div>
            <div className={css.replySection}>
                {content.replies.map(doc => <Comment key={doc._id} comment_id={doc._id} />)}
            </div>
        </div>
    )
}