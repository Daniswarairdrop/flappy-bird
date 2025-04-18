// Mendapatkan canvas dan context-nya
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ukuran bird
const birdWidth = 20;
const birdHeight = 20;
let birdX = 50;
let birdY = canvas.height / 2;
let birdSpeed = 0;

// Menambahkan gravitasi dan ketahanan terbang
const gravity = 0.6;
const lift = -15;

// Kecepatan dan jarak pipa
const pipeWidth = 50;
const pipeGap = 100;
let pipes = [];
let pipeSpeed = 2;

// Kontrol untuk game
let gameOver = false;

// Fungsi untuk menggambar bird
function drawBird() {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(birdX, birdY, birdWidth, birdHeight);
}

// Fungsi untuk menggambar pipa
function drawPipes() {
  pipes.forEach((pipe, index) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    
    // Menggerakkan pipa
    pipe.x -= pipeSpeed;
    
    // Menghapus pipa yang sudah keluar dari layar
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
    }
  });
}

// Fungsi untuk membuat pipa baru
function createPipe() {
  const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    top: pipeHeight,
  });
}

// Fungsi untuk menggambar dan menggerakkan bird
function moveBird() {
  birdSpeed += gravity;
  birdY += birdSpeed;
  
  // Membatasi bird agar tidak keluar dari layar
  if (birdY > canvas.height - birdHeight) {
    birdY = canvas.height - birdHeight;
    birdSpeed = 0;
  }
  
  if (birdY < 0) {
    birdY = 0;
    birdSpeed = 0;
  }
  
  drawBird();
}

// Fungsi untuk mendeteksi tabrakan dengan pipa
function detectCollision() {
  pipes.forEach((pipe) => {
    if (
      birdX + birdWidth > pipe.x &&
      birdX < pipe.x + pipeWidth &&
      (birdY < pipe.top || birdY + birdHeight > pipe.top + pipeGap)
    ) {
      gameOver = true;
    }
  });
}

// Fungsi untuk menampilkan game over
function drawGameOver() {
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Game Over', canvas.width / 2 - 90, canvas.height / 2);
}

// Fungsi untuk menggambar dan menggerakkan game
function gameLoop() {
  if (gameOver) {
    drawGameOver();
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  moveBird();
  drawPipes();
  detectCollision();
  
  // Membuat pipa baru setiap 90 frame
  if (Math.random() < 0.02) {
    createPipe();
  }
  
  requestAnimationFrame(gameLoop);
}

// Fungsi untuk mengontrol bird dengan klik
canvas.addEventListener('click', () => {
  if (gameOver) {
    birdY = canvas.height / 2;
    birdSpeed = 0;
    pipes = [];
    gameOver = false;
  } else {
    birdSpeed = lift;
  }
});

// Memulai game
gameLoop();
