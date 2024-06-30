import React, { useState } from 'react';
import './style.css'; // Assurez-vous de créer ce fichier CSS pour les styles
import { Link } from 'react-router-dom'; // Importer Link depuis react-router-dom
import { CiLock } from "react-icons/ci";
import { FaPenFancy } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = ({ connexion, setConnexion }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email, 'Password:', password);

        axios.post('http://localhost:8081/login', { email, password })
            .then(res => {
                if (res.data.message === 'Login success') {
                    localStorage.setItem('connexion', JSON.stringify(true)); // Sauvegarder l'état de connexion dans le localStorage
                    localStorage.setItem('username', JSON.stringify(email)); // Sauvegarder l'état de connexion dans le localStorage
                    setConnexion(true); // Mettre à jour l'état de connexion
                    navigate('/grille');
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
                    <p>Log In</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="email"><FaPenFancy /> Name</label>
                        <input
                            type="text"
                            className="input-field"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            placeholder='Name'
                        />
                        <i className="bx bx-envelope"></i>
                    </div>
                    <div className="input-box">
                    <label htmlFor="pass">
                       <CiLock /> Password
                        </label>
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
                        <input type="submit" className="input-submit" value="SIGN IN" />
                    </div>
                    <div className="bottom">
                    <span>Don't have an account ? <Link to="/register">Sign Up</Link></span>
                   </div>
                </form>
            </div>
            <div className="wrapper"></div>
        </div>
    );
};

export default Login;
