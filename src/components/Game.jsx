import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { checkCollision } from '../hooks/useCollision';
import ScoreBoard from './ScoreBoard';
import GameOver from './GameOver';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GRAVITY,
  JUMP_STRENGTH,
  OBSTACLE_WIDTH,
  OBSTACLE_GAP,
  OBSTACLE_SPEED_INITIAL,
  SPAWN_RATE,
  BIRD_SIZE
} from '../utils/constants';

const Game = ({ onMenu, highScore, setHighScore, selectedBird, soundEnabled, setSoundEnabled }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [birdY, setBirdY] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [obstacleSpeed, setObstacleSpeed] = useState(OBSTACLE_SPEED_INITIAL);
  const [particles, setParticles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  // Audio refs
  const bgMusicRef = useRef(null);
  const gameOverMusicRef = useRef(null);

  // Refs to avoid stale closures in game loop
  const birdYRef = useRef(birdY);
  const birdVelRef = useRef(birdVelocity);
  const obstaclesRef = useRef(obstacles);
  const timeSinceLastSpawn = useRef(0);
  const gameSpeedRef = useRef(obstacleSpeed);

  useEffect(() => { birdYRef.current = birdY; }, [birdY]);
  useEffect(() => { birdVelRef.current = birdVelocity; }, [birdVelocity]);
  useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);
  useEffect(() => { gameSpeedRef.current = obstacleSpeed; }, [obstacleSpeed]);

  const jump = useCallback(() => {
    if (isGameOver || isPaused) return;
    setBirdVelocity(JUMP_STRENGTH);

    // Play jump sound (placeholder)
    // if (soundEnabled) {
    //   jumpSoundRef.current?.play();
    // }
  }, [isGameOver, isPaused, soundEnabled]);

  const handleInput = useCallback((e) => {
    // Don't prevent default on buttons or if game over
    if (e.target.closest && e.target.closest('button')) return;
    if (isGameOver || isPaused) return;

    if (e.code === 'Space' || e.type === 'touchstart' || e.type === 'mousedown') {
      if (e.cancelable) {
        e.preventDefault();
      }
      jump();
    }
  }, [jump, isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    window.addEventListener('touchstart', handleInput, { passive: false });
    window.addEventListener('mousedown', handleInput);

    return () => {
      window.removeEventListener('keydown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('mousedown', handleInput);
    };
  }, [handleInput]);

  useEffect(() => {
    // Set audio volume (it was very loud)
    if (bgMusicRef.current) bgMusicRef.current.volume = 0.2;
    if (gameOverMusicRef.current) gameOverMusicRef.current.volume = 0.4;

    if (soundEnabled && !isPaused && !isGameOver) {
      bgMusicRef.current?.play().catch(e => console.log('Audio play failed', e));
    } else {
      bgMusicRef.current?.pause();
    }
  }, [soundEnabled, isPaused, isGameOver]);

  const spawnObstacle = () => {
    const minHeight = 50;
    const maxHeight = window.innerHeight - OBSTACLE_GAP - minHeight;
    const gapTop = Math.random() * (maxHeight - minHeight) + minHeight;

    setObstacles((prev) => [
      ...prev,
      { x: window.innerWidth, gapTop, gapSize: OBSTACLE_GAP, passed: false }
    ]);
  };

  const updatePhysics = (deltaTime) => {
    if (isGameOver || isPaused) return;

    const timeScale = deltaTime / 16.66; // Normalize to 60fps

    let newY = birdYRef.current;
    let newVel = birdVelRef.current;

    newVel += GRAVITY * timeScale;
    newY += newVel * timeScale;

    setBirdY(newY);
    setBirdVelocity(newVel);

    // Update obstacles
    setObstacles((prev) => {
      return prev.map(obs => ({
        ...obs,
        x: obs.x - (gameSpeedRef.current * timeScale)
      })).filter(obs => obs.x + OBSTACLE_WIDTH > -100);
    });

    // Score update
    setObstacles((prev) => {
      let scoreIncrement = 0;
      const updated = prev.map(obs => {
        if (!obs.passed && obs.x + OBSTACLE_WIDTH < 50) {
          scoreIncrement++;
          return { ...obs, passed: true };
        }
        return obs;
      });

      if (scoreIncrement > 0) {
        setScore(s => {
          const newScore = s + scoreIncrement;
          // Increase difficulty every 10 points
          if (newScore % 10 === 0) {
            setObstacleSpeed(speed => Math.min(speed + 0.5, 8));
          }
          return newScore;
        });
      }
      return updated;
    });

    // Spawning logic
    timeSinceLastSpawn.current += deltaTime;
    // Base spawn rate divided by relative speed
    const currentSpawnRate = SPAWN_RATE / (gameSpeedRef.current / OBSTACLE_SPEED_INITIAL);
    if (timeSinceLastSpawn.current > currentSpawnRate) {
      spawnObstacle();
      timeSinceLastSpawn.current = 0;
    }

    // Collision detection
    if (checkCollision(newY, obstaclesRef.current)) {
      gameOver();
    }
  };

  useGameLoop(updatePhysics, isPlaying && !isPaused && !isGameOver);

  const gameOver = () => {
    setIsGameOver(true);
    setIsPlaying(false);

    // Create explosion particles
    const newParticles = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + BIRD_SIZE / 2,
      y: birdYRef.current + BIRD_SIZE / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10
    }));
    setParticles(newParticles);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('manjilMilkyHighScore', score);
    }

    if (soundEnabled) {
      bgMusicRef.current?.pause();
      gameOverMusicRef.current?.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const resetGame = () => {
    const startY = window.innerHeight / 2;
    setBirdY(startY);
    birdYRef.current = startY; // sync physics immediately
    
    setBirdVelocity(0);
    birdVelRef.current = 0;    // sync physics immediately
    
    setObstacles([]);
    obstaclesRef.current = []; // fix out of sync physics
    setScore(0);
    scoreRef.current = 0;      // fix out of sync physics
    setObstacleSpeed(OBSTACLE_SPEED_INITIAL);
    setIsGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setParticles([]);
    timeSinceLastSpawn.current = 0;

    // Stop game over music and reset it to the beginning
    if (gameOverMusicRef.current) {
      gameOverMusicRef.current.pause();
      gameOverMusicRef.current.currentTime = 0;
    }
  };

  return (
    <div className="game-container">
      <div className="top-bar">
        <button
          className="icon-btn"
          onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
        <button
          className="icon-btn"
          onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <ScoreBoard score={score} />

      {/* Bird */}
      {!isGameOver && (
        <div
          className="bird"
          style={{
            transform: `translate(50px, ${birdY}px) rotate(${Math.min(
              Math.max(birdVelocity * 4, -20),
              90
            )}deg)`,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
          }}
        >
          {/* Custom flying object image */}
          <img
            src={selectedBird}
            alt="Bird"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              transform: selectedBird === '/bird3.png' ? 'scale(1.75)' : 'none'
            }}
          />
        </div>
      )}

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            width: 10,
            height: 10,
            transform: `translate(${p.vx * 10}px, ${p.vy * 10}px)`
          }}
        />
      ))}

      {/* Obstacles */}
      {obstacles.map((obs, i) => (
        <React.Fragment key={i}>
          {/* Top Pipe */}
          <div
            className="obstacle"
            style={{
              left: obs.x,
              top: 0,
              width: OBSTACLE_WIDTH,
              height: obs.gapTop,
            }}
          />
          {/* Bottom Pipe */}
          <div
            className="obstacle"
            style={{
              left: obs.x,
              top: obs.gapTop + obs.gapSize,
              width: OBSTACLE_WIDTH,
              height: window.innerHeight - (obs.gapTop + obs.gapSize),
            }}
          />
        </React.Fragment>
      ))}

      {isPaused && !isGameOver && (
        <div className="menu-overlay">
          <div className="glass-panel" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            PAUSED
          </div>
        </div>
      )}

      {isGameOver && (
        <GameOver
          score={score}
          highScore={highScore}
          onRestart={resetGame}
          onMenu={onMenu}
        />
      )}

      {/* Audio Elements (User can replace src with actual paths) */}
      <audio ref={bgMusicRef} src={selectedBird === '/bird4.png' ? "/bg-shabbir.mp3" : selectedBird === '/bird3.png' ? "/bg-abhinav.mp3" : selectedBird === '/bird2.png' ? "/bg-manjil.mp3" : "/bg-music.mp3"} loop preload="auto" />
      <audio ref={gameOverMusicRef} src={selectedBird === '/bird3.png' ? "/gameover-abhinav.mp3" : selectedBird === '/bird.png' ? "/gameover-kshitij.mp3" : "/gameover.mp3"} preload="auto" />
    </div>
  );
};

export default Game;
