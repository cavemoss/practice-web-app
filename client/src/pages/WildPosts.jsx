import { useContext, createContext, useState } from 'react'
import { backendDataContext } from '../pages/Base.jsx'
import Post from '../components/Post.jsx'

export default function WildPosts() {

    const { posts } = useContext(backendDataContext)

    if(posts) return(
        <>
            {posts.map(doc => <Post key={doc._id} post_id={doc._id} width='650px'/>)}
        </>
    )
}