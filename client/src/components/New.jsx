import css from '../assets/styles/new.module.css'
import css_pages from '../assets/styles/pages.module.css'
import { backendDataContext } from '../pages/Base.jsx'
import UserInfo from '../components/UserInfo.jsx'
import ImagesFlex from './ImagesFlex.jsx'
import Post from './Post.jsx'
import { overlayContext } from '../pages/Base.jsx'
import { useContext, useRef, useState } from 'react'
import axios from 'axios'

export default function New(props) {

    const overlays = useContext(overlayContext)
    const { user } = useContext(backendDataContext)

    const [text, setText] = useState('')
    const [media, setMedia] = useState({html: null, video: null, images: null})

    async function setVideo(event) {
        setMedia({ 
            ...media, 
            images: null,
            video: event.target.files[0], 
            html:

            <div className={css.videoWrapper}>
                <video controls>
                    <source src={URL.createObjectURL(event.target.files[0])}></source>
                </video>
            </div>
        })
    }

    function setImages(event) {

        let images = []
        for (let i = 0; i < event.target.files.length; i++) {
            images.push(URL.createObjectURL(event.target.files[i]))
        }

        setMedia({ 
            ...media, 
            video: null, 
            images: event.target.files,
            html: <ImagesFlex images={images} inline />
        })
    }


    async function createPost(event) {
        event.preventDefault()

        const formData = new FormData()
        const config = {headers: {'Content-Type': 'multipart/form-data'}}
        
        formData.append('text', text)
        if(media.video) formData.append('video', media.video)
        if(media.images) for (let i = 0; i < media.images.length; i++) {
            formData.append('images', media.images[i])
        }

        if(props.reference) {

            if(media.video) await axios.post(`/backend/media/new-post-video?id=${props.reference}`, formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else if(media.images) await axios.post(`/backend/media/new-post-images?id=${props.reference}`, formData, config).then(response => {

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
            
            if(media.video) await axios.post('/backend/media/new-post-video', formData, config).then(response => {

                response = response.data
                if(response.message) alert(response.httpStatus)
                else window.location.reload()

            }).catch(error => console.log(error))

            else if(media.images) await axios.post('/backend/media/new-post-images', formData, config).then(response => {

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

    const videoInput = useRef()
    const imagesInput = useRef()

    function displayReference() {
        if(props.reference) return(
            <div style={{pointerEvents: 'none'}}>
                <Post post_id={props.reference} reference />
            </div>
        )
        else return(<></>)
    }

    function browseFor(id) {
        switch(id) {
            case 'video': videoInput.current.click(); break
            case 'images': imagesInput.current.click()
        }
    }

    function cancelOverlay() {
        for (let key in overlays) overlays[key](false)
    }

    if(props.commentUnder) return (
        <div className={css.overlay} onClick={cancelOverlay}>
            <div className={css.card} onClick={(event) => event.stopPropagation()}>
                <div style={{pointerEvents: 'none'}}>
                    <UserInfo data={user} />
                </div>
                <form onSubmit={leaveComment}>
                    <textarea placeholder="Leave a comment" onChange={(event) => setText(event.target.value)}></textarea>          
                    <button id={css.submitBtn} type='submit'>Comment</button>
                </form> 
            </div>
        </div>
    )

    if(props.replyTo) return (
        <div className={css.overlay} onClick={cancelOverlay}>
            <div className={css.card} onClick={(event) => event.stopPropagation()}>
                <div style={{pointerEvents: 'none'}}>
                    <UserInfo data={user} />
                </div>
                <form onSubmit={leaveReply}>
                    <textarea placeholder={`Reply to @${props.replyTo}`} onChange={(event) => setText(event.target.value)}></textarea>          
                    <button id={css.submitBtn} type='submit'>Reply</button>
                </form> 
            </div>
        </div>
    )

    return (
        <div className={css.overlay} onClick={cancelOverlay}>
            <div className={css.card} onClick={(event) => event.stopPropagation()}>
                <div style={{pointerEvents: 'none'}}>
                    <UserInfo data={user} />
                </div>
                <form onSubmit={createPost}>
                    <textarea placeholder="What's on your mind" onChange={(event) => setText(event.target.value)}></textarea> 

                    <div className={css.media}>
                        {media.html}
                    </div>

                    {props.reference? <p id={css_pages.ref}>reference</p> : <></>}
                    <div className={css_pages.reference}>
                        {displayReference()}
                    </div>

                    <div className={css.fileInputs}>
                        <span onClick={() => browseFor('video')}>Upload a video</span>
                        <input ref={videoInput} type="file" id="video" accept='video/*' onChange={setVideo} />

                        <span onClick={() => browseFor('images')}>Upload pictures</span>
                        <input ref={imagesInput} type="file" id="images" accept='image/*' multiple onChange={setImages} />
                        
                        <button type='submit'>Post</button>
                    </div>
                </form> 
            </div>
        </div>
    )
}