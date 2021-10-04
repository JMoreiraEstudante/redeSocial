import Comment from './Comment';
import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../axios';
import jwt_decode from "jwt-decode";
import CommentContext from '../store/comment-context';

const Comments = ({ users, click }) => {
    const [comments, setComments] = useState([])
    const [loveIt, setLoveIt] = useState(false)
    const commentCtx = useContext(CommentContext)

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/comment/${commentCtx.comment}`).then((res) => {
            setComments(res.data)
            console.log(res.data)
        })
    }, [click, loveIt])

    function commentLoveIt(id, likes) {
        axiosInstance.post(`/commentLiked/${id}`, {
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
            {comments.map(post => {
                return (
                    <Comment id={post.id} content={post.content} likes={post.likes} author={users.find(user => user.id === post.author).user_name} user_id={post.author} love={commentLoveIt} liked={post.likes.includes(jwt_decode(localStorage.getItem('refresh_token')).user_id)}/>
                )
            })}
        </>
    )
}

export default Comments
