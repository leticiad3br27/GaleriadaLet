const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const gameSection = document.getElementById('game-section');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

let gameActive = true;
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let mode = '';
let scores = { X: 0, O: 0 };
let waitingComputer = false;

document.getElementById('two-players').addEventListener('click', () => {
    mode = 'two-players';
    resetScores();
    startGame();
});

document.getElementById('vs-computer').addEventListener('click', () => {
    mode = 'vs-computer';
    resetScores();
    startGame();
});

restartButton.addEventListener('click', startGame);

function resetScores() {
    scores = { X: 0, O: 0 };
    updateScoreboard();
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function startGame() {
    gameSection.classList.remove('hidden');
    board.fill('');
    gameActive = true;
    waitingComputer = false;
    currentPlayer = 'X';
    statusDisplay.innerHTML = `É a vez do jogador ${currentPlayer}`;
    restartButton.classList.add('hidden');
    createBoard();
}

function createBoard() {
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-index', index);
        cellElement.innerHTML = cell;
        cellElement.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    if (!gameActive || waitingComputer) return;

    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (board[clickedCellIndex] !== '') return;

    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    if (checkResult()) return;

    if (mode === 'vs-computer' && currentPlayer === 'O') {
        waitingComputer = true;
        setTimeout(() => {
            computerMove();
            waitingComputer = false;
        }, 500);
    }
}

function checkResult() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusDisplay.innerHTML = `Jogador ${currentPlayer} venceu!`;
            scores[currentPlayer]++;
            updateScoreboard();
            gameActive = false;
            restartButton.classList.remove('hidden');
            highlightWinner(condition);
            return true;
        }
    }

    if (!board.includes('')) {
        statusDisplay.innerHTML = 'Empate!';
        gameActive = false;
        restartButton.classList.remove('hidden');
        return true;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `É a vez do jogador ${currentPlayer}`;
    return false;
}

function highlightWinner(indices) {
    indices.forEach(index => {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add('winner');
    });
}

function computerMove() {
    let availableCells = board.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cellToPlay = availableCells[randomIndex];

    board[cellToPlay] = currentPlayer;
    const cellElement = document.querySelector(`.cell[data-index='${cellToPlay}']`);
    cellElement.innerHTML = currentPlayer;

    checkResult();
}
