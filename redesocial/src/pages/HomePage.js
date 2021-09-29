import { Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom"
import { TextareaAutosize } from '@mui/material';
import { useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import axiosInstance from '../axios';
import classes from './HomePage.module.css';
import User from '../components/User';
import Post from '../components/Post';

const HomePage = () => {
    const [content, setContent] = useState('')
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [follower, setFollower] = useState({})
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))

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
        let formData = new FormData();
        formData.append('author', jwt_decode(localStorage.getItem('refresh_token')).user_id);
        formData.append('content', content);
        axiosInstance.post('/', formData)
            .then((res) => {
                setPosts([res.data, ...posts])
            })
        e.target.reset();
        setContent('')
    };

    useEffect(() => {
        axiosInstance.get('/').then((res) => {
            setPosts(res.data)
        })
        axiosInstance.get('/user/').then((res) => {
            setUsers(res.data)
        })
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/user/${id}`).then((res) => {
            setFollower(res.data)
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
                                        {users.slice(0, 4).map(user => {
                                            return (
                                                <User id={user.id} user_name={user.user_name} photo={user.photo} email={user.email} />
                                            )
                                        })}
                                        <Link to='/contas' style={{ textDecoration: 'none' }}>
                                            <p className={classes.veja}>Veja todos</p>
                                        </Link>
                                    </Col>
                                </div>
                            </Row>
                        </Col>
                        <Col xs={12} md={7}>
                            {posts.map(post => {
                                return (follower.following !== undefined && users.length > 0 && (follower.id === post.author || follower.following.includes(post.author))
                                    ? <Post id={post.id} content={post.content} author={users.find(user => user.id === post.author).user_name} user_id={post.author} />
                                    : <></>
                                )
                            })}
                        </Col>
                    </Row >
                </div>
                : <h1>Realize o <Link to='/login'>Login</Link> para realizar posts.</h1>
            }
        </>
    )
}

export default HomePage
