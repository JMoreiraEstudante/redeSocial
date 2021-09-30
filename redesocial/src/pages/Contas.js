import axiosInstance from '../axios';
import classes from './Contas.module.css';
import Users from '../components/Users';
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
            <Users users={users.filter((user) => {
                return user.user_name.includes(pesquisa)
            })}/>
        </div>
    )
}

export default Contas
