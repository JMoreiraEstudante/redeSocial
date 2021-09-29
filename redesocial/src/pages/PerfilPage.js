import axiosInstance from '../axios';
import classes from './PerfilPage.module.css'
import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import jwt_decode from "jwt-decode";
import defaultLogo from '../icons/1.png';
import boyLogo from '../icons/2.png';
import girlLogo from '../icons/3.png';
import Modal from 'react-modal';
import { TextareaAutosize } from '@mui/material';
import { Link } from "react-router-dom"

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const Perfilpage = () => {
    const [loggedout] = useState(!isEmpty(window.localStorage.getItem('refresh_token')))
    const [user, setUser] = useState({})
    const [photo, setPhoto] = useState(defaultLogo)
    const [salve, setSalvo] = useState(false);
    //modal
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        console.log("synced");
    }

    function closeModal(photo) {
        if (typeof photo === 'string') setPhoto(photo)
        setIsOpen(false);
    }

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    useEffect(() => {
        if (loggedout) {
            const id = jwt_decode(localStorage.getItem('refresh_token')).user_id
            axiosInstance.get(`/user/${id}`).then((res) => {
                setUser(res.data)
                if (res.data.photo === 2) setPhoto(boyLogo)
                else if (res.data.photo === 3) setPhoto(girlLogo)
            })
        }
    }, [])

    function checkPhoto() {
        if (photo === defaultLogo) return 1
        if (photo === boyLogo) return 2
        if (photo === girlLogo) return 3
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (!user.about) {
            alert('Digite algo sobre você.')
            return
        }
        const id = jwt_decode(localStorage.getItem('refresh_token')).user_id;

        axiosInstance.put(`/user/${id}/edit`, {
            "photo":checkPhoto(), 
            "about":user.about, 
            "following":user.following
        })
            .then((res) => {
                console.log(res)
                setSalvo(true)
                setTimeout(() => {
                    setSalvo(false)
                }, 3000);
            }).catch((erro) => {
                console.log("erro", erro)
            })
    };

    return (
        <>
            {loggedout
                ? <div className={classes.perfil}>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                    >
                        <h2> Escolha uma outra:</h2>
                        <Row className={classes.pickone}>
                            <Col xs={4}>
                                <img onClick={() => closeModal(defaultLogo)} src={defaultLogo} alt=" default" />
                            </Col>
                            <Col xs={4}>
                                <img onClick={() => closeModal(boyLogo)} src={boyLogo} alt=" boy" />
                            </Col>
                            <Col xs={4}>
                                <img onClick={() => closeModal(girlLogo)} src={girlLogo} alt=" girl" />
                            </Col>
                        </Row>

                    </Modal>
                    <div className={classes.image} onClick={openModal}>
                        <img src={photo} alt=" perfil" />
                        <div className={classes.middle}>
                            <div className={classes.text}>Mudar?</div>
                        </div>
                    </div>
                    <h1>@{user.user_name}</h1>
                    <h2>Apresente-se:</h2>
                    <div className={classes.white}>
                        {user.about !== undefined && <form onSubmit={onSubmit}>
                            <TextareaAutosize
                                maxLength="255"
                                minRows={2}
                                defaultValue={user.about}
                                className={classes.txtarea}
                                onChange={(e) => setUser({ id: user.id, email: user.email, user_name: user.user_name, photo: user.photo, about: e.target.value })}
                            />
                            <div className={classes.botao}>
                                <input type="submit" value="Salvar" />
                                {user.about.length > 0 && <p>{user.about.length}</p>}
                            </div>
                        </form>}
                    </div>
                    {salve && <p className={classes.salvamento}>Suas informações foram salvas!</p>}
                </div>
                : <h1>Realize o <Link to='/login'>Login</Link> para vizualizar seu perfil</h1>
            }
        </>
    )
}

export default Perfilpage
