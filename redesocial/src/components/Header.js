import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axiosInstance from '../axios';
import classes from './Header.module.css'
import { RiHome7Fill, RiLoginCircleFill, RiLogoutCircleFill, RiAccountCircleFill } from "react-icons/ri"
import { IoMdNotifications } from "react-icons/io"
import jwt_decode from "jwt-decode";

const Header = () => {
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))
    const [notifications, setNotifications] = useState([])

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    function logout() {
        axiosInstance.post('user/logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
        } catch (e) {
            console.log("erro", e)
        }
        window.location.href = '/login/';
    }

    useEffect(() => {
        setInterval(() => {
            try {
                const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
                axiosInstance.get(`/notification/${id}`).then((res) => {
                    setNotifications(res.data)
                })
            }
            catch (e) {
                //não fez login ainda
                console.log(e)
            }
        }, 5000)
    }, [])

    return (
        <nav className={classes.header}>
            <ul className={classes.lista}>
                <li>
                    <Link to='/'>
                        <RiHome7Fill />
                    </Link>
                </li>
                <li>
                    <Link to='/perfil'>
                        <RiAccountCircleFill />
                    </Link>
                </li>
                <li>
                    <Link to='/notification' className={classes.notification}>
                        <div className={classes.icon}>
                            <IoMdNotifications />
                            {notifications.length > 0 && <p className={classes.badge}>{notifications.length}</p>}
                        </div>
                    </Link>
                </li>
                {loggedout
                    ? <li >
                        <a className={classes.link} onClick={logout}><RiLogoutCircleFill /></a>
                    </li>
                    : <li >
                        <Link to='/login'><RiLoginCircleFill /></Link>
                    </li>
                }
            </ul >
        </nav>
    )
}

export default Header
