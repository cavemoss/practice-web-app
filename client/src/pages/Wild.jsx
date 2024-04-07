import Post from "../components/Post.jsx"
import User from "../components/User.jsx"
import ProfileCard from "../components/ProfileCard.jsx"
import css from "../assets/styles/pages.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Wild(props){

    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [content, setContent] = useState([])

    async function getUser() {
        let response = await axios.get('/backend/pages/get-user')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setUserData(response.data)
    }

    async function populateWild() {
        let response = await axios.get('/backend/pages/populate-wild')
        response = response.data
        if(response.message) alert(response.httpStatus)
        else {
            switch(props.display) {
                case 'posts': setContent(response.data.posts); break
                case 'users': setContent(response.data.people)
            }
        }
    }

    useEffect(() => {
        getUser() 
        populateWild()
    }, [])

    if(!content) return(<></>)

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
                    <h2 onClick={() => {navigate('/wild/posts'); window.location.reload()}}>Posts</h2>
                    <h2 onClick={() => {navigate('/wild/users'); window.location.reload()}}>People</h2>
                </div>
            </div>
            
            <div className={css.content}>
                {
                    content.map(doc => {
                        switch(props.display){
                            case 'posts': return <Post key={doc._id} postId={doc._id} isReference={false} onClick={() => navigate(`/post/${doc._id}`)} />
                            case 'users': return <User key={doc._id} data={doc} onClick={() => navigate(`/profile/${doc.username}`)} />
                        }
                    })
                }
            </div>
        </>
    )
}