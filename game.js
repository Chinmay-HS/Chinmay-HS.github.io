const player = document.getElementById('player');
const game = document.getElementById('game');
const objects = document.querySelectorAll('.object');
const infoBox = document.getElementById('infoBox');
const gate = document.getElementById('gate');
const trigger = document.querySelector('.puzzle-trigger');
const coins = document.querySelectorAll('.coin');

let posX = 100;
let velocityY = 0;
let isJumping = false;
let dashCooldown = false;
let jumpCount = 0;
let coinCount = 0;

const keys = {
  left: false,
  right: false,
  up: false
};

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;

  // Dash
  if (e.key === 'Shift' && !dashCooldown) {
    posX += keys.right ? 50 : keys.left ? -50 : 0;
    dashCooldown = true;
    setTimeout(() => dashCooldown = false, 500);
  }

  // Jump / Double Jump
  if ((e.key === 'ArrowUp' || e.key === 'w') && jumpCount < 2) {
    velocityY = 10;
    jumpCount++;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

function checkPuzzleCollision() {
  const trigRect = trigger.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  const overlap = !(trigRect.right < playerRect.left ||
                    trigRect.left > playerRect.right ||
                    trigRect.bottom < playerRect.top ||
                    trigRect.top > playerRect.bottom);

  if (overlap) {
    gate.style.display = 'none';
  }
}

function checkCoins() {
  coins.forEach((coin, index) => {
    const coinRect = coin.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    const overlap = !(coinRect.right < playerRect.left ||
                      coinRect.left > playerRect.right ||
                      coinRect.bottom < playerRect.top ||
                      coinRect.top > playerRect.bottom);

    if (overlap) {
      coin.remove();
      coinCount++;
      console.log("Coins:", coinCount);
    }
  });
}

function gameLoop() {
  // Movement
  if (keys.left) posX -= 4;
  if (keys.right) posX += 4;

  // Gravity
  velocityY -= 0.5;
  let posY = parseFloat(player.style.bottom) + velocityY;

  if (posY <= 80) {
    posY = 80;
    velocityY = 0;
    jumpCount = 0;
  }

  player.style.left = posX + 'px';
  player.style.bottom = posY + 'px';

  // Scroll camera
  game.scrollLeft = posX - 200;

  // Collision with text objects
  infoBox.style.display = 'none';
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

  checkPuzzleCollision();
  checkCoins();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Modal handling
function openModal(text) {
  document.getElementById('modalText').textContent = text;
  document.getElementById('modal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function () {
  document.getElementById('modal').style.display = 'none';
};
