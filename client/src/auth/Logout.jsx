import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Logout() {

    const navigate = useNavigate()

    useEffect(() => {
        document.cookie = 'session=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        navigate('/login')
    }, [])

    return(<></>)
}