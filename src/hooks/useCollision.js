import { GAME_WIDTH, GAME_HEIGHT, BIRD_SIZE, OBSTACLE_WIDTH } from '../utils/constants';

export const checkCollision = (birdY, obstacles) => {
  // Calculate hitbox padding (makes hitbox smaller than visual size)
  const paddingX = BIRD_SIZE * 0.3; // 30% padding on left/right
  const paddingY = BIRD_SIZE * 0.3; // 30% padding on top/bottom

  const birdTop = birdY + paddingY;
  const birdBottom = birdY + BIRD_SIZE - paddingY;
  const birdLeft = 50 + paddingX; // Fixed bird X position
  const birdRight = 50 + BIRD_SIZE - paddingX;

  // Ground and Ceiling collision
  if (birdBottom >= window.innerHeight || birdTop <= 0) {
    return true;
  }

  // Obstacle collision
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    const obsLeft = obs.x;
    const obsRight = obs.x + OBSTACLE_WIDTH;
    const gapTop = obs.gapTop;
    const gapBottom = obs.gapTop + obs.gapSize;

    // Check if bird is within horizontal bounds of obstacle
    if (birdRight > obsLeft && birdLeft < obsRight) {
      // Check if bird hits upper or lower pipe
      if (birdTop < gapTop || birdBottom > gapBottom) {
        return true;
      }
    }
  }

  return false;
};
