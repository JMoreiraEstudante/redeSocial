import { Link } from "react-router-dom"
import { useState } from "react";
import axiosInstance from '../axios';
import classes from './Header.module.css'

const Header = () => {
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    function logout() {
        const response = axiosInstance.post('user/logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        axiosInstance.defaults.headers['Authorization'] = null;
        window.location.href = '/login/';
    }

    return (
        <div className={classes.header}>
            <ul className={classes.lista}>
                <li>
                    <Link to='/'>
                        <h3>Homepage</h3>
                    </Link>
                </li>
                {loggedout 
                ? <li >
                    <a onClick={logout}><h3>Logout</h3></a>
                </li>
                : <li >
                    <Link to='/login'><h3>Login</h3></Link>
                </li>
                }
            </ul >
        </div>
    )
}

export default Header
