import axiosInstance from '../axios';
import classes from './Conta.module.css';
import { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';
import UserContext from '../store/user-context'
import jwt_decode from "jwt-decode";
import Post from '../components/Post';

const Conta = () => {
    const [user, setUser] = useState({})
    const [follower, setFollower] = useState({})
    const [clicked, setClicked] = useState(false)
    const [photo, setPhoto] = useState(defaultLogo)
    const userCtx = useContext(UserContext)
    const history = useHistory();
    const [posts, setPosts] = useState([])
    const [loveIt, setLoveIt] = useState(false)

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        if (userCtx.user === '') history.push("/contas");
        axiosInstance.get(`/user/${userCtx.user}`).then((res) => {
            if (userCtx.user === id) history.push("/perfil");
            setUser(res.data)
            if (res.data.photo === 2) setPhoto(boyLogo)
            else if (res.data.photo === 3) setPhoto(girlLogo)
        })
        axiosInstance.get(`/user/${id}`).then((res) => {
            setFollower(res.data)
        })
        axiosInstance.get(`/post/user/${userCtx.user}`).then((res) => {
            setPosts(res.data)
        })
    }, [clicked, loveIt])

    function onFollow() {
        follower.following.push(userCtx.user)
        axiosInstance.post(`/user/followed/${follower.id}`, {
            "following": follower.following
        })
            .then((res) => {
                console.log(res)
                setClicked(!clicked)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    };

    function onUnfollow() {
        follower.following = follower.following.filter((id) => {
            return id !== userCtx.user
        })
        axiosInstance.post(`/user/followed/${follower.id}`, {
            "following": follower.following
        })
            .then((res) => {
                console.log(res)
                setClicked(!clicked)
            }).catch((erro) => {
                console.log("erro", erro)
            })
    }

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
        <div>
            <Row>
                <Col xs={12} md={5}>
                    <div className={classes.image}>
                        <img src={photo} alt=" perfil" />
                    </div>
                    <div className={classes.perfil}>
                        <div className={classes.upper}>
                            <h1>@{user.user_name}</h1>
                            {follower.following !== undefined && follower.following.includes(userCtx.user)
                                ? <>{follower.following !== undefined && follower.id !== user.id && <div className={classes.unfollow} onClick={onUnfollow}>
                                    <input type="submit" value="Deixar" />
                                </div>}</>
                                : <>{follower.following !== undefined && follower.id !== user.id && <div className={classes.follow} onClick={onFollow}>
                                    <input type="submit" value="Seguir" />
                                </div>}</>}
                        </div>
                        <p>{user.about}</p>
                    </div>
                </Col>
                <Col xs={12} md={7}>
                    {posts.map(post => {
                        return (
                            <Post id={post.id} content={post.content} likes={post.likes} author={user.user_name} user_id={post.author} love={postLoveIt} liked={post.likes.includes(jwt_decode(localStorage.getItem('refresh_token')).user_id)} comments={post.comments} />
                        )
                    })}
                </Col>
            </Row>
        </div>
    )
}

export default Conta
