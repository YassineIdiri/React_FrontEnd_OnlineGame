import { useState, useEffect, useRef } from 'react';

import './style.css';
import Cell from '../Cell';
import Modal from 'react-modal';
import axios from 'axios';

// Configure react-modal
Modal.setAppElement('#root');

const getInitialGrid = () => {
    const storedGrid = localStorage.getItem('grid');
    if (storedGrid) {
        return JSON.parse(storedGrid);
    }
    return [
        ['car', '-', '-', 'drone', '-', '-', '-', '-'],
        ['-', 'tree', '-', '-', 'tree', 'trap', '-', '-'],
        ['-', '-', 'drone', 'trap', '-', '-', 'drone', '-'],
        ['car', '-', '-', '-', 'car', '-', '-', '-'],
        ['-', '-', 'trap', '-', '-', '-', 'tree', '-'],
        ['tree', 'car', '-', 'tree', '-', 'trap', '-', '-'],
        ['-', '-', '-', 'trap', '-', '-', '-', '-'],
        ['-', '-', '-', '-', '-', '-', 'player', 'tree']
    ];
};

const getInitialScore = () => {
    const storedScore = localStorage.getItem('score');
    if (storedScore) {
        return JSON.parse(storedScore);
    }
    return 0;
};

const getInitialStatus = () => {
    const storedStatus = localStorage.getItem('endGame');
    if (storedStatus) {
        return JSON.parse(storedStatus);
    }
    return false;
};


function Grid() {
    const [grid, setGrid] = useState(getInitialGrid());
    const [moving, setMoving] = useState(false);
    const [message, setMessage] = useState('Ready for play ');
    const [score, setScore] = useState(getInitialScore());
    const [endGame, setEndGame] = useState(getInitialStatus());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('username'));

    useEffect(() => {
        localStorage.removeItem('grid'); // Supprimer l'état de connexion du localStorage
        localStorage.removeItem('score'); 
        localStorage.removeItem('endGame'); // Supprimer le tableau du local storage
    }, [isModalOpen]);

    useEffect(() => {
        localStorage.setItem('grid', JSON.stringify(grid));
    }, [grid]);

    useEffect(() => {
        localStorage.setItem('score', JSON.stringify(score));
    }, [score]);

    useEffect(() => {
        localStorage.setItem('endGame', JSON.stringify(endGame));
    }, [endGame]);

    const endGameRef = useRef(endGame);
    useEffect(() => {
        endGameRef.current = endGame;
        if (endGame) {
            setIsModalOpen(true); // Ouvrir la popup lorsque le jeu se termine
        }
    }, [endGame]);

    const msgRef = useRef(message);
    useEffect(() => {
        msgRef.current = message;
    }, [message]);

    const scoreRef = useRef(score);
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);


    useEffect(() => {
        if (endGame) {
            console.log("me voila");
            const result =  message==="Game Over" ? 'lose' : 'win';
            const gameData = {
                date: new Date().toISOString(),
                score: score,
                user: user,
                result: result
            };

            axios.post('http://localhost:8081/save-game', gameData)
                .then(response => {
                    console.log('Game data saved successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error saving game data:', error);
                });
        }
    }, [endGame, score, user]);

    const findPlayerPosition = (grid) => {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === 'player') {
                    return { playerRow: row, playerCol: col };
                }
            }
        }
        return null; 
    };

    const findElementsPositions = () => {
        const positions = [];
    
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 'drone' || grid[i][j] === 'car') {
                    positions.push({ type: grid[i][j], row: i, col: j });
                }
            }
        }
    
        return positions;
    };


    const moveElementsOneStepRight = (elementPositions, playerPosition) => {
        const newGrid = [...grid]; // Créer une copie de la grille d'origine

        let delay = 0;

        setMoving(true);
        setMessage('Moving elements....');
        
        elementPositions.forEach(({ type, row, col }) => {
            setTimeout(() => {
                if (endGameRef.current) {
                    return;
                }
            //..
            //.-
            if (row < playerPosition.playerRow && col < playerPosition.playerCol) {
                if (col + 1 < grid[row].length && !(newGrid[row][col + 1] === 'drone' || newGrid[row][col + 1] === 'car' || newGrid[row][col + 1] === 'tree')) {
                    if(newGrid[row][col + 1] === '-'){
                            newGrid[row][col + 1] = type;
                            newGrid[row][col] = '-';
                    }else if(newGrid[row][col + 1] === 'player'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row + 1 < grid.length && !(newGrid[row+1][col] === 'drone' || newGrid[row+1][col] === 'car' || newGrid[row+1][col] === 'tree')){
                    if(newGrid[row+1][col] === '-'){
                            newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row+1][col] === 'player'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            //..
            //-.
            if (row < playerPosition.playerRow && col > playerPosition.playerCol) {
                if (col - 1 >= 0 && !(newGrid[row][col - 1] === 'drone' || newGrid[row][col - 1] === 'car' ||newGrid[row][col - 1] === 'tree')) {
                    if(newGrid[row][col - 1] === '-'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col - 1] === 'player'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row + 1 < grid.length && !(newGrid[row+1][col] === 'drone' || newGrid[row+1][col] === 'car' || newGrid[row+1][col] === 'tree')){
                    if(newGrid[row+1][col] === '-'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row+1][col] === 'player'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            //-.
            //..
            if (row > playerPosition.playerRow && col > playerPosition.playerCol) {
                if (col - 1 >= 0 && !(newGrid[row][col - 1] === 'drone' || newGrid[row][col - 1] === 'car'|| newGrid[row][col - 1] === 'tree')) {
                    if(newGrid[row][col - 1] === '-'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col - 1] === 'player'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row - 1 >= 0 && !(newGrid[row-1][col] === 'drone' || newGrid[row-1][col] === 'car'|| newGrid[row-1][col] === 'tree')){
                    if(newGrid[row-1][col] === '-'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row-1][col] === 'player'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            //.-
            //..
            if (row > playerPosition.playerRow && col < playerPosition.playerCol) {
                if (col + 1 < grid[row].length && !(newGrid[row][col + 1] === 'drone' || newGrid[row][col + 1] === 'car' || newGrid[row][col + 1] === 'tree')) {
                    if(newGrid[row][col + 1] === '-'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col + 1] === 'player'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef+1);
                    }
                }
                else if(row - 1 >= 0 && !(newGrid[row-1][col] === 'drone' || newGrid[row-1][col] === 'car' || newGrid[row-1][col] === 'tree')){
                    if(newGrid[row-1][col] === '-'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row-1][col] === 'player'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }


            if (row === playerPosition.playerRow && col < playerPosition.playerCol) {
                if (col + 1 < grid[row].length && !(newGrid[row][col + 1] === 'drone' || newGrid[row][col + 1] === 'car' || newGrid[row][col + 1] === 'tree')) {
                    if(newGrid[row][col + 1] === '-'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col + 1] === 'player'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row + 1 < grid.length && !(newGrid[row+1][col] === 'drone' || newGrid[row+1][col] === 'car' || newGrid[row+1][col] === 'tree')){
                    if(newGrid[row+1][col] === '-'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row+1][col] === 'player'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row - 1 >= 0 && !(newGrid[row-1][col] === 'drone' || newGrid[row-1][col] === 'car' || newGrid[row-1][col] === 'tree')){
                    if(newGrid[row-1][col] === '-'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row-1][col] === 'player'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            if (row === playerPosition.playerRow && col > playerPosition.playerCol) {
                if (col - 1 >= 0 && !(newGrid[row][col - 1] === 'drone' || newGrid[row][col - 1] === 'car' || newGrid[row][col - 1] === 'tree')) {
                    if(newGrid[row][col - 1] === '-'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col - 1] === 'player'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row + 1 < grid.length && !(newGrid[row+1][col] === 'drone' || newGrid[row+1][col] === 'car' || newGrid[row+1][col] === 'tree')){
                    if(newGrid[row+1][col] === '-'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row+1][col] === 'player'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(row - 1 >= 0 && !(newGrid[row-1][col] === 'drone' || newGrid[row-1][col] === 'car' || newGrid[row-1][col] === 'tree')){
                    if(newGrid[row-1][col] === '-'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row-1][col] === 'player'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            if (row < playerPosition.playerRow && col === playerPosition.playerCol) {
                if (row + 1 < grid.length && !(newGrid[row+1][col] === 'drone' || newGrid[row+1][col] === 'car' || newGrid[row+1][col] === 'tree')) {
                    if(newGrid[row+1][col] === '-'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row+1][col] === 'player'){
                        newGrid[row+1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(col + 1 < grid.length && !(newGrid[row][col + 1] === 'drone' || newGrid[row][col + 1] === 'car' || newGrid[row][col + 1] === 'tree')){
                    if(newGrid[row][col + 1] === '-'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col + 1] === 'player'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }  
                else if(col - 1 >= 0 && !(newGrid[row][col - 1] === 'drone' || newGrid[row][col - 1] === 'car' || newGrid[row][col - 1] === 'tree')){
                    if(newGrid[row][col - 1] === '-'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col - 1] === 'player'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }

            if (row > playerPosition.playerRow && col === playerPosition.playerCol) {
                if (row - 1 >=0 && !(newGrid[row-1][col] === 'drone' || newGrid[row-1][col] === 'car' || newGrid[row-1][col] === 'tree')) {
                    if(newGrid[row-1][col] === '-'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row-1][col] === 'player'){
                        newGrid[row-1][col] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
                else if(col + 1 < grid.length && !(newGrid[row][col + 1] === 'drone' || newGrid[row][col + 1] === 'car' || newGrid[row][col + 1] === 'tree')){
                    if(newGrid[row][col + 1] === '-'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col + 1] === 'player'){
                        newGrid[row][col + 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }  
                else if(col - 1 >= 0 && !(newGrid[row][col - 1] === 'drone' || newGrid[row][col - 1] === 'car' || newGrid[row][col - 1] === 'tree')){
                    if(newGrid[row][col - 1] === '-'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                    }else if(newGrid[row][col - 1] === 'player'){
                        newGrid[row][col - 1] = type;
                        newGrid[row][col] = '-';
                        setMessage("Game Over")
                        setEndGame(true);
                    }else{
                        newGrid[row][col] = '-';
                        setScore(scoreRef.current+1);
                    }
                }
            }
            setGrid([...newGrid]);
        }, delay);
            delay += 500; // Ajout d'un délai de 500ms entre chaque déplacement
        });
        
        
        
        setTimeout(() => {
            setMoving(false);
            if (!(endGameRef.current)) {
                setMessage('Ready for play ');
            }
            if(scoreRef.current === 7 )
                {
                    setMessage("You win")
                    setEndGame(true);
                }
        }, delay);
    };
    

    const moveElementsTowardsPlayer = () => {
        const elementPositions = findElementsPositions();
        const { playerRow, playerCol } = findPlayerPosition(grid);
        moveElementsOneStepRight(elementPositions,{ playerRow, playerCol });
    };

    const movePlayerH = () => {
        const { playerRow, playerCol } = findPlayerPosition(grid);
        const newGrid = [...grid]; 
        if (playerRow - 1 >=0 && newGrid[playerRow-1][playerCol] === '-') {
            newGrid[playerRow-1][playerCol] = 'player';
            newGrid[playerRow][playerCol] = '-';
            setGrid(newGrid);
        }
        moveElementsTowardsPlayer();
    };

    const movePlayerB = () => {
        const { playerRow, playerCol } = findPlayerPosition(grid);
        const newGrid = [...grid]; 
        if (playerRow + 1 < grid.length && newGrid[playerRow+1][playerCol] === '-') {
            newGrid[playerRow+1][playerCol] = 'player';
            newGrid[playerRow][playerCol] = '-';
            setGrid(newGrid);
        }   
        moveElementsTowardsPlayer();
    };

    const movePlayerD = () => {
        const { playerRow, playerCol } = findPlayerPosition(grid);
        const newGrid = [...grid]; 
        if (playerCol + 1 < grid.length && newGrid[playerRow][playerCol+ 1] === '-') {
            newGrid[playerRow][playerCol+ 1] = 'player';
            newGrid[playerRow][playerCol] = '-';
            setGrid(newGrid);
        }
        moveElementsTowardsPlayer();
    };

    const movePlayerG = () => {
        const { playerRow, playerCol } = findPlayerPosition(grid);
        const newGrid = [...grid]; 
        if (playerCol - 1 >=0 && newGrid[playerRow][playerCol-1] === '-') {
            newGrid[playerRow][playerCol-1] = 'player';
            newGrid[playerRow][playerCol] = '-';
            setGrid(newGrid);
        }
        moveElementsTowardsPlayer();
    };
    
    return (
        <div className="section1">
            <div className="section2">
                <div className="grid-container">
                    <div className="grid">
                        {grid.map((row, rowIndex) => (
                            <div className="row" key={rowIndex}>
                                {row.map((element, colIndex) => (
                                    <Cell 
                                        type={element} 
                                        key={colIndex} 
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="controls">
                    <div className="message">{message}</div>
                    <div className="message">Thieves Captured: {score}</div>
                    <div className="direction-buttons">
                        <button onClick={movePlayerH} style={{ gridArea: 'up' }} disabled={moving || endGame}>▲</button>
                        <button onClick={movePlayerG} style={{ gridArea: 'left' }} disabled={moving || endGame}>◄</button>
                        <button onClick={movePlayerD} style={{ gridArea: 'right' }} disabled={moving || endGame}>►</button>
                        <button onClick={movePlayerB} style={{ gridArea: 'down' }} disabled={moving || endGame}>▼</button>
                    </div>
                </div>
               
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="End Game Modal"
                className="modal"
                overlayClassName="overlay"
            >
                <div className="modal-content">
                    {msgRef.current!=="Game Over" ? (
                        <i className="fas fa-trophy victory-icon"></i>
                    ) : (
                        <i className="fas fa-times defeat-icon"></i>
                    )}
                    <h2>{msgRef.current!=="Game Over" ? 'Victory!' : 'Game Over'}</h2>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            </Modal>
        </div>
    );
}
// Styles for the modal
const modalStyles = `
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        text-align: center;
    }
    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .victory-icon {
        color: #FFD700; /* Gold color */
        font-size: 3rem;
        margin-bottom: 20px;
    }
    .defeat-icon {
        color: #FF6347; /* Tomato color */
        font-size: 3rem;
        margin-bottom: 20px;
    }
    .modal h2 {
        margin-top: 0;
        font-size: 2rem;
        color: #333;
    }
    .modal p {
        font-size: 1.2rem;
        color: #666;
    }
    .modal button {
        margin-top: 20px;
        padding: 12px 24px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    }
    .modal button:hover {
        background-color: #0056b3;
    }
`;
export default Grid;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalStyles;
document.head.appendChild(styleSheet);