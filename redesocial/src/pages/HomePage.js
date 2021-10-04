import { Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom"
import { TextareaAutosize } from '@mui/material';
import { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import axiosInstance from '../axios';
import classes from './HomePage.module.css';
import Users from '../components/Users';
import Posts from '../components/Posts';

const HomePage = () => {
    const [content, setContent] = useState('')
    const [users, setUsers] = useState([])
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))
    const [clicked, setClicked] = useState(false)

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (!content) {
            alert('Não é possível postar uma mensagem em branco.')
            return
        }
        axiosInstance.post('/', {
            "author": jwt_decode(localStorage.getItem('refresh_token')).user_id,
            "content": content,
            "likes": []
        })
            .then((res) => {
                console.log(res.data)
                setClicked(!clicked)
            })
        e.target.reset();
        setContent('')
    };

    useEffect(() => {
        axiosInstance.get('/user/').then((res) => {
            setUsers(res.data)
        })
    }, [])

    return (
        <>
            {loggedout
                ? <div>
                    <Row className={classes.page} >
                        <Col xs={12} md={5}>
                            <Row >
                                <div className={classes.locked}>
                                    <Col xs={12} className={classes.white}>
                                        <form onSubmit={onSubmit}>
                                            <TextareaAutosize
                                                maxLength="255"
                                                placeholder="Digite um post por aqui"
                                                minRows={3}
                                                className={classes.txtarea}
                                                onChange={(e) => setContent(e.target.value)}
                                            />
                                            <div className={classes.botao}>
                                                <input type="submit" value="Enviar" />
                                                {content.length > 0 && <p>{content.length}</p>}
                                            </div>
                                        </form>
                                    </Col>
                                    <Col xs={12} className={classes.white}>
                                        <Users users={users.slice(0, 6)} />
                                        <Link to='/contas' style={{ textDecoration: 'none' }}>
                                            <p className={classes.veja}>Veja todos</p>
                                        </Link>
                                    </Col>
                                </div>
                            </Row>
                        </Col>
                        <Col xs={12} md={7}>
                            {users.length > 0 && <Posts users={users} click={clicked}/>}
                        </Col>
                    </Row >
                </div>
                : <h1>Realize o <Link to='/login'>Login</Link> para realizar posts.</h1>
            }
        </>
    )
}

export default HomePage
