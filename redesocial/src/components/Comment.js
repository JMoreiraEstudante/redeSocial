import classes from './Post.module.css';
import { useContext } from 'react';
import { BsHeartFill, BsHeart } from "react-icons/bs"
import { Link } from "react-router-dom"
import UserContext from '../store/user-context'
import jwt_decode from "jwt-decode";

const Comment = ({ id, content, author, user_id, likes, love, liked }) => {
    const userCtx = useContext(UserContext)

    function toggleUserSelected() {
        userCtx.userPick(user_id)
    }

    function loveIt() {
        const id_token = jwt_decode(localStorage.getItem('refresh_token')).user_id
        if (!liked) {
            liked = true
            likes.push(id_token)
            love(id, id_token, liked)
        }
        else {
            liked = false
            likes = likes.filter((liker) => {
                return id_token !== liker
            })
            love(id, id_token, liked)
        }
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
                    <div className={classes.like}>
                        <div className={liked ? classes.iconChecked : classes.icon}
                            onClick={loveIt}>{liked ? <BsHeartFill /> : <BsHeart />}</div>
                        <p>{likes.length}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment
