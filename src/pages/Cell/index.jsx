import React from 'react';
import './style.css';

const icons = {
    player: '📍',
    car: '🚗',
    drone: '🚁',
    trap: '🌪️',
    tree: '🌳'
};
    
    
function Cell({ type}) {
    return (
        <div className="cell">
            {icons[type]}
        </div>
    );
}


export default Cell;