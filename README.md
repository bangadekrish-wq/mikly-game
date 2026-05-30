# Manjil Milky

A fully responsive, modern Flappy Bird-style game built with React.

## Features
- **Modern Aesthetic**: Glassmorphism UI, gradient skies, CSS animations.
- **Progressive Difficulty**: Obstacle speed increases every 10 points.
- **Motivation System**: Shows motivational messages ("Keep Going!", "Manjil Is Near!") every 10 points.
- **Dark Mode**: Fully supported toggle for light/dark themes.
- **Performance**: Optimized physics engine utilizing `requestAnimationFrame` for a smooth 60fps experience.

## Adding Custom Assets

The game is ready for your custom assets. To use them:

1. Add your audio files to the `public/` folder:
   - `public/bg-music.mp3`
   - `public/game-over.mp3`
2. Add your custom character image to the `public/` folder:
   - `public/bird.png`

The game will automatically detect and load these files if they exist in the `public` folder. If they are missing, it safely falls back to the default "M" character and silent gameplay.
