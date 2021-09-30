import axiosInstance from '../axios';
import classes from './PostPage.module.css'
import Post from '../components/Post';
import Comment from '../components/Comment'
import { useHistory } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TextareaAutosize } from '@mui/material';
import jwt_decode from "jwt-decode";
import CommentContext from '../store/comment-context'

const PostPage = () => {
    const [post, setPost] = useState({})
    const [content, setContent] = useState('')
    const [comments, setComments] = useState([])
    const [users, setUsers] = useState([])
    const history = useHistory();
    const commentCtx = useContext(CommentContext)

    useEffect(() => {
        if (commentCtx.comment === '') history.push("/");
        axiosInstance.get(`/${commentCtx.comment}`).then((res) => {
            setPost(res.data)
            axiosInstance.get(`/user/`).then((res) => {
                setUsers(res.data)
            })
            axiosInstance.get(`comment/${commentCtx.comment}`).then((res) => {
                setComments(res.data)
            })
        })
    }, [])

    const onSubmit = (e) => {
        e.preventDefault();
        if (!content) {
            alert('Não é possível postar uma mensagem em branco.')
            return
        }
        axiosInstance.post(`/comment/${post.id}`, {
            "author": jwt_decode(localStorage.getItem('refresh_token')).user_id,
            "content": content,
            "post": post.id,
            "likes": []
        })
            .then((res) => {
                window.location.reload()
            })
        e.target.reset();
        setContent('')
    };

    return (
        <Row>
            <Col xs={12} md={5}>
                <Row >
                <div className={classes.locked}>
                    <h2 className={classes.title}>Post:</h2>
                    <Col xs={12}>
                        {users.length > 0 && post.id !== undefined && <Post id={post.id} content={post.content} likes={post.likes} author={users.find(user => user.id === post.author).user_name} user_id={post.author} />}
                    </Col>
                    <Col xs={12} className={classes.white}>
                        <form onSubmit={onSubmit}>
                            <TextareaAutosize
                                maxLength="255"
                                placeholder="Faça um comentário por aqui"
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
                </div>
                </Row>
            </Col>
            <Col xs={12} md={7}>
                <h2 className={classes.title}>Comentários:</h2>
                {users.length > 0 && comments.length > 0 &&
                    comments.map(post => {
                        return <Comment id={post.id} content={post.content} likes={post.likes} author={users.find(user => user.id === post.author).user_name} user_id={post.author} />
                    })
                }
            </Col>
        </Row>
    )
}

export default PostPage
