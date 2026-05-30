import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import './styles/game.css';

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu' or 'game'
  const [highScore, setHighScore] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBird, setSelectedBird] = useState('/bird.png');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const savedScore = localStorage.getItem('manjilMilkyHighScore');
    if (savedScore) {
      setHighScore(parseInt(savedScore, 10));
    }
  }, []);

  // Generate clouds for background
  const clouds = Array.from({ length: 5 }).map((_, i) => (
    <div 
      key={i} 
      className="cloud" 
      style={{ 
        top: `${Math.random() * 50 + 10}%`, 
        animationDuration: `${Math.random() * 20 + 20}s`,
        animationDelay: `${-(Math.random() * 20)}s`,
        transform: 'scale(1.5)',
        width: '60px',
        height: '20px'
      }} 
    />
  ));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      


      {/* Main Game Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* Decorative background clouds */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
          {clouds}
        </div>

        {gameState === 'menu' && (
          <MainMenu 
            onStart={() => setGameState('game')} 
            highScore={highScore} 
            selectedBird={selectedBird}
            setSelectedBird={setSelectedBird}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
        
        {gameState === 'game' && (
          <Game 
            onMenu={() => setGameState('menu')} 
            highScore={highScore}
            setHighScore={setHighScore}
            selectedBird={selectedBird}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
      </div>
    </div>
  );
}

export default App;
