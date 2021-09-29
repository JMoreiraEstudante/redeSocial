import axiosInstance from '../axios';
import classes from './Contas.module.css';
import User from '../components/User';
import { useState, useEffect } from 'react';

const Contas = () => {
    const [users, setUsers] = useState([])
    const [pesquisa, setPesquisa] = useState('')

    useEffect(() => {
        axiosInstance.get('/user/').then((res) => {
            setUsers(res.data)
        })
    }, [])

    return (
        <div className={classes.contas}>
            <input
                type="text"
                placeholder="Pesquise por um @nome..."
                onChange={(e) => setPesquisa(e.target.value)}
            />
            {users.map(user => {
                return (
                    user.user_name.includes(pesquisa) &&
                    <User id={user.id} user_name={user.user_name} photo={user.photo} email={user.email} />
                )
            })}
        </div>
    )
}

export default Contas
