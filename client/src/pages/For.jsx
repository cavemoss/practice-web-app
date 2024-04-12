import { useContext } from "react"
import { backendDataContext } from "./Base"
import Post from "../components/Post"

export default function For() {

    const { user, posts } = useContext(backendDataContext)

    let forYou = []

    function makeList(posts, user) {
        posts.forEach(doc => {
            user.following.forEach(doc2 => {
                if(doc.op == doc2._id) forYou.push(doc._id)
            })
        })
    }

    if(posts && user) return(
        <>
            {makeList(posts, user)}
            {forYou.map(post_id => <Post key={post_id} post_id={post_id} width='650px'/>)}
        </>
    )
}