import classes from './User.module.css';
import axiosInstance from '../axios';
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../store/user-context'
import { Link } from "react-router-dom"

const User = ({ id, user_name, photo, email, following, follow, unFollow }) => {
    const [photoImg, setPhoto] = useState(defaultLogo)
    const userCtx = useContext(UserContext)

    function toggleUserSelected() {
        userCtx.userPick(id)
    }

    function putPhoto(path) {
        setPhoto(path)
    }

    useEffect(() => {
        if (photo === 2) putPhoto(boyLogo)
        else if (photo === 3) putPhoto(girlLogo)
    }, [])

    function onFollowClick(id) {
        console.log("seguindo", id)
        follow(id)
    };

    function onUnfollowClick(id) {
        console.log("deixando", id)
        unFollow(id)
    }

    return (
        <>
            {<div className={classes.user}>
                <div className={classes.upper}>
                    <img className={classes.image} src={photoImg} alt=" perfil" />
                    <div className={classes.contato}>
                        <div onClick={toggleUserSelected}>
                            <Link style={{ textDecoration: 'none' }} to='/conta'>
                                <h6>@{user_name}</h6>
                            </Link>
                        </div>
                        <h6>{email}</h6>
                    </div>
                </div>
                {following !== undefined && following.includes(id)
                    ? <div className={classes.unfollow} onClick={() => onUnfollowClick(id)}>
                        <input type="submit" value="Deixar" />
                    </div>
                    : <div className={classes.follow} onClick={() => onFollowClick(id)}>
                        <input type="submit" value="Seguir" />
                    </div>}
            </div>}
        </>
    )
}

export default User
