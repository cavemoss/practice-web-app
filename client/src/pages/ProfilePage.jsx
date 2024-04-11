import { createContext, useContext, useEffect, useState } from 'react'
import { backendDataContext } from '../pages/Base.jsx'
import { overlayContext } from '../pages/Base.jsx'
import css from '../assets/styles/pages.module.css'
import UserInfo from '../components/UserInfo.jsx'
import Post from '../components/Post.jsx'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export const overlayContextWildPeople = createContext()

export default function ProfilePage() {

    const { username } = useParams()

    const { user } = useContext(backendDataContext)

    const { setNewPost } = useContext(overlayContext)

    let userFollows = false

    const [profile, setProfile] = useState()

    let followBtn, newBtn

    async function populateProfile() {
        let response = await axios.get(`/backend/pages/populate-profile?username=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else {
            setProfile(response.data)
        }
    }

    async function follow() {
        let response

        if(userFollows) response = await axios.get(`/backend/pages/follow?username=${username}&action=unfollow`)
        else response = await axios.get(`/backend/pages/follow?username=${username}&action=follow`)

        response = response.data

        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    function setState(user, profile) {

        if(user._id == profile._id) followBtn = {display: 'none'}
        else newBtn = {display: 'none'}

        if(profile.followers.filter(doc => doc.username == user.username).length == 0) userFollows = false
        else userFollows = true
    }

    useEffect(() => {
        populateProfile()
    }, [])

    if(profile && user) return(
        <>
            {setState(user, profile)}
            <div className={css.profile}>
                <UserInfo data={profile}/>
                <p className={css.bio}><span>{user.bio}</span></p>
                <div className={css.stats}>
                    <p>{profile.followers.length} <span>followers</span></p>
                    <p>{profile.following.length} <span>following</span></p>
                    <p>{profile.posts.length} <span>posts</span></p>
                    <button style={followBtn} onClick={follow}>{(userFollows) ? (<>Unfollow</>) : (<>Follow</>)}</button>
                </div>
            </div>
            <button style={newBtn} onClick={() => setNewPost(true)}>New Post</button>
            {profile.posts.map(doc => <Post key={doc._id} post_id={doc._id} width='650px'/>)}
        </>
    )
}