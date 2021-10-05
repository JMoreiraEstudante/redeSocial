import classes from './Notification.module.css';
import axiosInstance from '../axios';
import { useState, useEffect } from "react";
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';

const Notification = ({ id, alive, message, sender, ack }) => {
    const [photo, setPhoto] = useState(defaultLogo)

    useEffect(() => {
        axiosInstance.get(`/user/${sender}`).then((res) => {
            if (res.data.photo === 2) setPhoto(boyLogo)
            else if (res.data.photo === 3) setPhoto(girlLogo)
        })
    }, [])

    return (
        <div className={classes.notification}>
            <div className={classes.image}>
                <img src={photo} alt=" perfil" />
            </div>
            <div className={classes.bottom}>
                <h3>{message}</h3>
                {alive
                    ? <div className={classes.alive} onClick={() => { ack(id) }}>
                        <input type="submit" value="OK" />
                    </div>
                    : <div className={classes.dead}>
                        <input type="submit" value="OK" />
                    </div>
                }
            </div>
        </div>
    )
}

export default Notification
