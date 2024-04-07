import { useContext, useEffect, useState } from "react"
import UserInfo from "./UserInfo.jsx"
import css from "../assets/styles/pages.module.css"
import { newReferencePostContext } from "./Post.jsx"
import axios from "axios"

export default function NewRef() {

    const [userData, setUserData] = useState()
    const { setModelOpen, newPostContent, setNewPostContent, createNewPost } = useContext(newReferencePostContext)

    function onChangeTextarea(event) {
        setNewPostContent({...newPostContent, body: event.target.value})
    }

    function onChangeInput(event) {
        setNewPostContent({...newPostContent, video: event.target.files[0]})
    }

    async function getUser() {
        let response = await axios.get('/backend/pages/get-user')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setUserData(response.data)
    }

    useEffect(() => {
        getUser()
    }, [])

    return(
        <div className={css.vail}>
            <div className={css.vailCard}>
                <i class="fa-solid fa-xmark" id={css.cancel} onClick={() => setModelOpen(false)}></i>
                {(userData) ? (<UserInfo user={userData} />) : (<></>)}
                <form onSubmit={createNewPost} className={css.newPost}>
                    <textarea placeholder="What's on your mind?" onChange={onChangeTextarea}></textarea>
                    <div className={css.inputs}>
                        <input type="file" accept="video/*" onChange={onChangeInput}/>
                        <button type="submit">Post</button>  
                    </div>
                </form>
            </div>
        </div>
    )
}