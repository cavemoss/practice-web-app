import { useEffect, useRef, useState, createContext } from "react"
import css from "../assets/styles/pages.module.css"
import { useNavigate, useParams } from "react-router-dom"
import ProfileCard from "../components/ProfileCard.jsx"
import Post from "../components/Post.jsx"
import axios from "axios"
import NewPost from "../components/NewPost.jsx"

export const newPostContext = createContext() 

export default function Profile() {

    const navigate = useNavigate()

    const [userData, setUserData] = useState()
    const [profile, setProfile] = useState({followers: [], following: []})
    const [content, setContent] = useState([])
    const { username } = useParams()

    const [modelOpen, setModelOpen] = useState(false)
    const [newPostContent, setNewPostContent] = useState({text: null, file: null})
    const context = {
        userData: userData,
        newPostContent: newPostContent,
        setNewPostContent: setNewPostContent,
        createNewPost: createNewPost
    }

    async function createNewPost(event) {
        event.preventDefault()

        const formData = new FormData()
        formData.append('text', newPostContent.text)
        formData.append('file', newPostContent.file)

        let response = await axios.post('/backend/media/post', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        response = response.data

        if(response.message) alert(response.httpStatus)
    }

    const followBtn = useRef()
    const postBtnRef = useRef()
    const userFollows = () => {
        if(profile.followers.filter(doc => doc.username == userData.username).length == 0) return false
        else return true
    }

    function setFollowButton() {
        if(username == userData.username) {
            followBtn.current.style.display = 'none'
            postBtnRef.current.style.display = 'block'
        }
        else if(userFollows()) followBtn.current.innerHTML = 'unfollow'
        else followBtn.current.innerHTML = 'follow'
    }

    async function follow() {
        let response

        if(userFollows()) response = await axios.get(`/backend/pages/follow?username=${username}&action=unfollow`)
        else response = await axios.get(`/backend/pages/follow?username=${username}&action=follow`)

        response = response.data

        if(response.message) alert(response.httpStatus)
        else window.location.reload()
    }

    async function populateProfile() {
        let response = await axios.get(`/backend/pages/populate-profile?username=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setContent(response.data)
    }

    async function getProfile() {
        let response = await axios.get(`/backend/pages/get-profile?username=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setProfile(response.data)
    }

    async function getUser() {
        let response = await axios.get('/backend/pages/get-user')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setUserData(response.data)
    }

    useEffect(() => {
        getUser()
        getProfile()
        populateProfile()
    }, [])

    useEffect(() => {if(userData) setFollowButton()})

    return(
        <>
            <div className={css.navbar}>
                <div className={css.top}>
                    {
                        (userData) ? 
                        
                        (<ProfileCard user={userData} onClick={() => navigate(`/profile/${userData.username}`)}/>) : 

                        (   
                            <>
                                <button id={css.login} onClick={() => navigate('/login')}>Login</button>
                                <button onClick={() => navigate('/sign-up')}>Sign Up</button>
                            </>
                        )
                    }
                </div>
                <div className={css.center}>
                    <h2 onClick={() => navigate('/wild/posts')}>Posts</h2>
                    <h2 onClick={() => navigate('/wild/users')}>People</h2>
                </div>
            </div>

            <div className={css.content}>
                <div className={css.profilePageInfo}>
                    <div className={css.profileInfoMain}>
                        <img src={profile.picture} />
                        <div>
                            <h3>{profile.name || profile.username}</h3>
                            <p>{profile.username}</p>
                        </div>
                    </div>
                    <p className={css.bio}><span>{profile.bio}</span></p>
                    <div className={css.stats}>
                        <p><span>{profile.followers.length}</span> followers</p>
                        <p><span>{profile.following.length}</span>  following</p>
                        <button ref={followBtn} style={{marginLeft: 'auto', height: '24px', alignSelf: 'center'}} onClick={follow}></button>
                    </div>
                    <button ref={postBtnRef} className={css.createPostBtn} onClick={() => setModelOpen(false)}>Create Post</button>
                </div>
                {content.map(doc => <Post key={doc._id} postId={doc._id} onClick={() => navigate(`/post/${doc._id}`)} />)}
            </div>

            <newPostContext.Provider value={context}>
                {(modelOpen) ? (<NewPost />) : (<></>)}
            </newPostContext.Provider>
        </>
    )
}