import React, { useState } from 'react';
import './style.css'; 
import { CiLock } from "react-icons/ci";
import { FaPenFancy } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Name:', name, 'Password:', password);

        axios.post('https://backend-online-game.vercel.app/register', { name, password })
            .then(res => {
                console.log(res.data);
                if (res.data.message === 'Registration successful') {
                    navigate('/login');
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="container">
            <div className="box">
                <div className="header">
                    <header><img src="images/logo.png" alt="" /></header>
                    <p>Register</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="name"><FaPenFancy /> Name</label>
                        <input
                            type="text"
                            className="input-field"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            required
                            placeholder='Name'
                        />
                    </div>
                
                    <div className="input-box">
                        <label htmlFor="pass"> <CiLock /> Password</label>
                        <input
                            type="password"
                            className="input-field"
                            id="pass"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            placeholder='Password'
                        />
                        <i className="bx bx-lock"></i>
                    </div>
                    <div className="input-box">
                        <label htmlFor="confirmPass"> <CiLock />Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            id="confirmPass"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            placeholder='Confirm Password'
                        />
                        <i className="bx bx-lock"></i>
                    </div>
                    <div className="input-box">
                        <input type="submit" className="input-submit" value="REGISTER" />
                    </div>
                </form>
            </div>
            <div className="wrapper"></div>
        </div>
    );
};

export default Register;
