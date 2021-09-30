import axiosInstance from '../axios';
import classes from './Conta.module.css';
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';
import UserContext from '../store/user-context'
import jwt_decode from "jwt-decode";

const Conta = () => {
    const [user, setUser] = useState({})
    const [follower, setFollower] = useState({})
    const [clicked, setClicked] = useState(false)
    const [photo, setPhoto] = useState(defaultLogo)
    const userCtx = useContext(UserContext)
    const history = useHistory();

    useEffect(() => {
        if (userCtx.user === '') history.push("/contas");
        axiosInstance.get(`/user/${userCtx.user}`).then((res) => {
            setUser(res.data)
            if (res.data.photo === 2) setPhoto(boyLogo)
            else if (res.data.photo === 3) setPhoto(girlLogo)
        })
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/user/${id}`).then((res) => {
            setFollower(res.data)
        })
    }, [clicked])

    function onFollow() {
        follower.following.push(userCtx.user)
        axiosInstance.post(`/user/followed/${follower.id}`, {
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
        follower.following = follower.following.filter((id) => {
            return id !== userCtx.user
        })
        axiosInstance.post(`/user/followed/${follower.id}`, {
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
        <div>
            <div className={classes.image}>
                <img src={photo} alt=" perfil" />
            </div>
            <div className={classes.perfil}>
                <div className={classes.upper}>
                    <h1>@{user.user_name}</h1>
                    {follower.following !== undefined && follower.following.includes(userCtx.user)
                        ? <>{ follower.following !== undefined && follower.id !== user.id && <div className={classes.unfollow} onClick={onUnfollow}>
                            <input type="submit" value="Deixar" />
                        </div>}</>
                        : <>{ follower.following !== undefined && follower.id !== user.id && <div className={classes.follow} onClick={onFollow}>
                            <input type="submit" value="Seguir" />
                        </div>}</>}
                </div>
                <p>{user.about}</p>
            </div>
        </div>
    )
}

export default Conta
