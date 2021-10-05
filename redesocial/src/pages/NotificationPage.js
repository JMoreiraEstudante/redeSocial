import classes from './NotificationPage.module.css';
import axiosInstance from '../axios';
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom"
import Notification from '../components/Notification';
import { Row, Col } from 'react-bootstrap';

const NotificationPage = () => {
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))
    const [notifications, setNotifications] = useState([])
    const [clicked, setClicked] = useState(false)

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    function acknowledge(id) {
        axiosInstance.post(`/ack/${id}`)
            .then((res) => {
                console.log(res)
                setClicked(!clicked)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    }

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/notificationall/${id}`).then((res) => {
            setNotifications(res.data)
            console.log(res.data)
        })
    }, [clicked])

    return (
        <>
            {
                loggedout
                    ? <div className={classes.page}>
                        <Row>
                            {notifications.map(notification => {
                                return (
                                    <Col xs={12}>
                                        <Notification id={notification.id} alive={notification.alive} message={notification.message} sender={notification.sender} ack={acknowledge}/>
                                    </Col>
                                )
                            })}
                        </Row>
                    </div >
                    : <h1>Realize o <Link to='/login'>Login</Link> para vizualizar suas noticações</h1>
            }
        </>
    )
}

export default NotificationPage
