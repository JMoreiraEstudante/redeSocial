import axiosInstance from '../axios';
import classes from './PostPage.module.css'
import Post from '../components/Post';
import { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TextareaAutosize } from '@mui/material';
import jwt_decode from "jwt-decode";
import CommentContext from '../store/comment-context'
import Comments from '../components/Comments';

const PostPage = () => {
    const [post, setPost] = useState({})
    const [content, setContent] = useState('')
    const [comments, setComments] = useState([])
    const [users, setUsers] = useState([])
    const commentCtx = useContext(CommentContext)
    const [loveIt, setLoveIt] = useState(false)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        if (commentCtx.comment === '') window.location.href = '/'
        axiosInstance.get(`/${commentCtx.comment}`).then((res) => {
            setPost(res.data)
            console.log(res.data)
            axiosInstance.get(`/user/`).then((res) => {
                setUsers(res.data)
            })
        })
    }, [loveIt])

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
                setComments([res.data].concat(comments))
                setClicked(!clicked)
            })
        e.target.reset();
        setContent('')
    };

    function postLoveIt(id, user_id, action) {
        axiosInstance.post(`/liked/${id}`, {
            "like": user_id,
            "action": action
        })
            .then((res) => {
                console.log(res)
                setLoveIt(!loveIt)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    }

    return (
        <Row>
            <Col xs={12} md={5}>
                <Row >
                    <div className={classes.locked}>
                        <h2 className={classes.title}>Post:</h2>
                        <Col xs={12}>
                            {users.length > 0 && <Post id={post.id} content={post.content} likes={post.likes} author={users.find(user => user.id === post.author).user_name} user_id={post.author} love={postLoveIt} liked={post.likes.includes(jwt_decode(localStorage.getItem('refresh_token')).user_id)} comments={post.comments} />}
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
                {users.length > 0 && <Comments users={users} click={clicked} />}
            </Col>
        </Row>
    )
}

export default PostPage
