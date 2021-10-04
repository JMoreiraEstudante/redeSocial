import Post from './Post';
import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import jwt_decode from "jwt-decode";

const Posts = ({ users, click }) => {
    const [posts, setPosts] = useState([])
    const [loveIt, setLoveIt] = useState(false)

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/following/${id}`).then((res) => {
            setPosts(res.data)
            console.log(res.data)
        })
    }, [click, loveIt])

    function postLoveIt(id, likes) {
        axiosInstance.post(`/liked/${id}`, {
            "likes": likes,
        })
            .then((res) => {
                console.log(res)
                setLoveIt(!loveIt)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    }

    return (
        <>
            {posts.map(post => {
                return (
                    <Post id={post.id} content={post.content} likes={post.likes} author={users.find(user => user.id === post.author).user_name} user_id={post.author} love={postLoveIt} liked={post.likes.includes(jwt_decode(localStorage.getItem('refresh_token')).user_id)} comments={post.comments} />
                )
            })}
        </>
    )
}

export default Posts
