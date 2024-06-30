import React, { useEffect, useState } from 'react';
import { CiTrophy } from "react-icons/ci";
import { CgCloseR } from "react-icons/cg";
import { RiHistoryLine } from "react-icons/ri";




const ProfilePage = () => {
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);
    const [history, setHistory] = useState([]);
    const username = JSON.parse(localStorage.getItem('username'));

    useEffect(() => {
        // Fetch number of wins
        fetch('https://backend-online-game.vercel.app/win', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
        .then(response => response.json())
        .then(data => setWins(data.wins))
        .catch(error => console.error('Error fetching wins:', error));

        // Fetch number of losses
        fetch('https://backend-online-game.vercel.app/lose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
        .then(response => response.json())
        .then(data => setLosses(data.losses))
        .catch(error => console.error('Error fetching losses:', error));

        // Fetch game history
        fetch('https://backend-online-game.vercel.app/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
        .then(response => response.json())
        .then(data => setHistory(data.history))
        .catch(error => console.error('Error fetching history:', error));
    }, [username]);


    const date = (sqlDate) => {
        const jsDate = new Date(sqlDate);
        return `${jsDate.toLocaleDateString()}`; 
    };

    const getAvatarText = (username) => {
        return username ? username.substring(0, 1).toUpperCase() : '';
    };

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="avatar">{getAvatarText(username)}</div>
                <div className="username">{username}</div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
                <div className="username"></div>
            </div>
            <div className="profile-content">
                <div className="stats-section">
                    <div className="stat-box">
                        <CiTrophy className="icon" />
                        <div className="stat-number">{wins}</div>
                        <div className="stat-label">WON</div>
                    </div>
                    <div className="stat-box">
                        <CgCloseR className="icon" />
                        <div className="stat-number">{losses}</div>
                        <div className="stat-label">LOST</div>
                    </div>
                </div>
                <div className="history-section">
                
                    <h2><div><RiHistoryLine className="icon" /> Game history</div></h2>
                    <ul>
                    <li key="-1" className="game-history-item">
                                <span className="game-result">.</span>
                                <span className="game-opponent">Score</span>
                                <span className="game-time">Date</span>
                            </li>
                        {
                        history.map((game, index) => (
                            <li key={index} className="game-history-item">
                                <span className="game-result">{game.result}</span>
                                <span className="game-opponent">{game.score}</span>
                                <span className="game-time">{date(game.time)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Styles for the profile page
const profileStyles = `
    .profile-page {
        padding: 20px;
        background: rgba(0, 0, 0, 0.6); /* Transparency */
        border-radius: 12px;
        color: #fff;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        text-align: center;
        width: 100%;
            height: 100vh;
            margin-top:100px;
            
    }
    h2 div{
       display:flex;
       align-items:center;
       justify-content:center;
    }
    .profile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #555;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: #fff;
    }
    .username {
        font-size: 1.5rem;
    }
    .update-time {
        font-size: 1rem;
        color: #ccc;
    }
    .profile-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        height:75%;
    }
    .stats-section {
        display: flex;
        justify-content: space-around;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
    }
    .stat-box {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }
    .stat-number {
        font-size: 2rem;
        margin-bottom: 5px;
    }
    .stat-label {
        font-size: 1.2rem;
        color: #ccc;
    }
    .history-section {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 12px;
        overflow-y:scroll;
    }
    .game-history-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .game-result {
        font-weight: bold;
    }
    .game-opponent {
        color: #ccc;
    }
    .game-time {
        color: #999;
    }
`;

export default ProfilePage;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = profileStyles;
document.head.appendChild(styleSheet);
