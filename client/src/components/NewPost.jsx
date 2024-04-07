import { useContext, useState } from "react"
import UserInfo from "./UserInfo.jsx"
import css from "../assets/styles/pages.module.css"
import { newPostContext } from "../pages/Profile"

export default function NewPost() {

    const { userData, newPostContent, setNewPostContent, createNewPost } = useContext(newPostContext)

    function onChangeTextarea(event) {
        setNewPostContent({...newPostContent, text: event.target.value})
    }
    
    function onChangeInput(event) {
        setNewPostContent({...newPostContent, file: event.target.files[0]})
    }
    
    return(
        <div className={css.vail}>

            <div className={css.vailCard}>
                {(userData) ? (<UserInfo user={userData} />) : (<></>)}
                <form onSubmit={createNewPost} className={css.newPost}>
                    <textarea placeholder="What's on your mind?" onChange={onChangeTextarea}></textarea>
                    <div className={css.inputs}>
                        <input type="file" onChange={onChangeInput}/>
                        <button type="submit">Post</button>  
                    </div> 
                </form>
            </div>
        </div>
    )
}