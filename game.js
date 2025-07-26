const player = document.getElementById('player');
const game = document.getElementById('game');
const objects = document.querySelectorAll('.object');
const infoBox = document.getElementById('infoBox');

let posX = 100;
let velocityY = 0;
let isJumping = false;

const keys = {
  left: false,
  right: false,
  up: false
};

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  if ((e.key === 'ArrowUp' || e.key === 'w') && !isJumping) {
    velocityY = 10;
    isJumping = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

function gameLoop() {
  // Movement
  if (keys.left) posX -= 4;
  if (keys.right) posX += 4;

  // Apply gravity
  velocityY -= 0.5;
  let posY = parseFloat(player.style.bottom) + velocityY;

  if (posY <= 80) {
    posY = 80;
    velocityY = 0;
    isJumping = false;
  }

  player.style.left = posX + 'px';
  player.style.bottom = posY + 'px';

  // Scroll screen
  game.scrollLeft = posX - 200;

  // Check collisions with objects
  objects.forEach(obj => {
    const objRect = obj.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const overlap = !(objRect.right < playerRect.left ||
                      objRect.left > playerRect.right ||
                      objRect.bottom < playerRect.top ||
                      objRect.top > playerRect.bottom);

    if (overlap) {
      infoBox.style.display = 'block';
      infoBox.textContent = obj.dataset.info;
    }
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
