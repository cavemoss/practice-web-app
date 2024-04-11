import css_new from '../assets/styles/new.module.css'
import css_pages from '../assets/styles/pages.module.css'
import { backendDataContext } from '../pages/Base.jsx'
import UserInfo from '../components/UserInfo.jsx'
import ImagesFlex from './ImagesFlex.jsx'
import Post from './Post.jsx'
import { useContext, useEffect, useRef, useState } from 'react'

import axios from 'axios'

export default function New(props) {

    const { user } = useContext(backendDataContext)

    const [text, setText] = useState('')
    const [media, setMedia] = useState(<></>)
    const [video, setVideo] = useState(null)
    const [images, setImages] = useState(null)

    const videoInput = useRef()
    const imagesInput = useRef()

    const videoInputSpan = useRef()
    const imagesInputSpan = useRef()

    async function createPost(event) {
        event.preventDefault()

        const formData = new FormData()
        const config = {headers: {'Content-Type': 'multipart/form-data'}}

        formData.append('text', text)
        formData.append('video', video)
        if(images) for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        if(props.reference) {

            if(video) await axios.post(`/backend/media/new-post-video?id=${props.reference}`, formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else if(images) await axios.post(`/backend/media/new-post-images?id=${props.reference}`, formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else await axios.post(`/backend/media/new-post?id=${props.reference}`, {text}).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

        } else {
            
            if(video) await axios.post('/backend/media/new-post-video', formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else if(images) await axios.post('/backend/media/new-post-images', formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else await axios.post('/backend/media/new-post', {text}).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

        }
    }

    async function leaveComment(event) {
        event.preventDefault()

        let response = await axios.post(`/backend/pages/leave-comment?id=${props.commentUnder}`, {text})
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function leaveReply(event) {
        event.preventDefault()

        let response = await axios.post(`/backend/pages/leave-reply?id=${props.replyUnder}`, {text})
        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    useEffect(() => {

        if(video) {
            setMedia(
                <div className={css_new.videoWrapper}>
                    <video controls>
                        <source src={URL.createObjectURL(video)}></source>
                    </video>
                </div>
            )
            videoInputSpan.current.style.visibility = 'hidden'
            imagesInputSpan.current.style.visibility = 'hidden'
        }

        if(images) {
            let imgArray = []
            for (let i = 0; i < images.length; i++) {
                imgArray.push(URL.createObjectURL(images[i]))
            }
            setMedia(<ImagesFlex images={imgArray} inline />)
            videoInputSpan.current.style.visibility = 'hidden'
            imagesInputSpan.current.style.visibility = 'hidden'
        }

    }, [video, images])

    function displayReference() {
        if(props.reference) return(
            <Post post_id={props.reference} reference />
        )
        else return(<></>)
    }

    function browseFor(id) {
        switch(id) {
            case 'video': videoInput.current.click(); break
            case 'images': imagesInput.current.click()
        }
    }

    if(props.commentUnder) return (
        <div className={css_new.overlay}>
            <div className={css_new.card}>
                <UserInfo data={user} />
                <form onSubmit={leaveComment}>
                    <textarea placeholder="Leave a comment" onChange={(event) => setText(event.target.value)}></textarea>          
                    <button id={css_new.submitBtn} type='submit'>Comment</button>
                </form> 
            </div>
        </div>
    )

    if(props.replyTo) return (
        <div className={css_new.overlay}>
            <div className={css_new.card}>
                <UserInfo data={user} />
                <form onSubmit={leaveReply}>
                    <textarea placeholder={`Reply to @${props.replyTo}`} onChange={(event) => setText(event.target.value)}></textarea>          
                    <button id={css_new.submitBtn} type='submit'>Reply</button>
                </form> 
            </div>
        </div>
    )

    return (
        <div className={css_new.overlay}>
            <div className={css_new.card}>
                <UserInfo data={user} />
                <form onSubmit={createPost}>
                    <textarea placeholder="What's on your mind" onChange={(event) => setText(event.target.value)}></textarea> 

                    <div className={css_new.media}>
                        {media}
                    </div>

                    {(props.reference) ? (<p id={css_pages.ref}>reference</p>) : (<></>)}
                    <div className={css_pages.reference}>
                        {displayReference()}
                    </div>

                    <div className={css_new.fileInputs}>
                        <span ref={videoInputSpan} onClick={() => browseFor('video')}>Upload a video</span>
                        <input ref={videoInput} type="file" id="video" accept='video/*' onChange={(event) => setVideo(event.target.files[0])} />

                        <span ref={imagesInputSpan} onClick={() => browseFor('images')}>Upload pictures</span>
                        <input ref={imagesInput} type="file" id="images" accept='image/*' multiple onChange={(event) => setImages(event.target.files)} />
                        
                        <button type='submit'>Post</button>
                    </div>

                </form> 
            </div>
        </div>
    )
}