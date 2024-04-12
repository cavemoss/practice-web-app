import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import User from '../components/User.jsx'
import UserInfo from '../components/UserInfo.jsx'
import axios from 'axios'
import css from '../assets/styles/pages.module.css'

export default function People(props) {

    const { username } = useParams()

    const [people, setPeople] = useState()

    const [profile, setProfile] = useState()

    async function getProfile() {
        let response = await axios.get(`/backend/pages/populate-profile?username=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setProfile(response.data)
    }

    async function getFollowers() {
        let response = await axios.get(`/backend/pages/get-people?who=followers&of=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setPeople(response.data)
    }

    async function getFollowing() {
        let response = await axios.get(`/backend/pages/get-people?who=following&of=${username}`)
        response = response.data
        if(response.message) alert(response.httpStatus)
        else setPeople(response.data)
    }

    const message = () => {
        if(props.followers) return <>'s followers</>
        if(props.follows) return <>&nbsp;is following</>
    }

    useEffect(() => {
        getProfile()
        if(props.followers) getFollowers()
        if(props.follows) getFollowing()
    }, [])

    if(people) return(
        <>
            <div className={css.people}>
                <UserInfo data={profile}/>
                <p>{message()}</p>
            </div>
            {people.map(doc => <User key={doc._id} data={doc} />)}
        </>
    )
}