import React from 'react';

const GameOver = ({ score, highScore, onRestart, onMenu }) => {
  return (
    <div className="game-over-overlay">
      <div className="glass-panel">
        <h2 style={{ fontSize: '2.5rem', color: '#fc8181', margin: '0 0 20px 0' }}>Game Over</h2>
        
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          Score: <strong>{score}</strong>
        </div>
        
        <div style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#f6ad55' }}>
          Best: <strong>{highScore}</strong>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

          
          <button className="btn" style={{ background: '#4a5568' }} onClick={onMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
