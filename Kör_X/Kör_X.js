let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let aiMode = false;

const gameBoard = document.getElementById("game-board");
const statusDiv = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const twoPlayerBtn = document.getElementById("two-player-btn");
const aiBtn = document.getElementById("ai-btn");


function createBoard() {
  gameBoard.innerHTML = "";
  board = Array(9).fill(null);
  gameActive = true;
  currentPlayer = "X";
  statusDiv.textContent = "";
  restartBtn.style.display = "none";

  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  });
}


function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (board[index] || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add("taken");

  if (checkWinner()) {
    statusDiv.textContent = `${currentPlayer} játékos nyert.`;
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  if (board.every(cell => cell !== null)) {
    statusDiv.textContent = "A játék döntetlen.";
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (aiMode && currentPlayer === "O") {
    makeAiMove();
  }
}


function makeAiMove() {
  const bestMove = findBestMove(board, "O");
  board[bestMove] = "O";

  const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
  cell.textContent = "O";
  cell.classList.add("taken");

  if (checkWinner()) {
    statusDiv.textContent = `${currentPlayer} játékos nyert.`;
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  if (board.every(cell => cell !== null)) {
    statusDiv.textContent = "A játék döntetlen.";
    gameActive = false;
    restartBtn.style.display = "block";
    return;
  }

  currentPlayer = "X";
}


function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}


function minimax(board, depth, isMaximizing) {
  if (checkWinner()) {
    return isMaximizing ? -10 + depth : 10 - depth;
  }
  if (board.every(cell => cell !== null)) {
    return 0;
  }

  const scores = [];
  const moves = [];

  board.forEach((cell, index) => {
    if (!cell) {
      board[index] = isMaximizing ? "O" : "X";
      const score = minimax(board, depth + 1, !isMaximizing);
      scores.push(score);
      moves.push(index);
      board[index] = null;
    }
  });

  return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

function findBestMove(board, player) {
  let bestScore = -Infinity;
  let move = -1;

  board.forEach((cell, index) => {
    if (!cell) {
      board[index] = player;
      const score = minimax(board, 0, false);
      board[index] = null;

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}


restartBtn.addEventListener("click", createBoard);
twoPlayerBtn.addEventListener("click", () => {
  aiMode = false;
  createBoard();
});
aiBtn.addEventListener("click", () => {
  aiMode = true;
  createBoard();
});


createBoard();
