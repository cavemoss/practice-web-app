import { createContext, useContext, useEffect, useState } from 'react'
import { backendDataContext } from '../pages/Base.jsx'
import { useNavigate } from 'react-router-dom'
import { overlayContext } from '../pages/Base.jsx'
import css from '../assets/styles/pages.module.css'
import UserInfo from '../components/UserInfo.jsx'
import Post from '../components/Post.jsx'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export const overlayContextWildPeople = createContext()

export default function ProfilePage() {

    const navigate = useNavigate()

    const { username } = useParams()

    const { user } = useContext(backendDataContext)

    const { setNewPost } = useContext(overlayContext)

    const [profile, setProfile] = useState()

    let userFollows = false    

    let followBtn, newBtn

    async function populateProfile() {
        let response = await axios.get(`/backend/pages/populate-profile?username=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setProfile(response.data)
    }

    async function follow() {

        if(userFollows) var response = await axios.get(`/backend/pages/follow?username=${username}&action=unfollow`)
        else var response = await axios.get(`/backend/pages/follow?username=${username}&action=follow`)

        response = response.data
        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    function setState(user, profile) {

        if(user === 'guest') {
            followBtn = {display: 'none'}
            newBtn = {display: 'none'}
        } else {
            if(user._id == profile._id) followBtn = {display: 'none'}
            else newBtn = {display: 'none'}
        }

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
                <UserInfo data={profile} noCursor />
                <p className={css.bio}><span>{profile.bio}</span></p>
                <div className={css.stats}>
                    <p>{profile.followers.length} <span id={css.clickable} onClick={() => navigate(`/profile/${username}/followers`)}>followers</span></p>
                    <p>{profile.following.length} <span id={css.clickable} onClick={() => navigate(`/profile/${username}/follows`)}>following</span></p>
                    <p>{profile.posts.length} <span>posts</span></p>
                    <button style={followBtn} onClick={follow}>{userFollows? 'Unfollow': 'Follow'}</button>
                </div>
            </div>
            <button style={newBtn} onClick={() => setNewPost(true)}>New Post</button>
            {profile.posts.map(doc => <Post key={doc._id} post_id={doc._id} width='650px'/>)}
        </>
    )
}