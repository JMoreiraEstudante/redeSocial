import classes from './Post.module.css';
import { useState, useEffect, useContext } from 'react';
import { BsHeartFill, BsHeart } from "react-icons/bs"
import { FaCommentAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
import UserContext from '../store/user-context'
import axiosInstance from '../axios';
import jwt_decode from "jwt-decode";

const Post = ({ id, content, author, user_id, likes }) => {
    const [heart, setHeart] = useState(BsHeart)
    const [liked, setLiked] = useState(false)
    const [likesLength, setlikesLength] = useState(likes.length)
    const [hover, setHover] = useState(false)
    const userCtx = useContext(UserContext)

    function toggleUserSelected() {
        userCtx.userPick(user_id)
    }

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        if (likes.includes(id)) {
            setHeart(BsHeartFill)
            setLiked(true)
            setHover(true)
        }
    }, [])

    function hoverOn() {
        setHover(true)
    }

    function hoverOff() {
        if (!liked) setHover(false)
    }

    function loveIt() {
        const id_token = jwt_decode(localStorage.getItem('refresh_token')).user_id
        if (!liked) {
            setLiked(true)
            setHeart(BsHeartFill)
            likes.push(id_token)
            setlikesLength(likesLength+1)
            axiosInstance.post(`/liked/${id}`, {
                "likes": likes,
            })
                .then((res) => {
                    console.log(res)
                }).catch((erro) => {
                    console.log("erro", erro)
                })
        }
        else {
            setLiked(false)
            setHeart(BsHeart)
            likes = likes.filter((liker) => {
                return id_token !== liker
            })
            setlikesLength(likesLength-1)
            axiosInstance.post(`/liked/${id}`, {
                "likes": likes,
            })
                .then((res) => {
                    console.log(res)
                }).catch((erro) => {
                    console.log("erro", erro)
                })
        }
        console.log(likes, likes.length)
    }

    return (
        <div key={id} className={classes.post}>
            <hr className={classes.linha} />
            <h4 className={classes.content}>{content}</h4>
            <div className={classes.footer}>
                <div onClick={toggleUserSelected}>
                    <Link style={{ textDecoration: 'none' }} to='/conta'>
                        <p>@{author}</p>
                    </Link>
                </div>
                <div className={classes.icons}>
                    <div className={classes.comentario}>
                        <div className={classes.icon}><FaCommentAlt /></div>
                        <p>{0}</p>
                    </div>
                    <div className={classes.like}>
                        <div className={hover ? classes.iconChecked : classes.icon} onMouseEnter={hoverOn}
                            onMouseLeave={hoverOff} onClick={loveIt}>{heart}</div>
                        <p>{likesLength}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
