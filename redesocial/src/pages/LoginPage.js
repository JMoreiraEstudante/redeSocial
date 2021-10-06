import React, { useState } from 'react';
import axiosInstance from '../axios';
import classes from "./Form.module.css"

const LoginPage = () => {
    const initialFormData = Object.freeze({
        email: '',
        password: '',
        user_name: '',
    });
    const [formData, updateFormData] = useState(initialFormData);
    const [fail, setFail] = useState(false);
    const [registerLoad, setRegisterLoad] = useState(false)

    function setregister() {
        setRegisterLoad(!registerLoad)
    }

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    const loginSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axiosInstance
            .post(`token/`, {
                email: formData.email,
                password: formData.password,
            })
            .then((res) => {
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token');
                window.location.href = '/';
            }).catch((erro) => {
                console.log(erro)
                setFail(true)
            })
    };

    const registerSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        axiosInstance
            .post(`user/create/`, {
                email: formData.email,
                password: formData.password,
                user_name: formData.user_name,
            }).then((res) => {
                console.log(res)
            })
        setregister()
        setFail(false)
    };

    return (
        <div className={classes.login}>
            {registerLoad
                ? <div className={classes.form}>
                    <form onSubmit={registerSubmit}>
                        <div className={classes.formControl}>
                            <label >Nome</label>
                            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
                        </div>
                        <div className={classes.formControl}>
                            <label >Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className={classes.formControl}>
                            <label >Senha</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className={classes.botao}>
                            <input type="submit" value="Registrar" />
                        </div>
                    </form>
                    <div className={classes.registre}>
                        <p >Voltar ao login? <span className={classes.span} onClick={setregister}>Click aqui.</span></p>
                    </div>
                </div>
                : <div className={classes.form}>
                    <form onSubmit={loginSubmit}>
                        <div className={classes.formControl}>
                            <label >Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className={classes.formControl}>
                            <label >Senha</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className={classes.botao}>
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                    <div className={classes.erro}>
                        {fail && <p>Informações incorretas. Realize login novamente.</p>}
                    </div>
                    <div className={classes.registre}>
                        <p >Não possui uma conta? <span className={classes.span} onClick={setregister}>Registre-se.</span></p>
                    </div>
                </div>
            }
        </div>
    )
}

export default LoginPage
