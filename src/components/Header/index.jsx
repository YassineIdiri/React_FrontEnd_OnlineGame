import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { AiOutlineProfile } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";


function Header({ connexion, setConnexion }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setConnexion(false);
        localStorage.removeItem('connexion'); // Supprimer l'état de connexion du localStorage
        localStorage.removeItem('username'); 
        localStorage.removeItem('grid'); // Supprimer le tableau du local storage
        localStorage.removeItem('score'); 
        localStorage.removeItem('endGame'); // Supprimer le tableau du local storage
        navigate('/');
    };

    return (
        <header className="headerTop">
            <nav className="nav">
                <Link to="/" className="nav_logo">Thieves on My Trail</Link>
                <ul className="nav_items">
                    <li className="nav_item">
                        <Link to="/" className="nav_link"><IoGameControllerOutline /> Game</Link>
                        <Link to="/profile" className="nav_link"><AiOutlineProfile /> Profile</Link>
                    </li>
                </ul>
                {connexion ? (
                    <button className="buttons" id="form-open" onClick={handleLogout}>Log Out</button>
                ) : (
                    <Link to="/login" className="buttons">Log In</Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
