import { Link } from "react-router-dom"
import { useState } from "react";
import axiosInstance from '../axios';
import classes from './Header.module.css'
import {RiHome7Fill, RiLoginCircleFill, RiLogoutCircleFill, RiAccountCircleFill} from "react-icons/ri"
import {IoMdNotifications} from "react-icons/io"

const Header = () => {
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))

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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null;
        window.location.href = '/login/';
    }

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
                        <RiAccountCircleFill/>
                    </Link>
                </li>
                <li>
                    <Link to='#' className={classes.notification}>
                        <IoMdNotifications/>
                        <p  className={classes.badge}>3</p>
                    </Link>
                </li>
                {loggedout 
                ? <li >
                    <a className={classes.link} onClick={logout}><RiLogoutCircleFill/></a>
                </li>
                : <li >
                    <Link to='/login'><RiLoginCircleFill/></Link>
                </li>
                }
            </ul >
        </nav>
    )
}

export default Header
