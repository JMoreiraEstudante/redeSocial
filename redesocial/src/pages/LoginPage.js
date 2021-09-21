import React, { useState } from 'react';
import axiosInstance from '../axios';
import classes from "./Form.module.css"

const LoginPage = () => {
	const initialFormData = Object.freeze({
		email: '',
		password: '',
	});
    const [formData, updateFormData] = useState(initialFormData);
    const [fail, setFail] = useState(false);

    const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

    const handleSubmit = (e) => {
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
			}).catch((res) => {
                setFail(true)
            })
	};

    return (
        <div className={classes.login}>
            <div className={classes.form}>
                <h1>Entre</h1>
                <form onSubmit={handleSubmit}>
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
            </div>
        </div>
    )
}

export default LoginPage
