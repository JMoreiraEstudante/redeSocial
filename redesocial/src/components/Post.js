import classes from './Post.module.css';
import { useState, useEffect, useContext } from 'react';
import { BsHeartFill, BsHeartHalf, BsHeart } from "react-icons/bs"
import { FaCommentAlt } from "react-icons/fa"
import { Link } from "react-router-dom"
import UserContext from '../store/user-context'

const Post = ({ id, content, author, user_id }) => {
    const userCtx = useContext(UserContext)
    function toggleUserSelected() {
        userCtx.userPick(user_id)
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
                    <div className={classes.icon}><FaCommentAlt /></div>
                    <div className={classes.icon}><BsHeart /></div>
                </div>
            </div>
        </div>
    )
}

export default Post
