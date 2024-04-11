import { useContext } from 'react'
import { backendDataContext } from '../pages/Base.jsx'
import User from '../components/User.jsx'

export default function WildPeople() {

    const { people } = useContext(backendDataContext)

    if(people) return(
        <>
            {people.map(doc => <User key={doc._id} data={doc} />)}
        </>
    )
}