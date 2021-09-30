import jwt_decode from "jwt-decode";
import axiosInstance from '../axios';
import User from "./User";
import { useState, useEffect } from 'react';

const Users = ({ users }) => {
    const [follower, setFollower] = useState({})
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
        axiosInstance.get(`/user/${id}`).then((res) => {
            setFollower(res.data)
        })
    }, [clicked])

    function onFollow(id) {
        follower.following.push(id)
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

    function onUnfollow(id) {
        follower.following = follower.following.filter((user_id) => {
            return id !== user_id
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

    return (
        <>
            {users.map(user => {
                return (
                user.id !== jwt_decode(localStorage.getItem('refresh_token')).user_id &&
                    <User key={user.id} id={user.id} user_name={user.user_name} photo={user.photo} email={user.email} following={follower.following} follow={onFollow} unFollow={onUnfollow} />
                )
            })}
        </>
    )
}

export default Users
