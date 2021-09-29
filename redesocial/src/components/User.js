import classes from './User.module.css';
import axiosInstance from '../axios';
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';
import { useState, useEffect, useContext } from 'react';
import UserContext from '../store/user-context'
import { Link } from "react-router-dom"
import jwt_decode from "jwt-decode";

const User = ({ id, user_name, photo, email }) => {
    const [photoImg, setPhoto] = useState(defaultLogo)
    const userCtx = useContext(UserContext)
    const [follower, setFollower] = useState({})
    const [clicked, setClicked] = useState(false)

    function toggleUserSelected() {
        userCtx.userPick(id)
    }

    function putPhoto(path) {
        setPhoto(path)
    }

    useEffect(() => {
        if (photo === 2) putPhoto(boyLogo)
        else if (photo === 3) putPhoto(girlLogo)
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/user/${id}`).then((res) => {
            setFollower(res.data)
        })
    }, [])

    function onFollow() {
        follower.following.push(id)
        axiosInstance.put(`/user/${follower.id}/edit`, {
            "photo": follower.photo,
            "about": follower.about,
            "following": follower.following
        })
            .then((res) => {
                console.log(res)
                setClicked(!clicked)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    };

    function onUnfollow() {
        follower.following = follower.following.filter((user_id) => {
            return id !== user_id
        })
        axiosInstance.put(`/user/${follower.id}/edit`, {
            "photo": follower.photo,
            "about": follower.about,
            "following": follower.following
        })
            .then((res) => {
                console.log(res)
                setClicked(!clicked)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    }

    return (
        <>
            { id !== follower.id && <div className={classes.user} key={id}>
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
                {follower.following !== undefined && follower.following.includes(id)
                    ? <div className={classes.unfollow} onClick={onUnfollow}>
                        <input type="submit" value="Deixar" />
                    </div>
                    : <div className={classes.follow} onClick={onFollow}>
                        <input type="submit" value="Seguir" />
                    </div>}
            </div>}
        </>
    )
}

export default User
